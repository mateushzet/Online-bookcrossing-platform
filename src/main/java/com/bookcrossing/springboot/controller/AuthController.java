package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.AuthResponse;
import com.bookcrossing.springboot.exception.EmailExistsException;
import com.bookcrossing.springboot.service.AuthService;
import com.bookcrossing.springboot.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user)  {
        try {
            ResponseEntity<AuthResponse> registered = authService.registerNewUserAccount(user);
            return registered;
        } catch (EmailExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody User loginRequest) {
        ResponseEntity<AuthResponse> login = authService.signin(loginRequest);
        return login;
    }
}