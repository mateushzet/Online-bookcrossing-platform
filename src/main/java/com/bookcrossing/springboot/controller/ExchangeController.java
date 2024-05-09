package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.ExchangeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class ExchangeController {

    private ExchangeService exchangeService;

    @Autowired
    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PostMapping("/submitExchange")
    public ResponseEntity<?> submitExchange(@RequestParam int bookId, String description,String bookCondition ,HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = JwtProvider.getUsernameFromJwtToken(token);
                if(exchangeService.submitExchange(bookId, description, username, bookCondition)) return ResponseEntity.ok("Exchange proposition has been submitted");
                return ResponseEntity.badRequest().body("Exchange proposition submit failed.");
            } catch (Exception e) {
                System.err.println("Error extracting username from JWT: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token", e);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization token is missing or invalid");
        }
    }

    @GetMapping("/fetchExchanges")
    public List<CombinedBookExchangeDTO> fetchExchanges() {
        return exchangeService.getAllExchanges();
    }
}
