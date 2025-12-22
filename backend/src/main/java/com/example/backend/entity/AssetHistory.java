package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_history")
@Data
@NoArgsConstructor
public class AssetHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal price;

    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;

    @Column(name = "current_value", nullable = false, precision = 18, scale = 6)
    private BigDecimal currentValue;

    @Column(name = "cost_price", nullable = false, precision = 18, scale = 6)
    private BigDecimal costPrice;

    @Column(name = "profit_rate", precision = 10, scale = 2)
    private BigDecimal profitRate;

    @Column(name = "snapshot_time", nullable = false)
    private LocalDateTime snapshotTime;

    @Column(name = "crypto_type", length = 20)
    private String cryptoType; // BTC、ETH等加密货币类型

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 新增：数据库表中存在的date字段，映射到LocalDate类型
    @Column(name = "date", nullable = false)
    private LocalDate date;

    // 新增：数据库表中存在的value字段，映射到BigDecimal类型
    @Column(name = "value", nullable = false, precision = 18, scale = 6)
    private BigDecimal value;

    // 新增：数据库表中存在的percentage字段，映射到BigDecimal类型
    @Column(name = "percentage", nullable = false, precision = 10, scale = 2)
    private BigDecimal percentage;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // 自动设置date字段为snapshot_time的日期部分
        if (snapshotTime != null) {
            date = snapshotTime.toLocalDate();
        } else {
            date = LocalDate.now();
        }
        // 设置value字段为currentValue的值
        value = currentValue;
        // 设置percentage字段为固定比率
        // 根据用户要求，比率是固定的：BTC 40%、ETH 35%、SOL 15%、USDT 10%
        if (cryptoType != null) {
            switch (cryptoType) {
                case "BTC":
                    percentage = BigDecimal.valueOf(40);
                    break;
                case "ETH":
                    percentage = BigDecimal.valueOf(35);
                    break;
                case "SOL":
                    percentage = BigDecimal.valueOf(15);
                    break;
                case "USDT":
                    percentage = BigDecimal.valueOf(10);
                    break;
                default:
                    percentage = BigDecimal.ZERO;
                    break;
            }
        } else {
            percentage = BigDecimal.ZERO;
        }
    }
}