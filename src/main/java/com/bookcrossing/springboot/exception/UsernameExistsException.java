package com.bookcrossing.springboot.exception;

public class UsernameExistsException extends Exception {

    public UsernameExistsException(String message) {
        super(message);
    }
}