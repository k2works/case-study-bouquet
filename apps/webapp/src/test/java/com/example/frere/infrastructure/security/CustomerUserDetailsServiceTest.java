package com.example.frere.infrastructure.security;

import com.example.frere.domain.model.customer.Customer;
import com.example.frere.infrastructure.persistence.mybatis.CustomerMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerUserDetailsServiceTest {

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerUserDetailsService customerUserDetailsService;

    @Test
    void loadUserByUsername_存在するメールの場合_UserDetailsが返る() {
        // Given: 登録済み顧客が存在する
        Customer customer = new Customer();
        customer.setEmail("user@example.com");
        customer.setPasswordHash("$2a$10$hashedpassword");
        when(customerMapper.findByEmail("user@example.com")).thenReturn(customer);

        // When: メールアドレスでユーザー情報を検索する
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername("user@example.com");

        // Then: UserDetails が返り、username と password が一致する
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("user@example.com");
        assertThat(userDetails.getPassword()).isEqualTo("$2a$10$hashedpassword");
        assertThat(userDetails.getAuthorities()).isNotEmpty();
    }

    @Test
    void loadUserByUsername_存在しないメールの場合_UsernameNotFoundExceptionがスローされる() {
        // Given: 存在しないメールアドレス
        when(customerMapper.findByEmail("unknown@example.com")).thenReturn(null);

        // When / Then: UsernameNotFoundException がスローされる
        assertThatThrownBy(() -> customerUserDetailsService.loadUserByUsername("unknown@example.com"))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}
