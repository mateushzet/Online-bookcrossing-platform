package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);

    @Query("SELECT new com.bookcrossing.springboot.user.model.UserDTO(u.userId, u.username, u.email, u.role) FROM User u")
    List<UserDTO> findAllUsersWithUsernameEmailRole();

    void deleteByUserId(int userId);
}