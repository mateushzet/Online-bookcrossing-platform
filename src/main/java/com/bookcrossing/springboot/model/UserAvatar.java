package com.bookcrossing.springboot.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_avatars")
@Data
public class UserAvatar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "avatar", columnDefinition = "BYTEA")
    private byte[] avatar;

}