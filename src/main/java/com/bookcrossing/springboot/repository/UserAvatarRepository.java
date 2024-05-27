package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.model.UserAvatar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAvatarRepository extends JpaRepository<UserAvatar, Integer> {

    UserAvatar findByUserId(int userId);
}