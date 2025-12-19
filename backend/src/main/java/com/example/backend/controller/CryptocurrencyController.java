package com.example.backend.controller;

import com.example.backend.entity.Cryptocurrency;
import com.example.backend.service.CryptocurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/cryptocurrencies", "/api/crypto/prices"})
public class CryptocurrencyController {

    private final CryptocurrencyService cryptocurrencyService;

    public CryptocurrencyController(CryptocurrencyService cryptocurrencyService) {
        this.cryptocurrencyService = cryptocurrencyService;
    }

    // 获取所有加密货币
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCryptocurrencies(@RequestParam(required = false) Integer limit) {
        try {
            // 强制重新从硬编码数据填充，确保所有字段都有值
            List<Cryptocurrency> cryptocurrencies = cryptocurrencyService.fetchAndSaveCryptocurrencyDataWithHardcoded();
            
            // 如果指定了limit参数，只返回前limit条数据
            if (limit != null && limit > 0) {
                cryptocurrencies = cryptocurrencies.subList(0, Math.min(limit, cryptocurrencies.size()));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", cryptocurrencies);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 根据Symbol获取加密货币
    @GetMapping({"/symbol/{symbol}", "/{symbol}"})
    public ResponseEntity<Map<String, Object>> getCryptocurrencyBySymbol(@PathVariable String symbol) {
        try {
            Cryptocurrency cryptocurrency = cryptocurrencyService.getCryptocurrencyBySymbol(symbol);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", cryptocurrency);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 404);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 从Dify API获取并存储加密货币数据
    @PostMapping("/fetch")
    public ResponseEntity<Map<String, Object>> fetchAndSaveCryptocurrencies() {
        try {
            List<Cryptocurrency> cryptocurrencies = cryptocurrencyService.fetchAndSaveCryptocurrencyData();
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取并存储成功");
            response.put("data", cryptocurrencies);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "获取并存储失败: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 根据ID获取加密货币
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Map<String, Object>> getCryptocurrencyById(@PathVariable Long id) {
        try {
            Cryptocurrency cryptocurrency = cryptocurrencyService.getCryptocurrencyById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", cryptocurrency);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 404);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}
