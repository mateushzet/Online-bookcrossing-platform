package com.bookcrossing.springboot.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Base64;

@Entity
@Table(name = "AcceptedExchanges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AcceptedExchanges {

    @EmbeddedId
    private AcceptedExchangesId id;
    @Column(name = "stage_owner")
    private int stageOwner;
    @Column(name = "stars_owner")
    private int starsOwner;
    @Column(name = "stage_requester")
    private int stageRequester;
    @Column(name = "stars_requester")
    private int starsRequester;

    public AcceptedExchanges(AcceptedExchangesId id, int stageOwner, int stageRequester) {
        this.id = id;
        this.stageOwner = stageOwner;
        this.stageRequester = stageRequester;
    }

    @ManyToOne
    @JoinColumn(name = "exchange_id", insertable = false, updatable = false)
    @JsonManagedReference
    private Exchange exchange;
}
