package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class MessageDTO {

    private int messageId;
    private int exchangeId;
    private int senderId;
    private int receiverId;
    private String content;
    private Timestamp timestamp;

    public MessageDTO(int messageId, int exchangeId, int senderId, int receiverId, String content, Timestamp timestamp) {
        this.messageId = messageId;
        this.exchangeId = exchangeId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

}
