package com.example.frere.application.service;

import com.example.frere.application.exception.DuplicateEmailException;
import com.example.frere.domain.model.customer.Customer;
import com.example.frere.domain.model.customer.EmailAddress;
import com.example.frere.domain.model.customer.Password;
import com.example.frere.infrastructure.persistence.mybatis.CustomerMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomerMapper customerMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(CustomerMapper customerMapper, PasswordEncoder passwordEncoder) {
        this.customerMapper = customerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterCommand command) {
        if (customerMapper.existsByEmail(command.getEmail())) {
            throw new DuplicateEmailException(command.getEmail());
        }
        new Password(command.getPassword());
        String hashedPassword = passwordEncoder.encode(command.getPassword());
        Customer customer = Customer.register(
                new EmailAddress(command.getEmail()),
                hashedPassword,
                command.getName(),
                command.getPhone(),
                command.getAddress()
        );
        customerMapper.insert(customer);
    }
}
