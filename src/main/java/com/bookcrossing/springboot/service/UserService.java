package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.AuthResponse;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.exception.EmailExistsException;
import com.bookcrossing.springboot.repository.UserRepository;
import com.bookcrossing.springboot.model.User;
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

// TODO - dodać endpointy dla USERA

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetails;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomUserDetailsService customUserDetails) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customUserDetails = customUserDetails;
    }


    public ResponseEntity<AuthResponse> registerNewUserAccount(User user) throws EmailExistsException {

        String username = user.getUsername();
        String email = user.getEmail();
        String password = user.getPassword();
        String role = "ROLE_USER";

        User isEmailExist = userRepository.findByEmail(email);
        if (isEmailExist != null) {
            throw new EmailExistsException("There is an account with that email address: " + user.getEmail());
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
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }


    public ResponseEntity<AuthResponse> signin(User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // System.out.println(username+"-------"+password);

        Authentication authentication = authenticate(username,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Login success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);

        return new ResponseEntity<>(authResponse,HttpStatus.OK);
    }


    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password.");
        }

        // Sprawdzanie roli użytkownika
        boolean isAdminRole = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        boolean isUserRole = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_USER"));

        if (!isAdminRole && !isUserRole) {
            throw new BadCredentialsException("Access denied. You do not have the required role.");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}