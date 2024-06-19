package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.MessageDTO;
import com.bookcrossing.springboot.model.Message;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.repository.AcceptedExchangesRepository;
import com.bookcrossing.springboot.repository.MessageRepository;
import com.bookcrossing.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final AcceptedExchangesRepository acceptedExchangesRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, AcceptedExchangesRepository acceptedExchangesRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.acceptedExchangesRepository = acceptedExchangesRepository;
        this.userRepository = userRepository;
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

    public List<MessageDTO> getMessages(Long exchangeId, Long userId, Long ownerId) {
        List<Message> messages = messageRepository.findByExchangeIdAndUserId(exchangeId, userId.intValue(), ownerId);
        return messages.stream()
                .map(message -> {
                    String senderUsername = userRepository.findById(Long.valueOf(message.getSenderId())).get().getUsername();
                    return new MessageDTO(message, senderUsername);
                })
                .collect(Collectors.toList());
    }
}
