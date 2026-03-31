package com.example.frere.domain.model.customer;

import java.util.Objects;
import java.util.regex.Pattern;

public class EmailAddress {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final String value;

    public EmailAddress(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Email address is required");
        }
        if (value.isEmpty()) {
            throw new IllegalArgumentException("Email address must not be empty");
        }
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email address format: " + value);
        }
        this.value = value;
    }

    public String value() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmailAddress that = (EmailAddress) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
