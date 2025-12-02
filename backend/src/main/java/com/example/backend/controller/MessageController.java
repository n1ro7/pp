package com.example.backend.controller;

import com.example.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // 获取消息列表
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMessages(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String cryptoType,
            @RequestParam(required = false) String marketImpact,
            @RequestParam(required = false) String isRead) {
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("page", page);
            params.put("pageSize", pageSize);
            params.put("cryptoType", cryptoType);
            params.put("marketImpact", marketImpact);
            params.put("isRead", isRead);
            
            Map<String, Object> result = messageService.getMessages(params);
            
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

    // 获取消息详情
    @GetMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> getMessageDetail(@PathVariable Long messageId, @RequestParam Long userId) {
        try {
            Map<String, Object> message = messageService.getMessageDetail(messageId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", message);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 404);
            response.put("message", "消息不存在");
            
            return ResponseEntity.ok(response);
        }
    }

    // 标记消息为已读
    @PutMapping("/{messageId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long messageId, @RequestParam Long userId) {
        try {
            messageService.markAsRead(messageId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "标记成功");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 批量标记消息为已读
    @PutMapping("/batch-read")
    public ResponseEntity<Map<String, Object>> markBatchAsRead(@RequestBody Map<String, Object> data) {
        try {
            Long userId = Long.parseLong(data.get("userId").toString());
            @SuppressWarnings("unchecked")
            Iterable<Long> messageIds = (Iterable<Long>) data.get("messageIds");
            
            messageService.markBatchAsRead(messageIds, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "批量标记成功");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取未读消息数
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@RequestParam Long userId) {
        try {
            long count = messageService.getUnreadCount(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 删除消息
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable Long messageId, @RequestParam Long userId) {
        try {
            messageService.deleteMessage(messageId, userId);
            
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
}