package com.example.backend.repository;
import com.example.backend.entity.AssetHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssetHistoryRepository extends JpaRepository<AssetHistory, Long> {
    // 根据资产ID查询历史记录
    List<AssetHistory> findByAssetId(Long assetId);
    
    // 根据资产ID和时间范围查询历史记录
    List<AssetHistory> findByAssetIdAndSnapshotTimeBetween(Long assetId, LocalDateTime startTime, LocalDateTime endTime);
    
    // 根据资产ID和时间范围查询历史记录，并按时间降序排序
    List<AssetHistory> findByAssetIdAndSnapshotTimeBetweenOrderBySnapshotTimeDesc(Long assetId, LocalDateTime startTime, LocalDateTime endTime);
    
    // 根据资产ID查询最新的历史记录
    AssetHistory findTopByAssetIdOrderBySnapshotTimeDesc(Long assetId);
    
    // 根据用户ID查询历史记录（通过Asset.user.id关联）
    List<AssetHistory> findByAsset_UserId(Long userId);
    
    // 根据用户ID和时间范围查询历史记录
    List<AssetHistory> findByAsset_UserIdAndSnapshotTimeBetween(Long userId, LocalDateTime startTime, LocalDateTime endTime);
}