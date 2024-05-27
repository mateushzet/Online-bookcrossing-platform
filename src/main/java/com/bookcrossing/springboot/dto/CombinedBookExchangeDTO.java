package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Base64;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CombinedBookExchangeDTO {

    private int exchangeId;
    private int ownerId;
    private String exchangeDescription;
    private String bookCondition;
    private String bookImage;

    private int bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;

    private int stageOwner;
    private int stageRequester;

    private String ownerName;

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId,
                                   String exchangeDescription, String bookCondition,
                                   String title, String author, String isbn, String genre, String ownerName, byte[] bookImage) {
        this.exchangeId = exchangeId;
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.exchangeDescription = exchangeDescription;
        this.bookCondition = bookCondition;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.ownerName = ownerName;
        if (bookImage != null) {
            this.bookImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(bookImage);
        }
    }

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId,
                                   String exchangeDescription, String bookCondition,
                                   String title, String author, String isbn, String genre, String ownerName) {
        this.exchangeId = exchangeId;
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.exchangeDescription = exchangeDescription;
        this.bookCondition = bookCondition;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.ownerName = ownerName;
    }
}
