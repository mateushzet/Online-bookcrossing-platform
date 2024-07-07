package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Notification> findByIdAndUserId(Long notificationId, int userId);

    boolean existsByUserIdAndMessage(Long userId, String message);
}