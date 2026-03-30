'use strict';

import { execSync } from 'child_process';
import path from 'path';

const WEBAPP_DIR = path.join(process.cwd(), 'apps', 'webapp');

/**
 * Gradle コマンドを webapp ディレクトリで実行
 * @param {string} args - Gradle に渡す引数
 */
function gradle(args) {
  execSync(`./gradlew ${args}`, { stdio: 'inherit', cwd: WEBAPP_DIR });
}

/**
 * webapp タスクを gulp に登録する
 * @param {import('gulp').Gulp} gulp - Gulp インスタンス
 */
export default function (gulp) {
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
