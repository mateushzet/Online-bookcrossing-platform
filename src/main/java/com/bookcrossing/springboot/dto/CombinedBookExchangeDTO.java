package com.bookcrossing.springboot.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CombinedBookExchangeDTO {

    private int exchangeId;
    private int ownerId;
    private String exchangeDescription;
    private String preferredBooksDescription;
    private String preferredBooks;

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
    private double lat;
    private double lng;

    private List<BookDTO> preferredBooksList;

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId,
                                   String exchangeDescription, String bookCondition,
                                   String title, String author, String isbn, String genre, String ownerName,
                                   byte[] bookImage, double lat, double lng, String preferredBooksDescription,
                                   String preferredBooks) {
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
        this.lat = lat;
        this.lng = lng;
        this.preferredBooksDescription = preferredBooksDescription;
        this.preferredBooks = preferredBooks;
    }

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId,
                                   String exchangeDescription, String bookCondition,
                                   String title, String author, String isbn, String genre, String ownerName,
                                   String preferredBooks, String preferredBooksDescription, byte[] bookImage) {
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
        this.preferredBooksDescription = preferredBooksDescription;
        this.preferredBooksList = new ArrayList<>();
        this.preferredBooks = preferredBooks;
        if (bookImage != null) {
            this.bookImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(bookImage);
        }
    }

    public CombinedBookExchangeDTO(int exchangeId, int bookId, int ownerId, String preferredBooksDescription, String bookCondition, byte[] bookImage, String exchangeDescription, String preferredBooks, String title, String author, String isbn, String genre, String username, double lat, double lng) {
        this.exchangeId = exchangeId;
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.preferredBooksDescription = preferredBooksDescription;
        this.bookCondition = bookCondition;
        if (bookImage != null) {
            this.bookImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(bookImage);
        }
        this.exchangeDescription = exchangeDescription;
        this.preferredBooks = preferredBooks;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.ownerName = username;
        this.lat = lat;
        this.lng = lng;
        this.preferredBooksList = new ArrayList<>();
    }

}
