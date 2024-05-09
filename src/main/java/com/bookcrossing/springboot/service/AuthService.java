package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.AuthResponse;
import com.bookcrossing.springboot.repository.UserRepository;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.exception.EmailExistsException;
import com.bookcrossing.springboot.model.User;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetails;
    private final EmailService emailService;
    private ExecutorService emailExecutor = Executors.newSingleThreadExecutor();

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomUserDetailsService customUserDetails, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customUserDetails = customUserDetails;
        this.emailService = emailService;
    }


    public ResponseEntity<AuthResponse> registerNewUserAccount(User user) throws EmailExistsException {

        String username = user.getUsername();
        String email = user.getEmail();
        String password = user.getPassword();
        String role = "ROLE_USER";

        User isEmailExist = userRepository.findByEmail(email);
        if (isEmailExist != null) {

            if(userRepository.findByEmail(email).isActive() == false){
            String confirmToken = createAccountConfirmToken(email);
            String confirmLink = "http://localhost:3000/confirmAccount?token=" + confirmToken;
            String subject = "Registration on Bookcrossing page";
            String messageBody = "Hello " + username + ", please confirm your account by clicking following link: "+ confirmLink;
            emailExecutor.submit(() -> {
                emailService.sendEmail(email, subject, messageBody);
            });
                throw new EmailExistsException("There is an unverified account with that email address: " + username + ". A confirmation link has been resent.");
            }
            throw new EmailExistsException("There is an account with that email address: " + email);
        }

        User isUserExist = userRepository.findByUsername(username);
        if (isUserExist != null) {
            throw new EmailExistsException("There is an account with that username: " + username);
        }

        User createdUser = new User();
        createdUser.setUsername(username);
        createdUser.setEmail(email);
        createdUser.setRole(role);
        createdUser.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(createdUser);
        userRepository.save(savedUser);

        Authentication authentication = authenticate(username,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Register Success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);

        String confirmToken = createAccountConfirmToken(email);
        String confirmLink = "http://localhost:3000/confirmAccount?token=" + confirmToken;

        String subject = "Registration on Bookcrossing page";
        String messageBody = "Hello " + createdUser.getUsername() + ", please confirm your account by clicking following link: "+ confirmLink;
        emailExecutor.submit(() -> {
            emailService.sendEmail(createdUser.getEmail(), subject, messageBody);
        });

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PreDestroy
    public void destroy() {
        if (emailExecutor != null) {
            emailExecutor.shutdown();
        }
    }


    public ResponseEntity<AuthResponse> signin(User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        User user = userRepository.findByUsername(username);
        AuthResponse authResponse = new AuthResponse();

        if(user.isActive()) {

            Authentication authentication = authenticate(username, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtProvider.generateToken(authentication);

            authResponse.setMessage("Login success");
            authResponse.setJwt(token);
            authResponse.setStatus(true);

            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }
        authResponse.setMessage("Account is not active");
        authResponse.setStatus(false);
        return new ResponseEntity<>(authResponse, HttpStatus.UNAUTHORIZED);
    }


    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password.");
        }

        boolean isAdminRole = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        boolean isUserRole = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_USER"));

        if (!isAdminRole && !isUserRole) {
            throw new BadCredentialsException("Access denied. You do not have the required role.");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    public String createPasswordResetToken(String email){
        User user = userRepository.findByEmail(email);
        String resetToken;
        resetToken = JwtProvider.generatePasswordResetToken(user.getEmail());
        return resetToken;
    }

    public String createAccountConfirmToken(String email){
        User user = userRepository.findByEmail(email);
        String confirmToken;
        confirmToken = JwtProvider.generateAccountConfirmToken(user.getEmail());
        return confirmToken;
    }

    public boolean resetPassword(String resetToken, String newPassword) {
        if (resetToken == null) return false;
        String email = JwtProvider.getEmailFromJwtToken(resetToken);
        User user = userRepository.findByEmail(email);
        if (email == null) return false;
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public boolean activateUser(String resetToken) {
        if (resetToken == null) return false;
        String email = JwtProvider.getEmailFromJwtToken(resetToken);
        User user = userRepository.findByEmail(email);
        if (email == null) return false;
        user.setActive(true);
        userRepository.save(user);
        return true;
    }

}