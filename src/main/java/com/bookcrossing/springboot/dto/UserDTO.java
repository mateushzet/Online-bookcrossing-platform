package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private int userId;
    private String username;
    private String email;
    private String role;
    private String phone;
    private boolean emailNotifications;

    public UserDTO() {}

    public UserDTO(int userId, String username, String email, String role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public UserDTO(int userId, String username, String email, String phone, boolean emailNotifications) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.emailNotifications = emailNotifications;
    }
}