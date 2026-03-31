package com.example.frere.application.exception;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("Email address already registered: " + email);
    }
}
