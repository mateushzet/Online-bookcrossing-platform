package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.Notification;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.AuthService;
import com.bookcrossing.springboot.service.EmailService;
import com.bookcrossing.springboot.service.NotificationService;
import com.bookcrossing.springboot.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class NotificationController {

    private NotificationService notificationService;
    private UserService userService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }


    private int getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = JwtProvider.getUsernameFromJwtToken(token);
                UserDTO user = userService.getUser(username);
                return user.getUserId();
            } catch (Exception e) {
                System.err.println("Error extracting username from JWT: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token", e);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization token is missing or invalid");
        }
    }

    @GetMapping("/notifications")
    public List<Notification> getUserNotifications(HttpServletRequest request) {
        int userId = getUserIdFromRequest(request);
        return notificationService.getUserNotifications(userId);
    }

    @PostMapping("/notifications/markAsRead/{notificationId}")
    public void markNotificationAsRead(HttpServletRequest request, @PathVariable Long notificationId) {
        int userId = getUserIdFromRequest(request);
        notificationService.markNotificationAsRead(userId, notificationId);
    }

    @DeleteMapping("/notifications/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }

}
