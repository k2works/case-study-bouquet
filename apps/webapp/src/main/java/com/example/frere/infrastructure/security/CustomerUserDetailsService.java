package com.example.frere.infrastructure.security;

import com.example.frere.domain.model.customer.Customer;
import com.example.frere.infrastructure.persistence.mybatis.CustomerMapper;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerUserDetailsService implements UserDetailsService {

    private final CustomerMapper customerMapper;

    public CustomerUserDetailsService(CustomerMapper customerMapper) {
        this.customerMapper = customerMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerMapper.findByEmail(email);
        if (customer == null) {
            throw new UsernameNotFoundException("Customer not found: " + email);
        }
        return new User(
                customer.getEmail(),
                customer.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
    }
}
