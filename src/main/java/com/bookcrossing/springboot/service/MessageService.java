package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.model.Message;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.repository.AcceptedExchangesRepository;
import com.bookcrossing.springboot.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final AcceptedExchangesRepository acceptedExchangesRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, AcceptedExchangesRepository acceptedExchangesRepository) {
        this.messageRepository = messageRepository;
        this.acceptedExchangesRepository = acceptedExchangesRepository;
    }

    public List<Message> getExchangeMessages(Long exchangeId, int userId, Long ownerId) {
        return messageRepository.findByExchangeIdAndUserId(exchangeId, userId, ownerId);
    }

    @Transactional
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<User> getParticipantsByExchangeId(Long exchangeId, int userId, Long ownerId) {
        return acceptedExchangesRepository.findParticipantsByExchangeId(exchangeId, userId, ownerId);
    }
}
