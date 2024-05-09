package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExchangeDTO {

    private int exchangeId;
    private int bookId;
    private int ownerId;
    private String description;
    private String bookCondition;

    public ExchangeDTO(int exchangeId, int bookId, int ownerId, String description, String bookCondition) {
        this.exchangeId = exchangeId;
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.description = description;
        this.bookCondition = bookCondition;
    }
}
