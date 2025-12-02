package com.example.backend.service;

import com.example.backend.entity.OperationLog;
import com.example.backend.entity.SystemSettings;
import com.example.backend.entity.User;
import com.example.backend.repository.OperationLogRepository;
import com.example.backend.repository.SystemSettingsRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    @Autowired
    private OperationLogRepository operationLogRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 获取用户列表（支持分页和筛选）
    public Map<String, Object> getUsers(Map<String, Object> params) {
        int page = (int) params.getOrDefault("page", 1);
        int pageSize = (int) params.getOrDefault("pageSize", 10);
        String search = (String) params.get("search");
        String role = (String) params.get("role");
        String status = (String) params.get("status");
        
        // 实际项目中应使用复杂查询
        List<User> users = userRepository.findAll();
        
        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("total", users.size());
        result.put("page", page);
        result.put("pageSize", pageSize);
        
        return result;
    }

    // 添加用户
    public User addUser(User user) {
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    // 更新用户
    public User updateUser(Long userId, User user) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        existingUser.setName(user.getName());
        existingUser.setRole(user.getRole());
        existingUser.setStatus(user.getStatus());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(existingUser);
    }

    // 删除用户
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // 重置密码
    public Map<String, Object> resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("userId", userId);
        result.put("message", "密码重置成功");
        
        return result;
    }

    // 获取操作日志
    public Map<String, Object> getOperationLogs(Map<String, Object> params) {
        List<OperationLog> logs = operationLogRepository.findAll();
        
        Map<String, Object> result = new HashMap<>();
        result.put("logs", logs);
        result.put("total", logs.size());
        
        return result;
    }

    // 添加操作日志
    public OperationLog addOperationLog(User operator, String operation, String operationType, String targetEntity, Long targetId, String details, String ipAddress, String userAgent) {
        OperationLog log = new OperationLog();
        log.setOperator(operator);
        log.setOperation(operation);
        log.setOperationType(operationType);
        log.setTargetEntity(targetEntity);
        log.setTargetId(targetId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        
        return operationLogRepository.save(log);
    }

    // 获取系统设置
    public Map<String, Object> getSystemSettings() {
        List<SystemSettings> settings = systemSettingsRepository.findAll();
        Map<String, Object> result = new HashMap<>();
        
        settings.forEach(setting -> {
            // 根据数据类型转换值
            switch (setting.getDataType()) {
                case "number":
                    result.put(setting.getSettingKey(), Double.parseDouble(setting.getSettingValue()));
                    break;
                case "boolean":
                    result.put(setting.getSettingKey(), Boolean.parseBoolean(setting.getSettingValue()));
                    break;
                case "json":
                    // 实际项目中应使用JSON解析
                    result.put(setting.getSettingKey(), setting.getSettingValue());
                    break;
                default:
                    result.put(setting.getSettingKey(), setting.getSettingValue());
            }
        });
        
        return result;
    }

    // 更新系统设置
    public void updateSystemSettings(Map<String, Object> settings) {
        settings.forEach((key, value) -> {
            SystemSettings setting = systemSettingsRepository.findBySettingKey(key)
                    .orElseGet(() -> {
                        SystemSettings newSetting = new SystemSettings();
                        newSetting.setSettingKey(key);
                        newSetting.setDataType(value.getClass().getSimpleName());
                        return newSetting;
                    });
            
            setting.setSettingValue(value.toString());
            setting.setUpdatedAt(LocalDateTime.now());
            systemSettingsRepository.save(setting);
        });
    }
}