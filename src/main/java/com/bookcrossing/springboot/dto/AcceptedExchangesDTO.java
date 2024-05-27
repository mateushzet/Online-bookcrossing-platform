package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

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



    public AcceptedExchangesDTO(int exchangeId, int ownerId, int requesterId, int stageOwner, int stageRequester) {
        this.exchangeId = exchangeId;
        this.ownerId = ownerId;
        this.requesterId = requesterId;
        this.stageOwner = stageOwner;
        this.stageRequester = stageRequester;
    }
}
