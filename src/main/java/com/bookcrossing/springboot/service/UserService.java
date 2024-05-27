package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.repository.UserRepository;
import com.bookcrossing.springboot.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO getUser(String username){
        return userRepository.findUserDTOByUsername(username);
    }

    public UserDTO getUser(int userId){
        return userRepository.findUserDTOByUserId(userId);
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

    @Transactional
    public void modifyUserDetails(UserDTO userDTO) {
        User user = userRepository.findById((long) userDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id " + userDTO.getUserId()));

        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setEmailNotifications(userDTO.isEmailNotifications());

        userRepository.save(user);
    }

}