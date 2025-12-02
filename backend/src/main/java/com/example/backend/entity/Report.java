package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "analyst_id", nullable = false)
    private User analyst;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "crypto_type", nullable = false, length = 20)
    private String cryptoType; // BTC、ETH、SOL等

    @Column(name = "confidence_index", nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceIndex; // 信心指数 0-10

    @Column(name = "expected_change", precision = 8, scale = 2)
    private BigDecimal expectedChange; // 预期价格变动百分比

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content; // 报告内容

    @Column(nullable = false, length = 20)
    private String status; // draft、pending_review、approved、rejected

    @Column(name = "review_comment", columnDefinition = "LONGTEXT")
    private String reviewComment; // 审核意见

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "publish_at")
    private LocalDateTime publishAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}