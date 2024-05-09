package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.service.AuthService;
import com.bookcrossing.springboot.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class ConfirmAccountController {

    private AuthService authService;

    public ConfirmAccountController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/confirmAccount")
    public ResponseEntity<?> confirmAccount(@RequestParam("token") String token) {
        boolean isActivated = authService.activateUser(token);

        if (isActivated) {
            return ResponseEntity.ok("User account has been activated.");
        } else {
            return ResponseEntity.badRequest().body("Invalid confirmation link.");
        }
    }
}