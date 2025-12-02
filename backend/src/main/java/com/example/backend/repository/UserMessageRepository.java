package com.example.backend.repository;

import com.example.backend.entity.User;
import com.example.backend.entity.UserMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {
    List<UserMessage> findByUserAndIsRead(User user, Boolean isRead);
    List<UserMessage> findByUserOrderByCreatedAtDesc(User user);
    UserMessage findByUserIdAndMessageId(Long userId, Long messageId);
    long countByUserAndIsRead(User user, Boolean isRead);
}