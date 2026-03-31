package com.example.frere.domain.model.customer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CustomerTest {

    private static final EmailAddress VALID_EMAIL = new EmailAddress("user@example.com");
    private static final String VALID_PASSWORD = "password1";
    private static final String VALID_NAME = "山田 太郎";
    private static final String VALID_ADDRESS = "東京都千代田区";

    @Test
    void registerでCustomerが生成される() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_PASSWORD, VALID_NAME, VALID_ADDRESS);
        assertThat(customer).isNotNull();
        assertThat(customer.getEmail()).isEqualTo(VALID_EMAIL.value());
        assertThat(customer.getName()).isEqualTo(VALID_NAME);
    }

    @Test
    void registerでpasswordHashが設定される() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_PASSWORD, VALID_NAME, VALID_ADDRESS);
        assertThat(customer.getPasswordHash()).isNotNull();
    }

    @Test
    void authenticateで正しいパスワードはtrueを返す() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_PASSWORD, VALID_NAME, VALID_ADDRESS);
        assertThat(customer.authenticate(VALID_PASSWORD)).isTrue();
    }

    @Test
    void authenticateで誤ったパスワードはfalseを返す() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_PASSWORD, VALID_NAME, VALID_ADDRESS);
        assertThat(customer.authenticate("wrongpassword")).isFalse();
    }

    @Test
    void emailAddressがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(null, VALID_PASSWORD, VALID_NAME, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void rawPasswordがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, null, VALID_NAME, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void nameがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, VALID_PASSWORD, null, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void addressがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, VALID_PASSWORD, VALID_NAME, null))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
