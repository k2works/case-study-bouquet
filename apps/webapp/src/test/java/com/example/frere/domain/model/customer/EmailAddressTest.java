package com.example.frere.domain.model.customer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EmailAddressTest {

    @Test
    void 有効なメールアドレスでオブジェクトが生成される() {
        EmailAddress emailAddress = new EmailAddress("user@example.com");
        assertThat(emailAddress).isNotNull();
    }

    @Test
    void valueメソッドで元の値が取り出せる() {
        String raw = "user@example.com";
        EmailAddress emailAddress = new EmailAddress(raw);
        assertThat(emailAddress.value()).isEqualTo(raw);
    }

    @Test
    void nullを渡すと例外がスローされる() {
        assertThatThrownBy(() -> new EmailAddress(null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void 空文字を渡すと例外がスローされる() {
        assertThatThrownBy(() -> new EmailAddress(""))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void アットマークなしのメールアドレスで例外がスローされる() {
        assertThatThrownBy(() -> new EmailAddress("invalidemail"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void 同じ値のEmailAddressは等価である() {
        EmailAddress a = new EmailAddress("user@example.com");
        EmailAddress b = new EmailAddress("user@example.com");
        assertThat(a).isEqualTo(b);
        assertThat(a.hashCode()).isEqualTo(b.hashCode());
    }
}
