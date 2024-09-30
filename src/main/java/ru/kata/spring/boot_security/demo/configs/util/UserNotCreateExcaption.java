package ru.kata.spring.boot_security.demo.configs.util;

public class UserNotCreateExcaption extends RuntimeException {
    public UserNotCreateExcaption(String message) {
        super(message);
    }
}
