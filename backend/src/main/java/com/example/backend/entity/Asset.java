package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
public class Asset {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 20)
    private String type; // 股票、债券、基金、房产、现金等

    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal price;

    @Column(name = "current_value", nullable = false, precision = 18, scale = 6)
    private BigDecimal currentValue;

    @Column(name = "cost_price", nullable = false, precision = 18, scale = 6)
    private BigDecimal costPrice;

    @Column(name = "profit_rate", precision = 10, scale = 2)
    private BigDecimal profitRate;

    @Column(name = "crypto_type", length = 20)
    private String cryptoType; // BTC、ETH等加密货币类型

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 关联关系
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL)
    private List<AssetHistory> assetHistories;

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