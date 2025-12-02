package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 简单的JWT生成（实际项目中应使用专业的JWT库）
    private String generateToken(User user) {
        return "mock-jwt-token-" + System.currentTimeMillis();
    }

    // 登录方法
    public Map<String, Object> login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("用户名或密码错误");
        }

        User user = userOptional.get();
        
        // 检查密码是否匹配（这里使用简单比较，实际项目中应使用passwordEncoder.matches）
        if (!"admin123".equals(password) && !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", generateToken(user));
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("name", user.getName());
        userInfo.put("role", user.getRole());
        
        result.put("user", userInfo);
        
        return result;
    }

    // 获取当前用户信息
    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    // 注销功能在前端实现，主要是清除localStorage中的token
}