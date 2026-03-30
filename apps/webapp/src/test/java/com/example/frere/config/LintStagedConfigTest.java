package com.example.frere.config;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * package.json の lint-staged 設定が品質ゲート要件を満たしていることを検証する。
 * タスク指示書 2-6: pre-commit フックで Checkstyle と SpotBugs が実行される。
 */
class LintStagedConfigTest {

    private static final Path PROJECT_ROOT = resolveProjectRoot();

    @Test
    void lintStagedにcheckstyleMainが含まれている() throws IOException {
        // Given: プロジェクトルートの package.json
        String content = Files.readString(PROJECT_ROOT.resolve("package.json"));

        // Then: lint-staged の Java ファイル設定に checkstyleMain が含まれる
        assertThat(content)
                .as("lint-staged should include checkstyleMain for pre-commit quality gate")
                .contains("checkstyleMain");
    }

    @Test
    void lintStagedにspotbugsMainが含まれている() throws IOException {
        // Given: プロジェクトルートの package.json
        String content = Files.readString(PROJECT_ROOT.resolve("package.json"));

        // Then: lint-staged の Java ファイル設定に spotbugsMain が含まれる
        assertThat(content)
                .as("lint-staged should include spotbugsMain for pre-commit quality gate")
                .contains("spotbugsMain");
    }

    private static Path resolveProjectRoot() {
        Path current = Path.of(System.getProperty("user.dir"));
        // apps/webapp から実行された場合、2階層上がプロジェクトルート
        if (Files.exists(current.resolve("package.json"))) {
            return current;
        }
        Path root = current.resolve("../..");
        if (Files.exists(root.resolve("package.json"))) {
            return root.normalize();
        }
        return current;
    }
}
