package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.MessageDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.Message;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.MessageService;
import com.bookcrossing.springboot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    @Autowired
    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }



    @PostMapping("/sendMessage")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageDTO messageDTO, HttpServletRequest request) {

        int userId = getUserIdFromToken(request);

        System.out.println(messageDTO.getReceiverId());

        Message message = new Message(messageDTO.getExchangeId(), userId, messageDTO.getContent(), messageDTO.getReceiverId());
        Message savedMessage = messageService.saveMessage(message);
        return ResponseEntity.ok(savedMessage);

    }

    @GetMapping("/participants/{exchangeId}")
    public ResponseEntity<List<User>> getParticipantsByExchangeId(@PathVariable Long exchangeId, Long ownerId) {
        int userId = getUserIdFromToken(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest());
        List<User> participants = messageService.getParticipantsByExchangeId(exchangeId,userId,ownerId);
        return ResponseEntity.ok(participants);
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

    @GetMapping("/messages/{exchangeId}")
    public List<MessageDTO> getMessages(@PathVariable Long exchangeId, @RequestParam Long userId, @RequestParam Long ownerId) {
        Long requestingUserId = Long.valueOf(getUserIdFromToken(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()));
        if(userId == ownerId) return messageService.getMessages(exchangeId, userId, requestingUserId);
        else return messageService.getMessages(exchangeId, userId, ownerId);
    }

}
