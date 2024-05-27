package com.bookcrossing.springboot.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    private String username;
    private String email;
    private String password;
    private String role;
    private String phone;
    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "email_notifications")
    private boolean emailNotifications;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private Timestamp created_at;

    @OneToMany
    @JoinColumn(name = "owner_id", referencedColumnName = "user_id")
    @JsonBackReference
    private List<Exchange> exchanges;
}