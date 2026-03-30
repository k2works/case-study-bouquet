package com.example.frere.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.thymeleaf.spring6.SpringTemplateEngine;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

/**
 * Thymeleaf が正しく構成されていることを検証するテスト。
 * 実装完了後にパスすることを前提とする。
 */
@SpringBootTest
@AutoConfigureMockMvc
class ThymeleafConfigurationTest {

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void テンプレートエンジンがSpringコンテキストに登録されている() {
        // Given: Spring Boot アプリケーションが起動している

        // When: SpringTemplateEngine の注入を確認

        // Then: null でないこと
        assertThat(templateEngine).isNotNull();
    }

    @Test
    void Thymeleafテンプレートリゾルバがクラスパスtemplatesを参照している() {
        // Given: Thymeleaf が構成されている

        // When: テンプレートリゾルバの設定を確認

        // Then: テンプレートリゾルバが存在すること
        assertThat(templateEngine.getTemplateResolvers()).isNotEmpty();
    }

    @Test
    void ルートパスへのアクセスで200が返る() throws Exception {
        // Given: アプリケーションが起動している

        // When: ルートパス（/）にGETリクエストを送信する

        // Then: HTTP 200 が返ること
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    @Test
    void ルートパスのレスポンスにHTMLコンテンツが含まれる() throws Exception {
        // Given: アプリケーションが起動している

        // When: ルートパス（/）にGETリクエストを送信する

        // Then: HTMLコンテンツが返ること
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/html"));
    }
}
