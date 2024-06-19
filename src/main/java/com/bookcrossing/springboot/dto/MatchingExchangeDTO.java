package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchingExchangeDTO {
    private Long matchingExchangeId;
    private String matchingTitle;
    private String matchingAuthor;
    private String matchingCondition;
    private String matchingGenre;
    private Long matchingOwnerId;
    private String matchingOwnerUsername;
    private Long originalExchangeId;
    private String originalTitle;
    private String originalAuthor;
    private String originalCondition;
    private String originalGenre;
    private Long originalOwnerId;
    private String originalOwnerUsername;

}
