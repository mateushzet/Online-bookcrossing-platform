package com.bookcrossing.springboot.user;

public class EmailExistsException extends Exception {

    public EmailExistsException(String message) {
        super(message);
    }
}