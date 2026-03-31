package com.example.frere.application.service;

import com.example.frere.application.exception.DuplicateEmailException;
import com.example.frere.infrastructure.persistence.mybatis.CustomerMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.frere.domain.model.customer.Customer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CustomerMapper customerMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_正常系_顧客が登録される() {
        // Given: 新規メールアドレスで登録コマンドを作成
        RegisterCommand command = new RegisterCommand(
                "new@example.com", "password1", "田中 太郎", "090-1234-5678", "東京都新宿区1-1-1");
        when(customerMapper.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password1")).thenReturn("$2a$10$hashedpassword");

        // When: 会員登録を実行する
        authService.register(command);

        // Then: CustomerMapper.insert() が呼ばれ、Customerが永続化される
        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerMapper).insert(captor.capture());
        Customer saved = captor.getValue();
        assertThat(saved.getEmail()).isEqualTo("new@example.com");
        assertThat(saved.getName()).isEqualTo("田中 太郎");
        assertThat(saved.getPhone()).isEqualTo("090-1234-5678");
        assertThat(saved.getAddress()).isEqualTo("東京都新宿区1-1-1");
        assertThat(saved.getPasswordHash()).isNotNull();
        assertThat(saved.getPasswordHash()).isNotEqualTo("password1");
    }

    @Test
    void register_重複メールアドレスの場合_DuplicateEmailExceptionがスローされる() {
        // Given: すでに登録済みのメールアドレスで登録コマンドを作成
        RegisterCommand command = new RegisterCommand(
                "existing@example.com", "password1", "山田 花子", "080-9876-5432", "大阪府大阪市北区2-2-2");
        when(customerMapper.existsByEmail("existing@example.com")).thenReturn(true);

        // When / Then: DuplicateEmailException がスローされる
        assertThatThrownBy(() -> authService.register(command))
                .isInstanceOf(DuplicateEmailException.class);
        verify(customerMapper, never()).insert(any());
    }
}
