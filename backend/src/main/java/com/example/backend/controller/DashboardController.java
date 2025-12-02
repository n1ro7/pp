package com.example.backend.controller;

import com.example.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // 获取仪表盘统计数据
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@RequestParam Long userId) {
        try {
            Map<String, Object> stats = dashboardService.getDashboardStats(userId);
            
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

    // 获取资产分布数据
    @GetMapping("/asset-distribution")
    public ResponseEntity<Map<String, Object>> getAssetDistribution(@RequestParam Long userId) {
        try {
            // 实际项目中应调用DashboardService获取资产分布数据
            Map<String, Object> distribution = new HashMap<>();
            
            // 模拟数据
            distribution.put("stock", 40.5);
            distribution.put("bond", 25.2);
            distribution.put("fund", 15.3);
            distribution.put("realEstate", 12.0);
            distribution.put("cash", 7.0);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", distribution);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取最近交易记录
    @GetMapping("/recent-transactions")
    public ResponseEntity<Map<String, Object>> getRecentTransactions(@RequestParam Long userId, @RequestParam(defaultValue = "10") int limit) {
        try {
            // 实际项目中应调用相关Service获取最近交易记录
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", new HashMap<>());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}