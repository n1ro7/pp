package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "crypto_type", nullable = false, length = 20)
    private String cryptoType; // BTC、ETH、SOL等

    @Column(name = "market_impact", nullable = false, length = 20)
    private String marketImpact; // positive、negative、neutral

    @Column(name = "publish_time", nullable = false)
    private LocalDateTime publishTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 关联关系
    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL)
    private List<UserMessage> userMessages;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (publishTime == null) {
            publishTime = LocalDateTime.now();
        }
    }
}