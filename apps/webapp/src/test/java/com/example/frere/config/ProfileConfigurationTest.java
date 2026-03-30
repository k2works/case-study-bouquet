package com.example.frere.config;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Spring Boot プロファイル設定が正しく動作することを検証するテスト。
 * default プロファイル: H2 インメモリ DB
 * product プロファイル: PostgreSQL（プロパティ値のみ検証、DB 接続は行わない）
 */
class ProfileConfigurationTest {

    @Nested
    @SpringBootTest
    class DefaultProfile {

        @Autowired
        private Environment environment;

        @Test
        void デフォルトプロファイルでH2ドライバが設定されている() {
            // Given: デフォルトプロファイルでアプリケーションが起動

            // When: データソースのドライバクラスを取得

            // Then: H2 ドライバが設定されていること
            String driverClassName = environment.getProperty("spring.datasource.driver-class-name");
            assertThat(driverClassName).isEqualTo("org.h2.Driver");
        }

        @Test
        void デフォルトプロファイルでH2のJDBC_URLが設定されている() {
            // Given: デフォルトプロファイルでアプリケーションが起動

            // When: データソースのURLを取得

            // Then: H2 インメモリ URL が設定されていること
            String url = environment.getProperty("spring.datasource.url");
            assertThat(url).startsWith("jdbc:h2:mem:");
        }

        @Test
        void Flywayが有効になっている() {
            // Given: デフォルトプロファイルでアプリケーションが起動

            // When: Flyway の有効状態を取得

            // Then: Flyway が有効であること
            String flywayEnabled = environment.getProperty("spring.flyway.enabled");
            assertThat(flywayEnabled).isEqualTo("true");
        }
    }

    @Nested
    @SpringBootTest(
            webEnvironment = SpringBootTest.WebEnvironment.NONE,
            properties = {
                    "spring.autoconfigure.exclude="
                            + "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
                            + "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
                            + "org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration,"
                            + "org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration"
            }
    )
    @ActiveProfiles("product")
    class ProductProfile {

        @Autowired
        private Environment environment;

        @Test
        void productプロファイルでPostgreSQLドライバが設定されている() {
            // Given: product プロファイルでアプリケーションが起動

            // When: データソースのドライバクラスを取得

            // Then: PostgreSQL ドライバが設定されていること
            String driverClassName = environment.getProperty("spring.datasource.driver-class-name");
            assertThat(driverClassName).isEqualTo("org.postgresql.Driver");
        }

        @Test
        void productプロファイルでPostgreSQLのJDBC_URLが設定されている() {
            // Given: product プロファイルでアプリケーションが起動

            // When: データソースのURLを取得

            // Then: PostgreSQL の URL が設定されていること
            String url = environment.getProperty("spring.datasource.url");
            assertThat(url).startsWith("jdbc:postgresql://");
        }

        @Test
        void productプロファイルでFlywayが有効になっている() {
            // Given: product プロファイルでアプリケーションが起動

            // When: Flyway の有効状態を取得

            // Then: Flyway が有効であること
            String flywayEnabled = environment.getProperty("spring.flyway.enabled");
            assertThat(flywayEnabled).isEqualTo("true");
        }
    }
}
