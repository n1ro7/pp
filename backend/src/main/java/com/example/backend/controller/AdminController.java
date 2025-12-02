package com.example.backend.controller;

import com.example.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 获取用户列表
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("page", page);
            params.put("pageSize", pageSize);
            params.put("search", search);
            params.put("role", role);
            params.put("status", status);
            
            Map<String, Object> result = adminService.getUsers(params);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 添加用户
    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody Map<String, Object> userData) {
        try {
            // 实际项目中应使用DTO或实体类接收参数
            Object user = adminService.addUser(null); // 简化处理
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "添加成功");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 更新用户
    @PutMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> userData) {
        try {
            // 实际项目中应使用DTO或实体类接收参数
            Object user = adminService.updateUser(userId, null); // 简化处理
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "更新成功");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 删除用户
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            
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

    // 重置密码
    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@PathVariable Long userId, @RequestBody Map<String, Object> passwordData) {
        try {
            String newPassword = (String) passwordData.get("newPassword");
            Map<String, Object> result = adminService.resetPassword(userId, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "密码重置成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取操作日志
    @GetMapping("/operation-logs")
    public ResponseEntity<Map<String, Object>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String operationType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("page", page);
            params.put("pageSize", pageSize);
            params.put("operator", operator);
            params.put("operationType", operationType);
            params.put("startDate", startDate);
            params.put("endDate", endDate);
            
            Map<String, Object> result = adminService.getOperationLogs(params);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取系统设置
    @GetMapping("/system-settings")
    public ResponseEntity<Map<String, Object>> getSystemSettings() {
        try {
            Map<String, Object> settings = adminService.getSystemSettings();
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", settings);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 更新系统设置
    @PutMapping("/system-settings")
    public ResponseEntity<Map<String, Object>> updateSystemSettings(@RequestBody Map<String, Object> settings) {
        try {
            adminService.updateSystemSettings(settings);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "更新成功");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}