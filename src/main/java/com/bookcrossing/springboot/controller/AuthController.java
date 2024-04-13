package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.AuthResponse;
import com.bookcrossing.springboot.exception.EmailExistsException;
import com.bookcrossing.springboot.service.UserService;
import com.bookcrossing.springboot.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user)  {
        try {
            ResponseEntity<AuthResponse> registered = userService.registerNewUserAccount(user);
            return registered;
        } catch (EmailExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody User loginRequest) {
        ResponseEntity<AuthResponse> login = userService.signin(loginRequest);
        return login;
    }

}