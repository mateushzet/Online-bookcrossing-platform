package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.Book;
import com.bookcrossing.springboot.security.JwtProvider;
import com.bookcrossing.springboot.service.UserBookService;
import com.bookcrossing.springboot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserBookController {

    private final UserBookService userBookService;
    private final UserService userService;


    @Autowired
    public UserBookController(UserBookService userBookService, UserService userService) {
        this.userBookService = userBookService;
        this.userService= userService;
    }

    @GetMapping("/bookTable")
    public List<BookDTO> getBook() {
        return userBookService.getAllBook();
    }

    @GetMapping("/fetchBooks")
    public List<BookDTO> fetchBooksByTitle(@RequestParam String title, String author, String isbn, String genre) {
        return userBookService.findTop5ByTitleContainingIgnoreCase(title, author, isbn, genre);
    }

    @PostMapping("/addBook")
    public ResponseEntity<?> addBook(@RequestParam String title, String author, String isbn, String genre, HttpServletRequest request){

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
        Book newBook = new Book(title, author, isbn, genre, user.getUserId());
        boolean bookInserted = userBookService.addBook(newBook);
        if (bookInserted) {
            return ResponseEntity.ok("Book has been inserted.");
        } else {
            return ResponseEntity.badRequest().body("There is already book with this title and author");
        }
    }

}