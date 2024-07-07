package com.bookcrossing.springboot.dto;

import com.bookcrossing.springboot.model.Message;
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
    private String senderUsername;

    public MessageDTO(Message message, String senderUsername) {
        this.messageId = message.getMessageId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
        this.senderUsername = senderUsername;
        this.senderId = message.getSenderId();
    }

    public MessageDTO() {
    }
}
