package com.bookcrossing.springboot.model;

import jakarta.persistence.*;
import lombok.*;

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
    private int ownerId;
    private String description;
    @Column(name = "bookCondition")
    private String bookCondition;

    public Exchange(int bookId, String description, int ownerId, String bookCondition) {
        this.bookId = bookId;
        this.description = description;
        this.ownerId = ownerId;
        this.bookCondition = bookCondition;
    }
}