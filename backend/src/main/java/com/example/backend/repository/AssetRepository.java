package com.example.backend.repository;

import com.example.backend.entity.Asset;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUser(User user);
    List<Asset> findByUserId(Long userId);
    List<Asset> findByUserAndType(User user, String type);
    List<Asset> findByCryptoType(String cryptoType);
}