package com.bookcrossing.springboot.exception;

public class EmailExistsException extends Exception {

    public EmailExistsException(String message) {
        super(message);
    }
}