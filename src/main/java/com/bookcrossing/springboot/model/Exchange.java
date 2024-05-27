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
    private String description;
    @Column(name = "book_Condition")
    private String bookCondition;
    @Column(name = "book_image", columnDefinition = "BYTEA")
    private byte[] bookImage;

    public Exchange(int bookId, String description, int ownerId, String bookCondition, byte[] bookImage) {
        this.bookId = bookId;
        this.description = description;
        this.ownerId = ownerId;
        this.bookCondition = bookCondition;
        this.bookImage = bookImage;
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
}