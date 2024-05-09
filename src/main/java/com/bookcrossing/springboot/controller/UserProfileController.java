package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    private final UserService userService;

    @Autowired
    public UserProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getUser")
    public UserDTO getUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = JwtProvider.getUsernameFromJwtToken(token);
                return userService.getUser(username);
            } catch (Exception e) {
                System.err.println("Error extracting username from JWT: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token", e);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization token is missing or invalid");
        }
    }

    @PutMapping("/modifyUserDetails")
    public ResponseEntity<?> modifyUserDetails(@RequestBody UserDTO userDTO) {
        try {
            userService.modifyUserDetails(userDTO);
            return ResponseEntity.ok().body("User with ID " + userDTO.getUserId() + " has been successfully modified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}