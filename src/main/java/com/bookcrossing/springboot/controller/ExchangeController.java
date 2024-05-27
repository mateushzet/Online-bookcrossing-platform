package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.AcceptedExchanges;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.ExchangeService;
import com.bookcrossing.springboot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class ExchangeController {

    private ExchangeService exchangeService;
    private UserService userService;

    @Autowired
    public ExchangeController(ExchangeService exchangeService, UserService userService) {
        this.exchangeService = exchangeService;
        this.userService = userService;
    }

    @PostMapping("/submitExchange")
    public ResponseEntity<?> submitExchange(@RequestParam int bookId, String description, String bookCondition,  @RequestParam(required = false) MultipartFile image, HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        byte[] imageBytes = null;

        if (image != null && !image.isEmpty()) {
            try {
                imageBytes = image.getBytes();
            } catch (Exception e) {
            }
        }

        if(exchangeService.submitExchange(bookId, description, userId, bookCondition, imageBytes)) return ResponseEntity.ok("Exchange proposition has been submitted");
        return ResponseEntity.badRequest().body("Exchange proposition submit failed.");
    }

    @GetMapping("/fetchExchanges")
    public List<CombinedBookExchangeDTO> fetchExchanges(HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        return exchangeService.getAllExchanges(userId);
    }

    @PostMapping("/acceptExchange")
    public ResponseEntity<?> acceptExchange(@RequestParam int exchangeId, int ownerId, HttpServletRequest request){
        int userId = getUserIdFromToken(request);
        exchangeService.acceptExchange(exchangeId, ownerId, userId);
        return ResponseEntity.ok("Exchange offer accepted");
    }

    @PostMapping("/cancelExchange")
    public ResponseEntity<?> cancelExchange(@RequestParam int exchangeId, int ownerId, int selectedUser, HttpServletRequest request){
        int userId = getUserIdFromToken(request);
        exchangeService.cancelExchange(exchangeId, ownerId, selectedUser, userId);
        return ResponseEntity.ok("Exchange offer canceled");
    }

    @GetMapping("/fetchMyExchanges")
    public List<CombinedBookExchangeDTO> fetchMyExchanges(HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        return exchangeService.getMyExchanges(userId);
    }

    @GetMapping("/fetchAcceptedExchanges")
    public List<CombinedBookExchangeDTO> fetchAcceptedExchanges(HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        return exchangeService.findAcceptedExchanges(userId);
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

    @GetMapping("/offerDetails")
    public AcceptedExchanges fetchOfferDetails(@RequestParam int exchangeId, int ownerId, int selectedUser, HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        if(userId == ownerId) return exchangeService.getExchangeDetails(exchangeId, selectedUser, userId);
        else return exchangeService.getExchangeDetails(exchangeId, userId, selectedUser);

    }

   @PostMapping("/updateRating")
   public ResponseEntity<?> updateRating(@RequestParam int exchangeId, int ownerId, int selectedUser, int rating, HttpServletRequest request) {
       int userId = getUserIdFromToken(request);
           try {
               exchangeService.updateRating(exchangeId, ownerId, selectedUser, rating, userId);
                return ResponseEntity.ok("Rating has been submitted");
           } catch (Exception e) {
               return ResponseEntity.badRequest().body("Rating submit failed.");
           }
   }

    @PostMapping("/updateStage")
    public ResponseEntity<?> updateStage(@RequestParam int exchangeId, int ownerId, int selectedUser, int stage, HttpServletRequest request) {
        int userId = getUserIdFromToken(request);
        try {
            exchangeService.updateStage(exchangeId, ownerId, selectedUser, stage, userId);
            return ResponseEntity.ok("Stage has been submitted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Stage submit failed.");
        }
    }



}
