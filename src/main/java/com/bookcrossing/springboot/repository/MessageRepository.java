package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.exchangeId = :exchangeId AND ((m.senderId = :userId AND m.receiverId = :ownerId) OR (m.senderId = :ownerId AND m.receiverId = :userId)) ORDER BY timestamp ")
    List<Message> findByExchangeIdAndUserId(@Param("exchangeId") Long exchangeId, @Param("userId") int userId, @Param("ownerId") Long ownerId);

   }
