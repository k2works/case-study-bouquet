'use strict';

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const WEBAPP_DIR = path.join(process.cwd(), 'apps', 'webapp');
const IS_WIN = process.platform === 'win32';
const REQUIRED_JAVA_VERSION = 25;

/**
 * コマンドが利用可能か確認する
 * @param {string} cmd - 確認するコマンド
 * @returns {boolean}
 */
function isCommandAvailable(cmd) {
  try {
    execSync(IS_WIN ? `where ${cmd}` : `command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Java のメジャーバージョンを取得する
 * @returns {number|null} メジャーバージョン番号。取得できない場合は null
 */
function getJavaVersion() {
  try {
    const output = execSync('java -version 2>&1', { encoding: 'utf-8' });
    const match = output.match(/version "(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

/**
 * nix が利用可能か確認する
 * @returns {boolean}
 */
function isNixAvailable() {
  return isCommandAvailable('nix');
}

/**
 * nix develop シェル内でコマンドを実行する
 * @param {string} cmd - 実行するコマンド
 * @param {Object} opts - execSync オプション
 */
function runInNix(cmd, opts = {}) {
  execSync(`nix develop .#java --command bash -c '${cmd}'`, {
    stdio: 'inherit',
    cwd: process.cwd(),
    ...opts,
  });
}

/**
 * Gradle コマンドを webapp ディレクトリで実行
 * @param {string} args - Gradle に渡す引数
 */
function gradle(args) {
  const gradlew = IS_WIN ? 'gradlew.bat' : './gradlew';
  execSync(`${gradlew} ${args}`, { stdio: 'inherit', cwd: WEBAPP_DIR });
}

/**
 * webapp タスクを gulp に登録する
 * @param {import('gulp').Gulp} gulp - Gulp インスタンス
 */
export default function (gulp) {
  gulp.task('webapp:setup', (done) => {
    try {
      console.log('=== webapp セットアップ開始 ===');
      console.log(`プラットフォーム: ${process.platform}`);

      // 1. Java SDK の確認
      const javaVersion = getJavaVersion();
      const hasRequiredJava = javaVersion !== null && javaVersion >= REQUIRED_JAVA_VERSION;

      if (hasRequiredJava) {
        console.log(`Java ${javaVersion} を検出しました（必要: ${REQUIRED_JAVA_VERSION}+）`);
      } else {
        const reason = javaVersion === null
          ? 'Java が見つかりません'
          : `Java ${javaVersion} は要件未達（必要: ${REQUIRED_JAVA_VERSION}+）`;
        console.log(reason);

        if (isNixAvailable()) {
          console.log('nix develop .#java を使用してセットアップします...');
          runInNix(`cd apps/webapp && ${IS_WIN ? 'gradlew.bat' : './gradlew'} build -x test`);
          console.log('=== webapp セットアップ完了（nix 経由） ===');
          done();
          return;
        }

        done(new Error(
          `Java ${REQUIRED_JAVA_VERSION}+ が必要です。以下のいずれかで対応してください:\n` +
          '  1. SDKMAN: sdk install java 25-open\n' +
          '  2. Homebrew: brew install openjdk@25\n' +
          '  3. Nix: nix develop .#java\n' +
          '  4. Windows: winget install EclipseAdoptium.Temurin.25.JDK'
        ));
        return;
      }

      // 2. Gradle Wrapper の確認
      const gradlewPath = path.join(WEBAPP_DIR, IS_WIN ? 'gradlew.bat' : 'gradlew');
      if (!fs.existsSync(gradlewPath)) {
        done(new Error(`Gradle Wrapper が見つかりません: ${gradlewPath}`));
        return;
      }
      console.log('Gradle Wrapper を検出しました');

      // 3. 依存関係の解決とビルド
      console.log('依存関係を解決しています...');
      gradle('dependencies --configuration compileClasspath -q');
      console.log('依存関係の解決が完了しました');

      console.log('ビルドを実行しています...');
      gradle('build -x test');
      console.log('ビルドが完了しました');

      // 4. テスト実行
      console.log('テストを実行しています...');
      gradle('test');
      console.log('テストが完了しました');

      console.log('=== webapp セットアップ完了 ===');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('webapp:build', (done) => {
    try {
      console.log('Building webapp...');
      gradle('build -x test');
      console.log('Build completed.');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('webapp:test', (done) => {
    try {
      console.log('Running webapp tests...');
      gradle('test');
      console.log('Tests completed.');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('webapp:check', (done) => {
    try {
      console.log('Running webapp quality checks...');
      gradle('checkstyleMain spotbugsMain');
      console.log('Quality checks completed.');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('webapp:dev', (done) => {
    try {
      console.log('Starting webapp dev server...');
      gradle('bootRun');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('webapp:tdd', (done) => {
    try {
      console.log('Starting webapp TDD mode...');
      gradle('test --continuous');
      done();
    } catch (error) {
      done(error);
    }
  });
}
