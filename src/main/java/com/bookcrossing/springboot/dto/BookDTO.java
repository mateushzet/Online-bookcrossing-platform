package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookDTO {
    private int bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;

    public BookDTO(int bookId, String title, String description, String isbn, String genre) {
        this.bookId = bookId;
        this.title = title;
        this.author = description;
        this.isbn = isbn;
        this.genre = genre;
    }

}