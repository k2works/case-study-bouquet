package com.example.frere.presentation.controller;

import com.example.frere.application.exception.DuplicateEmailException;
import com.example.frere.application.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(AuthController.class)
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

    @Test
    void POST_register_重複メールアドレスの場合_登録画面にエラーが表示される() throws Exception {
        // Given: 重複メールアドレスで登録リクエスト
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
                // Then: register ビューが返され、エラーメッセージがモデルに含まれる
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("errorMessage"));
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
