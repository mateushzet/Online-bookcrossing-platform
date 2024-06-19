package com.bookcrossing.springboot.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Exchange")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchange_id")
    private int exchangeId;
    @Column(name = "book_id")
    private int bookId;
    @Column(name = "owner_id")
    private int ownerId;
    @Column(name = "preferred_books_description")
    private String preferredBooksDescription;
    @Column(name = "book_Condition")
    private String bookCondition;
    @Column(name = "book_image", columnDefinition = "BYTEA")
    private byte[] bookImage;
    @Column(name = "exchange_description")
    String exchangeDescription;
    @Column(name = "preferred_books")
    String preferredBooks;

    public Exchange(int bookId, String preferredBooksDescription, int ownerId, String bookCondition, String exchangeDescription, String preferredBooks, byte[] bookImage) {
        this.bookId = bookId;
        this.preferredBooksDescription = preferredBooksDescription;
        this.ownerId = ownerId;
        this.bookCondition = bookCondition;
        this.bookImage = bookImage;
        this.exchangeDescription = exchangeDescription;
        this.preferredBooks = preferredBooks;
    }

    @OneToOne
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "exchangeId")
    @JsonBackReference
    private List<Message> messages;

    @ManyToMany
    @JoinTable(
            name = "exchange_preferred_books",
            joinColumns = @JoinColumn(name = "exchange_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> preferredBooksList;
}