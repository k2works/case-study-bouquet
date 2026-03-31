package com.example.frere.domain.model.customer;

import java.time.LocalDateTime;

public class Customer {

    private Long customerId;
    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private EmailAddress emailAddress;

    public static Customer register(
            EmailAddress emailAddress, String hashedPassword, String name, String phone, String address) {
        if (emailAddress == null) {
            throw new IllegalArgumentException("emailAddress is required");
        }
        if (hashedPassword == null) {
            throw new IllegalArgumentException("hashedPassword is required");
        }
        if (name == null) {
            throw new IllegalArgumentException("name is required");
        }
        if (phone == null) {
            throw new IllegalArgumentException("phone is required");
        }
        if (address == null) {
            throw new IllegalArgumentException("address is required");
        }
        Customer customer = new Customer();
        customer.emailAddress = emailAddress;
        customer.email = emailAddress.value();
        customer.passwordHash = hashedPassword;
        customer.name = name;
        customer.phone = phone;
        customer.address = address;
        return customer;
    }

    public EmailAddress getEmailAddress() {
        return emailAddress;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
