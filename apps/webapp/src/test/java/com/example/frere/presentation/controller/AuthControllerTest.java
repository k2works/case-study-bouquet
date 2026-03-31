package com.example.frere.presentation.controller;

import com.example.frere.application.exception.DuplicateEmailException;
import com.example.frere.application.service.AuthService;
import com.example.frere.infrastructure.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Test
    void GET_register_会員登録画面が表示される() throws Exception {
        // When: GET /register にアクセスする
        mockMvc.perform(get("/register"))
                // Then: register ビューが返される
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("registerRequest"));
    }

    @Test
    void POST_register_正常系_ログイン画面にリダイレクトされる() throws Exception {
        // Given: 正常な登録リクエスト
        doNothing().when(authService).register(any());

        // When: POST /register を実行する
        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("email", "new@example.com")
                        .param("password", "password1")
                        .param("name", "田中 太郎")
                        .param("phone", "090-1234-5678")
                        .param("address", "東京都新宿区1-1-1"))
                // Then: /login?registered にリダイレクトされる
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?registered"));
    }

    @Nested
    @DisplayName("US014-1.4: 重複メール・パスワード不正のエラー処理")
    class バリデーションエラー処理 {

        @Test
        @DisplayName("重複メールアドレス登録時に日本語エラーメッセージが表示される")
        void POST_register_重複メールアドレスの場合_日本語エラーメッセージが表示される() throws Exception {
            // Given: 既に登録済みのメールアドレスで登録を試みる
            doThrow(new DuplicateEmailException("existing@example.com"))
                    .when(authService).register(any());

            // When: POST /register を実行する
            mockMvc.perform(post("/register")
                            .with(csrf())
                            .param("email", "existing@example.com")
                            .param("password", "password1")
                            .param("name", "山田 花子")
                            .param("phone", "080-9876-5432")
                            .param("address", "大阪府大阪市北区2-2-2"))
                    // Then: エラーメッセージが「このメールアドレスは既に登録されています」であること
                    .andExpect(status().isOk())
                    .andExpect(view().name("register"))
                    .andExpect(model().attribute("errorMessage", "このメールアドレスは既に登録されています"));
        }

        @Test
        @DisplayName("重複メールアドレス登録時にエラーメッセージがHTML内に描画される")
        void POST_register_重複メールアドレスの場合_エラーメッセージがHTMLに含まれる() throws Exception {
            // Given: 既に登録済みのメールアドレスで登録を試みる
            doThrow(new DuplicateEmailException("existing@example.com"))
                    .when(authService).register(any());

            // When: POST /register を実行する
            mockMvc.perform(post("/register")
                            .with(csrf())
                            .param("email", "existing@example.com")
                            .param("password", "password1")
                            .param("name", "山田 花子")
                            .param("phone", "080-9876-5432")
                            .param("address", "大阪府大阪市北区2-2-2"))
                    // Then: レスポンスHTML内にエラーメッセージが含まれること
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("このメールアドレスは既に登録されています")));
        }

        @Test
        @DisplayName("ログイン失敗時に /login?error にリダイレクトされる")
        void POST_login_パスワード不正の場合_エラーパラメータ付きでリダイレクトされる() throws Exception {
            // When: POST /login を誤ったパスワードで実行する
            mockMvc.perform(post("/login")
                            .with(csrf())
                            .param("username", "test@example.com")
                            .param("password", "wrongpassword"))
                    // Then: /login?error にリダイレクトされること
                    .andExpect(status().is3xxRedirection())
                    .andExpect(redirectedUrl("/login?error"));
        }

        @Test
        @DisplayName("ログイン失敗後にエラーメッセージが画面に表示される")
        void GET_login_errorパラメータ付きの場合_エラーメッセージが表示される() throws Exception {
            // Given: ログイン失敗後に /login?error にリダイレクトされた状態

            // When: GET /login?error にアクセスする
            mockMvc.perform(get("/login").param("error", ""))
                    // Then: ログイン画面にエラーメッセージが表示されること
                    .andExpect(status().isOk())
                    .andExpect(view().name("login"))
                    .andExpect(content().string(containsString("メールアドレスまたはパスワードが正しくありません")));
        }
    }

    @Test
    void GET_login_ログイン画面が表示される() throws Exception {
        // When: GET /login にアクセスする
        mockMvc.perform(get("/login"))
                // Then: login ビューが返される
                .andExpect(status().isOk())
                .andExpect(view().name("login"));
    }
}
