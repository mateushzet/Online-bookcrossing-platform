package com.bookcrossing.springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AcceptedExchangesId implements Serializable {

    @Column(name = "exchange_id")
    private int exchangeId;

    @Column(name = "owner_id")
    private int ownerId;

    @Column(name = "requester_id")
    private int requesterId;

}