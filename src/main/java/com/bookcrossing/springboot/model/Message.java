package com.bookcrossing.springboot.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.sql.Timestamp;

@Entity
@Table(name = "messages")
@Data
@ToString
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private int messageId;
    @Column(name = "exchange_id")
    private int exchangeId;
    @Column(name = "sender_id")
    private int senderId;
    @Column(name = "receiver_id")
    private int receiverId;
    private String content;
    @Column(name = "timestamp", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private Timestamp timestamp;

    public Message(int exchangeId, int senderId, String content, int receiverId) {
        this.exchangeId = exchangeId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
    }

    public Message() {

    }
}