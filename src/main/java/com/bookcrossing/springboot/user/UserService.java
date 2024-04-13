package com.bookcrossing.springboot.user;

import com.bookcrossing.springboot.AuthResponse;
import com.bookcrossing.springboot.JwtProvider;
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
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImplementation userDetailsServiceImplementation;
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserDetailsServiceImplementation userDetailsServiceImplementation) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsServiceImplementation = userDetailsServiceImplementation;
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
        Authentication authentication = new UsernamePasswordAuthenticationToken(username,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Register Success");
        authResponse.setStatus(true);
        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    public ResponseEntity<AuthResponse> signin(User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        System.out.println(username+"-------"+password);
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
        System.out.println(username+"---++----"+password);
        UserDetails userDetails = userDetailsServiceImplementation.loadUserByUsername(username);
        System.out.println("Sig in in user details"+ userDetails);
        if(userDetails == null) {
            System.out.println("Sign in details - null" + userDetails);
            throw new BadCredentialsException("Invalid username and password");
        }
        if(!passwordEncoder.matches(password,userDetails.getPassword())) {
            System.out.println("Sign in userDetails - password mismatch"+userDetails);
            throw new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }
}