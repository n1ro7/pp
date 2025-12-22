package com.example.backend.service;

import com.example.backend.entity.Asset;
import com.example.backend.entity.AssetHistory;
import com.example.backend.repository.AssetHistoryRepository;
import com.example.backend.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;
    
    @Autowired
    private AssetHistoryRepository assetHistoryRepository;

    // 获取用户的所有资产，并自动更新价格和相关计算
    public List<Asset> getAllAssets(Long userId) {
        List<Asset> assets = assetRepository.findByUserId(userId);
        
        return assets;
    }

    // 根据资产类型获取资产
    public List<Asset> getAssetsByType(Long userId, String type) {
        // 暂时返回空列表，实际项目中应根据userId和type查询
        return assetRepository.findAll().stream()
                .filter(asset -> type.equals(asset.getType()))
                .collect(Collectors.toList());
    }

    // 添加新资产
    public Asset addAsset(Asset asset) {
        calculateProfitRate(asset);
        Asset savedAsset = assetRepository.save(asset);
        // 保存资产快照
        saveAssetSnapshot(savedAsset);
        return savedAsset;
    }

    // 更新资产
    public Asset updateAsset(Asset asset) {
        Asset existingAsset = assetRepository.findById(asset.getId())
                .orElseThrow(() -> new RuntimeException("资产不存在"));
        
        // 只更新前端传递的字段，保留原有字段的值
        if (asset.getName() != null) {
            existingAsset.setName(asset.getName());
        }
        if (asset.getType() != null) {
            existingAsset.setType(asset.getType());
        }
        if (asset.getQuantity() != null) {
            existingAsset.setQuantity(asset.getQuantity());
        }
        if (asset.getPrice() != null) {
            existingAsset.setPrice(asset.getPrice());
        }
        if (asset.getCurrentValue() != null) {
            existingAsset.setCurrentValue(asset.getCurrentValue());
        }
        if (asset.getCostPrice() != null) {
            existingAsset.setCostPrice(asset.getCostPrice());
        }
        if (asset.getCryptoType() != null) {
            existingAsset.setCryptoType(asset.getCryptoType());
        }
        // 不更新user字段，保留原有值，避免user_id为null
        // existingAsset.setUser(asset.getUser());
        
        calculateProfitRate(existingAsset);
        Asset updatedAsset = assetRepository.save(existingAsset);
        // 保存资产快照
        saveAssetSnapshot(updatedAsset);
        return updatedAsset;
    }
    
    // 根据ID获取资产
    public Asset getAssetById(Long assetId) {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("资产不存在"));
    }

    // 删除资产
    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }

    // 计算收益率
    public void calculateProfitRate(Asset asset) {
        if (asset.getCostPrice() != null && asset.getCostPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal profit = asset.getCurrentValue().subtract(asset.getCostPrice().multiply(asset.getQuantity()));
            BigDecimal cost = asset.getCostPrice().multiply(asset.getQuantity());
            asset.setProfitRate(profit.divide(cost, 2, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(100)));
        }
    }

    // 获取资产统计信息（用于饼图展示）
    public List<Map<String, Object>> getAssetDistribution(Long userId) {
        List<Asset> assets = assetRepository.findAll();
        BigDecimal totalValue = assets.stream()
                .map(Asset::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return assets.stream().map(asset -> {
            Map<String, Object> distribution = new HashMap<>();
            distribution.put("name", asset.getName());
            distribution.put("value", asset.getCurrentValue().divide(totalValue, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(100)));
            distribution.put("amount", asset.getCurrentValue());
            distribution.put("rateText", String.format("%.1f%%", distribution.get("value")));
            return distribution;
        }).collect(Collectors.toList());
    }
    
    // 获取资产统计数据
    public Map<String, Object> getAssetStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        // 暂时返回模拟数据
        stats.put("totalAssets", 0);
        stats.put("totalValue", BigDecimal.ZERO);
        stats.put("totalProfit", BigDecimal.ZERO);
        return stats;
    }
    
    // 保存资产快照
    public void saveAssetSnapshot(Asset asset) {
        AssetHistory assetHistory = new AssetHistory();
        assetHistory.setAsset(asset);
        assetHistory.setPrice(asset.getPrice());
        assetHistory.setQuantity(asset.getQuantity());
        assetHistory.setCurrentValue(asset.getCurrentValue());
        assetHistory.setCostPrice(asset.getCostPrice());
        assetHistory.setProfitRate(asset.getProfitRate());
        assetHistory.setCryptoType(asset.getCryptoType());
        assetHistory.setSnapshotTime(LocalDateTime.now());
        
        assetHistoryRepository.save(assetHistory);
    }
    
    // 保存所有资产的快照
    public void saveAllAssetsSnapshot() {
        List<Asset> allAssets = assetRepository.findAll();
        for (Asset asset : allAssets) {
            saveAssetSnapshot(asset);
        }
    }
    
    // 根据用户ID和时间范围获取资产历史数据
    public List<Map<String, Object>> getAssetHistory(Long userId, String timeRange) {
        // 计算时间范围
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;
        
        if ("7days".equals(timeRange)) {
            startTime = endTime.minusDays(7);
        } else if ("30days".equals(timeRange)) {
            startTime = endTime.minusDays(30);
        } else {
            startTime = endTime.minusDays(7); // 默认7天
        }
        
        // 获取用户的所有资产
        List<Asset> assets = assetRepository.findByUserId(userId);
        if (assets.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 获取所有资产的历史记录
        List<AssetHistory> allHistory = new ArrayList<>();
        for (Asset asset : assets) {
            List<AssetHistory> assetHistory = assetHistoryRepository.findByAssetIdAndSnapshotTimeBetween(
                    asset.getId(), startTime, endTime);
            allHistory.addAll(assetHistory);
        }
        
        // 按时间分组
        Map<LocalDateTime, Map<String, Object>> historyByTime = new HashMap<>();
        
        for (AssetHistory history : allHistory) {
            // 按日期分组（忽略时间）
            LocalDateTime dateKey = history.getSnapshotTime().toLocalDate().atStartOfDay();
            Map<String, Object> dayData = historyByTime.computeIfAbsent(dateKey, k -> {
                Map<String, Object> data = new HashMap<>();
                data.put("date", dateKey.toLocalDate().toString());
                return data;
            });
            
            // 添加资产数据 - 使用 currentValue 而不是 profitRate，因为前端需要的是占比数据
            // 这里我们返回的是固定比率，因为用户要求比率不变，只变动价值
            dayData.put(history.getCryptoType(), history.getProfitRate());
        }
        
        // 转换为列表并按时间排序
        List<Map<String, Object>> result = historyByTime.values().stream()
                .sorted((a, b) -> a.get("date").toString().compareTo(b.get("date").toString()))
                .collect(Collectors.toList());
        
        // 如果没有历史数据，返回空列表
        return result;
    }
}