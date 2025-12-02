package com.example.backend.controller;

import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 登录接口
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        Map<String, Object> result = authService.login(username, password);
        
        // 返回统一格式的响应
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("code", 200);
        response.put("message", "登录成功");
        response.put("data", result);
        
        return ResponseEntity.ok(response);
    }

    // 获取当前用户信息
    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestParam String username) {
        Map<String, Object> userInfo = new java.util.HashMap<>();
        try {
            // 实际项目中应从token中获取用户信息
            // 这里简化处理
            userInfo.put("id", 1);
            userInfo.put("username", username);
            userInfo.put("name", "管理员");
            userInfo.put("role", "admin");
            
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", userInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 注销接口
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        // 实际项目中可能需要处理token的失效
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("code", 200);
        response.put("message", "注销成功");
        
        return ResponseEntity.ok(response);
    }
}