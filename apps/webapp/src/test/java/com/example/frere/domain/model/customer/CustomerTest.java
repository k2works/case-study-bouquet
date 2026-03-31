package com.example.frere.domain.model.customer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CustomerTest {

    private static final EmailAddress VALID_EMAIL = new EmailAddress("user@example.com");
    private static final String VALID_HASHED_PASSWORD = "$2a$10$hashedpasswordvalue";
    private static final String VALID_NAME = "山田 太郎";
    private static final String VALID_PHONE = "090-1234-5678";
    private static final String VALID_ADDRESS = "東京都千代田区";

    @Test
    void registerでCustomerが生成される() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_HASHED_PASSWORD, VALID_NAME, VALID_PHONE, VALID_ADDRESS);
        assertThat(customer).isNotNull();
        assertThat(customer.getEmail()).isEqualTo(VALID_EMAIL.value());
        assertThat(customer.getName()).isEqualTo(VALID_NAME);
        assertThat(customer.getPhone()).isEqualTo(VALID_PHONE);
    }

    @Test
    void registerでpasswordHashが設定される() {
        Customer customer = Customer.register(VALID_EMAIL, VALID_HASHED_PASSWORD, VALID_NAME, VALID_PHONE, VALID_ADDRESS);
        assertThat(customer.getPasswordHash()).isEqualTo(VALID_HASHED_PASSWORD);
    }

    @Test
    void emailAddressがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(null, VALID_HASHED_PASSWORD, VALID_NAME, VALID_PHONE, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void hashedPasswordがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, null, VALID_NAME, VALID_PHONE, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void nameがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, VALID_HASHED_PASSWORD, null, VALID_PHONE, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void phoneがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, VALID_HASHED_PASSWORD, VALID_NAME, null, VALID_ADDRESS))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void addressがnullの場合は例外がスローされる() {
        assertThatThrownBy(() -> Customer.register(VALID_EMAIL, VALID_HASHED_PASSWORD, VALID_NAME, VALID_PHONE, null))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
