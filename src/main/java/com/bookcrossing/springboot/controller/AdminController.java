package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/usersTable")
    public List<UserDTO> getUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam int userId)  {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body("User with ID "+userId+" has been properly removed.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/modifyUser")
    public ResponseEntity<?> modifyUser(@RequestBody UserDTO userDTO) {
        try {
            userService.modifyUser(userDTO);
            return ResponseEntity.ok().body("User with ID " + userDTO.getUserId() + " has been successfully modified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}