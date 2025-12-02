package com.example.backend.service;

import com.example.backend.entity.Message;
import com.example.backend.entity.UserMessage;
import com.example.backend.repository.MessageRepository;
import com.example.backend.repository.UserMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserMessageRepository userMessageRepository;

    // 获取消息列表（支持分页和筛选）
    public Map<String, Object> getMessages(Map<String, Object> params) {
        // 简化实现，实际应该根据参数进行分页和筛选
        List<Message> messages = messageRepository.findAll(Sort.by(Sort.Direction.DESC, "publishTime"));
        
        Map<String, Object> result = new HashMap<>();
        result.put("items", messages);
        result.put("total", messages.size());
        result.put("page", params.get("page"));
        result.put("pageSize", params.get("pageSize"));
        
        return result;
    }

    // 获取消息详情
    public Map<String, Object> getMessageDetail(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("消息不存在"));
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", message);
        result.put("isRead", true); // 简化实现
        
        return result;
    }

    // 标记消息为已读（单个）
    public void markAsRead(Long userId, Long messageId) {
        UserMessage userMessage = userMessageRepository.findByUserIdAndMessageId(userId, messageId);
        if (userMessage != null) {
            userMessage.setIsRead(true);
            userMessage.setReadAt(LocalDateTime.now());
            userMessageRepository.save(userMessage);
        }
    }

    // 标记消息为已读（批量）
    public void markBatchAsRead(Iterable<Long> messageIds, Long userId) {
        for (Long messageId : messageIds) {
            markAsRead(userId, messageId);
        }
    }

    // 获取未读消息数
    public long getUnreadCount(Long userId) {
        // 简化实现，实际应该从数据库查询
        return 0;
    }

    // 删除消息
    public void deleteMessage(Long userId, Long messageId) {
        UserMessage userMessage = userMessageRepository.findByUserIdAndMessageId(userId, messageId);
        if (userMessage != null) {
            userMessageRepository.delete(userMessage);
        }
    }

    // 添加新消息
    public Message addMessage(Message message) {
        Message savedMessage = messageRepository.save(message);
        // 实际项目中应将消息推送给相关用户
        return savedMessage;
    }
}