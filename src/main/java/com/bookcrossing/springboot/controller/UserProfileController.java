package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.UserAvatar;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.ExchangeService;
import com.bookcrossing.springboot.service.UserAvatarService;
import com.bookcrossing.springboot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;


@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    private final UserService userService;
    private ExchangeService exchangeService;
    private UserAvatarService userAvatarService;

    @Autowired
    public UserProfileController(UserService userService, ExchangeService exchangeService, UserAvatarService userAvatarService) {
        this.userService = userService;
        this.exchangeService = exchangeService;
        this.userAvatarService = userAvatarService;
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

    @GetMapping("/getUserById")
    public UserDTO getUser(@RequestParam("userId") int userId) {
        return userService.getUser(userId);
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

    @GetMapping("/getUserRating")
    public ResponseEntity<?> getUserRating(HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        Double rating = exchangeService.getUserRating(userId);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/getUserRatingById")
    public ResponseEntity<?> getUserRatingById(@RequestParam("userId") int userId) {
        Double rating = exchangeService.getUserRating(userId);
        return ResponseEntity.ok(rating);
    }

    private int getUserIdFromToken(HttpServletRequest request){

        UserDTO user;
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = JwtProvider.getUsernameFromJwtToken(token);
                user = userService.getUser(username);
            } catch (Exception e) {
                System.err.println("Error extracting username from JWT: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token", e);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization token is missing or invalid");
        }
        return user.getUserId();
    }

    @GetMapping("/getUserAvatar")
    public ResponseEntity<byte[]> getUserAvatar(@RequestParam("userId") int userId) {

        UserAvatar userAvatar = userAvatarService.getUserAvatarByUserId(userId);
        if (userAvatar != null && userAvatar.getAvatar() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "image/jpeg");
            System.out.println(Arrays.toString(userAvatar.getAvatar()));
            return new ResponseEntity<>(userAvatar.getAvatar(), headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/uploadAvatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("userId") int userId, @RequestParam("file") MultipartFile file) {
        try {
            byte[] avatarBytes = file.getBytes();
            userAvatarService.saveUserAvatar(userId, avatarBytes);
            return new ResponseEntity<>("Avatar uploaded successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload avatar.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}