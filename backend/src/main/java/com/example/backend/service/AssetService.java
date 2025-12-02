package com.example.backend.service;

import com.example.backend.entity.Asset;
import com.example.backend.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    // 获取用户的所有资产
    public List<Asset> getAllAssets(Long userId) {
        // 暂时返回空列表，实际项目中应根据userId查询
        return assetRepository.findAll();
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
        return assetRepository.save(asset);
    }

    // 更新资产
    public Asset updateAsset(Asset asset) {
        Asset existingAsset = assetRepository.findById(asset.getId())
                .orElseThrow(() -> new RuntimeException("资产不存在"));
        
        existingAsset.setName(asset.getName());
        existingAsset.setType(asset.getType());
        existingAsset.setQuantity(asset.getQuantity());
        existingAsset.setPrice(asset.getPrice());
        existingAsset.setCurrentValue(asset.getCurrentValue());
        existingAsset.setCostPrice(asset.getCostPrice());
        existingAsset.setCryptoType(asset.getCryptoType());
        
        calculateProfitRate(existingAsset);
        
        return assetRepository.save(existingAsset);
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
    private void calculateProfitRate(Asset asset) {
        if (asset.getCostPrice().compareTo(BigDecimal.ZERO) > 0) {
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
}