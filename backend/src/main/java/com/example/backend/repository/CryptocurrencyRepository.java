package com.example.backend.repository;

import com.example.backend.entity.Cryptocurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency, Long> {
    Optional<Cryptocurrency> findBySymbol(String symbol);
    
    // 删除所有记录（用于测试和重置数据）
    void deleteAll();
    
    // 重置id序列，让id从1开始
    @Modifying
    @Query(value = "ALTER TABLE cryptocurrencies AUTO_INCREMENT = 1", nativeQuery = true)
    void resetIdSequence();
}