package com.example.frere.domain.model.customer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PasswordTest {

    @Test
    void パスワードが8文字以上でオブジェクトが生成される() {
        Password password = new Password("password1");
        assertThat(password).isNotNull();
    }

    @Test
    void パスワードが7文字以下で例外がスローされる() {
        assertThatThrownBy(() -> new Password("short12"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void nullを渡すと例外がスローされる() {
        assertThatThrownBy(() -> new Password(null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void 空文字を渡すと例外がスローされる() {
        assertThatThrownBy(() -> new Password(""))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
