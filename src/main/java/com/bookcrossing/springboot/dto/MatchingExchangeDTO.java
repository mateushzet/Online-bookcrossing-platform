package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchingExchangeDTO {
    private Integer originalExchangeId;
    private Integer originalOwnerId;
    private String originalUsername;
    private String originalBookTitle;
    private String originalBookAuthor;
    private String originalBookCondition;
    private String originalBookGenre;
    private Integer matchingExchangeId;
    private Integer matchingOwnerId;
    private String matchingUsername;
    private String matchingBookTitle;
    private String matchingBookAuthor;
    private String matchingBookCondition;
    private String matchingBookGenre;
    private int notificationType;

    // Poprawiony konstruktor
    public MatchingExchangeDTO(
            Integer originalExchangeId, Integer originalOwnerId, String originalUsername,
            String originalBookTitle, String originalBookAuthor, String originalBookCondition,
            String originalBookGenre, Integer matchingExchangeId, Integer matchingOwnerId,
            String matchingUsername, String matchingBookTitle, String matchingBookAuthor,
            String matchingBookCondition, String matchingBookGenre) {

        this.originalExchangeId = originalExchangeId;
        this.originalOwnerId = originalOwnerId;
        this.originalUsername = originalUsername;
        this.originalBookTitle = originalBookTitle;
        this.originalBookAuthor = originalBookAuthor;
        this.originalBookCondition = originalBookCondition;
        this.originalBookGenre = originalBookGenre;
        this.matchingExchangeId = matchingExchangeId;
        this.matchingOwnerId = matchingOwnerId;
        this.matchingUsername = matchingUsername;
        this.matchingBookTitle = matchingBookTitle;
        this.matchingBookAuthor = matchingBookAuthor;
        this.matchingBookCondition = matchingBookCondition;
        this.matchingBookGenre = matchingBookGenre;
    }

}
