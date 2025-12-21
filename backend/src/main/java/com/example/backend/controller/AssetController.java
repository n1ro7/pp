package com.example.backend.controller;

import com.example.backend.entity.Asset;
import com.example.backend.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetService assetService;

    // 获取用户资产列表
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAssets(@RequestParam Long userId, @RequestParam(required = false) String type) {
        try {
            List<Asset> assets;
            if (type != null) {
                assets = assetService.getAssetsByType(userId, type);
            } else {
                assets = assetService.getAllAssets(userId);
            }
            
            // 清除循环引用，设置user为null
            assets.forEach(asset -> {
                asset.setUser(null);
                if (asset.getAssetHistories() != null) {
                    asset.getAssetHistories().forEach(history -> {
                        history.setAsset(null);
                    });
                }
            });
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", assets);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取资产详情
    @GetMapping("/{assetId}")
    public ResponseEntity<Map<String, Object>> getAssetDetail(@PathVariable Long assetId) {
        try {
            Asset asset = assetService.getAssetById(assetId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", asset);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 404);
            response.put("message", "资产不存在");
            
            return ResponseEntity.ok(response);
        }
    }

    // 添加资产
    @PostMapping
    public ResponseEntity<Map<String, Object>> addAsset(@RequestBody Asset asset) {
        try {
            Asset newAsset = assetService.addAsset(asset);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "添加成功");
            response.put("data", newAsset);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 更新资产
    @PutMapping("/{assetId}")
    public ResponseEntity<Map<String, Object>> updateAsset(@PathVariable Long assetId, @RequestBody Asset asset) {
        try {
            asset.setId(assetId);
            Asset updatedAsset = assetService.updateAsset(asset);
            
            // 清除循环引用，设置user为null，避免前端处理响应时出现问题
            updatedAsset.setUser(null);
            if (updatedAsset.getAssetHistories() != null) {
                updatedAsset.getAssetHistories().forEach(history -> {
                    history.setAsset(null);
                });
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "更新成功");
            response.put("data", updatedAsset);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage() != null ? e.getMessage() : "更新资产失败");
            
            return ResponseEntity.ok(response);
        }
    }

    // 删除资产
    @DeleteMapping("/{assetId}")
    public ResponseEntity<Map<String, Object>> deleteAsset(@PathVariable Long assetId) {
        try {
            assetService.deleteAsset(assetId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "删除成功");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取资产统计数据
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getAssetStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = assetService.getAssetStats(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}