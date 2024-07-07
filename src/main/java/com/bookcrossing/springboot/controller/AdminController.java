package com.bookcrossing.springboot.controller;

import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.service.UserBookService;
import com.bookcrossing.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final UserBookService userBookService;


    @Autowired
    public AdminController(UserService userService, UserBookService userBookService) {
        this.userService = userService;
        this.userBookService = userBookService;
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam int userId)  {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body("User with ID "+userId+" has been properly removed.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/usersTable")
    public List<UserDTO> getUsers() {
        return userService.getAllUsers();
    }


    @PutMapping("/modifyUser")
    public ResponseEntity<?> modifyUser(@RequestBody UserDTO userDTO) {
        try {
            userService.modifyUser(userDTO);
            return ResponseEntity.ok().body("User with ID " + userDTO.getUserId() + " has been successfully modified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteBook")
    public ResponseEntity<?> deleteBook(@RequestParam int bookId)  {
        try {
            userBookService.deleteBook(bookId);
            return ResponseEntity.ok().body("Book with ID "+bookId+" has been properly removed.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/modifyBook")
    public ResponseEntity<?> modifyBook(@RequestBody BookDTO bookDTO) {
        try {
            userBookService.modifyBook(bookDTO);
            return ResponseEntity.ok().body("Book with ID " + bookDTO.getBookId() + " has been successfully modified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/banUser")
    public ResponseEntity<?> banUser(@RequestParam int userId)  {
        try {
            userService.banUser(userId);
            return ResponseEntity.ok().body("User with ID "+userId+" has been banned.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unbanUser")
    public ResponseEntity<?> unbanUser(@RequestParam int userId)  {
        try {
            userService.unbanUser(userId);
            return ResponseEntity.ok().body("User with ID "+userId+" has been unbaned.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}