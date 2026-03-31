package com.example.frere.domain.model.customer;

public class Password {

    private static final int MINIMUM_LENGTH = 8;

    public Password(String rawPassword) {
        if (rawPassword == null) {
            throw new IllegalArgumentException("Password is required");
        }
        if (rawPassword.isEmpty()) {
            throw new IllegalArgumentException("Password must not be empty");
        }
        if (rawPassword.length() < MINIMUM_LENGTH) {
            throw new IllegalArgumentException(
                    "Password must be at least " + MINIMUM_LENGTH + " characters");
        }
    }
}
