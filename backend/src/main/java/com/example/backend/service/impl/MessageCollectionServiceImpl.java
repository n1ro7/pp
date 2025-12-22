package com.example.backend.service.impl;

import com.example.backend.entity.Message;
import com.example.backend.service.MessageCollectionService;
import com.example.backend.service.MessageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessageCollectionServiceImpl implements MessageCollectionService {

    @Autowired
    private MessageService messageService;

    private final String difyApiUrl;
    private final String difyApiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final int MAX_RETRY_COUNT = 3;

    public MessageCollectionServiceImpl(@Value("${dify.api.url}") String difyApiUrl,
                                       @Value("${dify.api.key}") String difyApiKey) {
        this.difyApiUrl = difyApiUrl;
        this.difyApiKey = difyApiKey;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void collectAndSaveMessages() {
        int retryCount = 0;
        boolean success = false;

        while (retryCount < MAX_RETRY_COUNT && !success) {
            try {
                // 调用Dify智能体接口获取消息
                List<Message> messages = fetchMessagesFromDify();
                
                if (messages.isEmpty()) {
                    // 无新消息时，生成"今日无新增消息"记录
                    Message emptyMessage = new Message();
                    emptyMessage.setTitle("今日无新增消息");
                    emptyMessage.setContent("Dify智能体未采集到新的加密货币相关消息");
                    emptyMessage.setCryptoType("ALL");
                    emptyMessage.setMarketImpact("neutral");
                    emptyMessage.setPublishTime(LocalDateTime.now());
                    messageService.addMessage(emptyMessage);
                } else {
                    // 保存采集到的消息
                    for (Message message : messages) {
                        messageService.addMessage(message);
                    }
                }
                success = true;
            } catch (Exception e) {
                retryCount++;
                System.err.println("消息采集失败，正在尝试第" + retryCount + "次重试: " + e.getMessage());
                if (retryCount >= MAX_RETRY_COUNT) {
                    System.err.println("消息采集已达到最大重试次数，采集失败: " + e.getMessage());
                }
                // 重试间隔1分钟
                try {
                    Thread.sleep(60000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    /**
     * 从Dify API获取消息
     * @return 结构化消息列表
     */
    private List<Message> fetchMessagesFromDify() throws Exception {
        List<Message> messages = new ArrayList<>();

        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(difyApiKey);

        // 设置请求体
        String requestBody = "{\"inputs\": {}, \"response_mode\": \"blocking\", \"user\": \"message-collector\"}";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // 发送POST请求
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(difyApiUrl, requestEntity, String.class);
        String response = responseEntity.getBody();

        if (response == null) {
            throw new RuntimeException("Dify API响应为空");
        }

        // 解析响应
        JsonNode rootNode = objectMapper.readTree(response);
        JsonNode textNode = rootNode.path("text");
        String textContent = textNode.asText();

        // 移除JSON代码块标记
        String jsonString = textContent.replaceAll("```json", "").replaceAll("```", "").trim();

        if (jsonString.isEmpty()) {
            return messages; // 返回空列表表示无新消息
        }

        // 解析为JSON数组
        JsonNode dataNode = objectMapper.readTree(jsonString);
        if (!dataNode.isArray()) {
            throw new RuntimeException("Dify API返回的数据不是JSON数组");
        }

        // 转换为实体类列表
        for (JsonNode node : dataNode) {
            Message message = new Message();
            message.setTitle(node.path("title").asText());
            message.setContent(node.path("content").asText());
            message.setCryptoType(node.path("crypto_type").asText());
            message.setMarketImpact(node.path("market_impact").asText());
            message.setPublishTime(LocalDateTime.now());
            messages.add(message);
        }

        return messages;
    }
}
