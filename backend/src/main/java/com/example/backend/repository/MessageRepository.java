package com.example.backend.repository;

import com.example.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCryptoType(String cryptoType);
    List<Message> findByPublishTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Message> findByMarketImpact(String marketImpact);
}