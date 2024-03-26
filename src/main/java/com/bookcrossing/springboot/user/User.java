package com.bookcrossing.springboot.user;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;
    private String username;
    private String email;
    private String role;
    private String password;
    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;
}