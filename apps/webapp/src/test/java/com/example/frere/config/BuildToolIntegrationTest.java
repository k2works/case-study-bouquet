package com.example.frere.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Gradle ビルドツール設定の統合テスト。
 * Checkstyle、SpotBugs、JaCoCo の Gradle タスクが存在し実行可能なことを検証する。
 * CI 環境や明示的な指定時にのみ実行される。
 */
@EnabledIfEnvironmentVariable(named = "RUN_BUILD_TOOL_TESTS", matches = "true")
class BuildToolIntegrationTest {

    private static final Path PROJECT_DIR = resolveProjectDir();

    @Test
    void Gradleビルドが成功する() throws Exception {
        // Given: プロジェクトディレクトリに build.gradle が存在する

        // When: ./gradlew build -x test を実行する
        ProcessResult result = runGradle("build", "-x", "test");

        // Then: 終了コード 0 で成功すること
        assertThat(result.exitCode())
                .as("Gradle build should succeed. Output: %s", result.output())
                .isEqualTo(0);
    }

    @Test
    void CheckstyleMainタスクが存在する() throws Exception {
        // Given: build.gradle に checkstyle プラグインが設定されている

        // When: ./gradlew tasks を実行して checkstyleMain を検索する
        ProcessResult result = runGradle("tasks", "--all");

        // Then: checkstyleMain タスクが存在すること
        assertThat(result.output())
                .as("checkstyleMain task should exist in Gradle tasks")
                .contains("checkstyleMain");
    }

    @Test
    void SpotBugsMainタスクが存在する() throws Exception {
        // Given: build.gradle に spotbugs プラグインが設定されている

        // When: ./gradlew tasks を実行して spotbugsMain を検索する
        ProcessResult result = runGradle("tasks", "--all");

        // Then: spotbugsMain タスクが存在すること
        assertThat(result.output())
                .as("spotbugsMain task should exist in Gradle tasks")
                .contains("spotbugsMain");
    }

    @Test
    void JaCoCoReportタスクが存在する() throws Exception {
        // Given: build.gradle に jacoco プラグインが設定されている

        // When: ./gradlew tasks を実行して jacocoTestReport を検索する
        ProcessResult result = runGradle("tasks", "--all");

        // Then: jacocoTestReport タスクが存在すること
        assertThat(result.output())
                .as("jacocoTestReport task should exist in Gradle tasks")
                .contains("jacocoTestReport");
    }

    @Test
    void Checkstyle設定ファイルが存在する() {
        // Given: Checkstyle 設定ファイルのパス
        Path checkstyleConfig = PROJECT_DIR.resolve("config/checkstyle/checkstyle.xml");

        // When: ファイルの存在を確認する

        // Then: ファイルが存在すること
        assertThat(Files.exists(checkstyleConfig))
                .as("Checkstyle config file should exist at %s", checkstyleConfig)
                .isTrue();
    }

    @Test
    void SpotBugs除外フィルタが存在する() {
        // Given: SpotBugs 除外フィルタのパス
        Path spotbugsExclude = PROJECT_DIR.resolve("config/spotbugs/exclude-filter.xml");

        // When: ファイルの存在を確認する

        // Then: ファイルが存在すること
        assertThat(Files.exists(spotbugsExclude))
                .as("SpotBugs exclude filter should exist at %s", spotbugsExclude)
                .isTrue();
    }

    private static Path resolveProjectDir() {
        Path current = Path.of(System.getProperty("user.dir"));
        if (Files.exists(current.resolve("build.gradle"))) {
            return current;
        }
        Path webappDir = current.resolve("apps/webapp");
        if (Files.exists(webappDir.resolve("build.gradle"))) {
            return webappDir;
        }
        return current;
    }

    private ProcessResult runGradle(String... args) throws Exception {
        String gradlew = System.getProperty("os.name").toLowerCase().contains("win")
                ? "gradlew.bat"
                : "./gradlew";

        String[] command = new String[args.length + 1];
        command[0] = gradlew;
        System.arraycopy(args, 0, command, 1, args.length);

        ProcessBuilder pb = new ProcessBuilder(command)
                .directory(PROJECT_DIR.toFile())
                .redirectErrorStream(true);

        Process process = pb.start();
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }
        }

        boolean completed = process.waitFor(120, TimeUnit.SECONDS);
        if (!completed) {
            process.destroyForcibly();
            return new ProcessResult(-1, "Process timed out after 120 seconds");
        }

        return new ProcessResult(process.exitValue(), output.toString());
    }

    private record ProcessResult(int exitCode, String output) {}
}
