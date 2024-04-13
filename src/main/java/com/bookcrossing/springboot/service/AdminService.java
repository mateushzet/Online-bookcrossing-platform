package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.repository.UserRepository;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    @Autowired
    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAllUsersWithUsernameEmailRole();
    }

    @Transactional
    public void deleteUser(int userId){
        userRepository.deleteByUserId(userId);
    }

    @Transactional
    public void modifyUser(UserDTO userDTO) {
        User user = userRepository.findById((long) userDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id " + userDTO.getUserId()));


        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());

        userRepository.save(user);
    }

}