package com.bookcrossing.springboot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private int bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;
    @Column(name = "added_by")
    private int addedBy;

    public Book(String title, String author, String isbn, String genre, int addedBy) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.addedBy = addedBy;
    }
}