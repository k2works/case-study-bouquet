package com.example.frere.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * WebJars 経由で Bootstrap と htmx の静的リソースが配信されることを検証するテスト。
 * build.gradle に WebJars 依存が追加された後にパスすることを前提とする。
 */
@SpringBootTest
@AutoConfigureMockMvc
class WebJarsResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void BootstrapのCSSがWebJars経由でアクセスできる() throws Exception {
        // Given: Bootstrap WebJar が依存に含まれている

        // When: Bootstrap CSS へのリクエストを送信する

        // Then: HTTP 200 が返ること
        mockMvc.perform(get("/webjars/bootstrap/css/bootstrap.min.css"))
                .andExpect(status().isOk());
    }

    @Test
    void BootstrapのJSがWebJars経由でアクセスできる() throws Exception {
        // Given: Bootstrap WebJar が依存に含まれている

        // When: Bootstrap JS へのリクエストを送信する

        // Then: HTTP 200 が返ること
        mockMvc.perform(get("/webjars/bootstrap/js/bootstrap.bundle.min.js"))
                .andExpect(status().isOk());
    }

    @Test
    void htmxのJSがWebJars経由でアクセスできる() throws Exception {
        // Given: htmx WebJar が依存に含まれている

        // When: htmx JS へのリクエストを送信する

        // Then: HTTP 200 が返ること
        mockMvc.perform(get("/webjars/htmx.org/dist/htmx.min.js"))
                .andExpect(status().isOk());
    }

    @Test
    void 存在しないWebJarsリソースへのアクセスで404が返る() throws Exception {
        // Given: 存在しないリソースパス

        // When: 存在しないリソースへのリクエストを送信する

        // Then: HTTP 404 が返ること
        mockMvc.perform(get("/webjars/nonexistent/resource.js"))
                .andExpect(status().isNotFound());
    }
}
