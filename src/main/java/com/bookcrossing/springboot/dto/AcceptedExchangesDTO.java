package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
public class AcceptedExchangesDTO {

    private int exchangeId;
    private int ownerId;
    private int requesterId;
    private int stageOwner;
    private int starsOwner;
    private int stageRequester;
    private int starsRequester;
    private String bookImage;


    public AcceptedExchangesDTO(int exchangeId, int ownerId, int requesterId, int stageOwner, int stageRequester, byte[] bookImage) {
        this.exchangeId = exchangeId;
        this.ownerId = ownerId;
        this.requesterId = requesterId;
        this.stageOwner = stageOwner;
        this.stageRequester = stageRequester;

        if (bookImage != null) {
            this.bookImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(bookImage);
        }
    }
}
