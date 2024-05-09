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
public class PasswordResetController {

    private AuthService authService;

    private EmailService emailService;

    public PasswordResetController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        String token = authService.createPasswordResetToken(email);
        String resetLink = "http://localhost:3000/resetPassword?token=" + token;
        emailService.sendEmail(email, "Resetowanie Hasła", "Link do resetowania hasła: " + resetLink);
        return ResponseEntity.ok("Email resetowania hasła został wysłany.");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token,
                                           @RequestParam("newPassword") String password) {
        boolean isReset = authService.resetPassword(token, password);
        if (isReset) {
            return ResponseEntity.ok("Hasło zostało zresetowane.");
        } else {
            return ResponseEntity.badRequest().body("Nieprawidłowy lub wygasły token.");
        }
    }
}