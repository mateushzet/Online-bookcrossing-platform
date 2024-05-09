package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CombinedBookExchangeDTO {

    private int exchangeId;
    private int ownerId;
    private String exchangeDescription;
    private String bookCondition;

    private int bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId,
                                   String exchangeDescription, String bookCondition,
                                   String title, String author, String isbn, String genre) {
        this.exchangeId = exchangeId;
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.exchangeDescription = exchangeDescription;
        this.bookCondition = bookCondition;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
    }
}
