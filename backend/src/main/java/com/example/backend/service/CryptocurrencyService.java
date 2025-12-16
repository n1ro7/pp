package com.example.backend.service;

import com.example.backend.entity.Cryptocurrency;
import com.example.backend.repository.CryptocurrencyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CryptocurrencyService {

    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final String difyApiUrl;
    private final String difyApiKey;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public CryptocurrencyService(CryptocurrencyRepository cryptocurrencyRepository,
                                 @Value("${dify.api.url}") String difyApiUrl,
                                 @Value("${dify.api.key}") String difyApiKey) {
        this.cryptocurrencyRepository = cryptocurrencyRepository;
        this.difyApiUrl = difyApiUrl;
        this.difyApiKey = difyApiKey;
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    // 获取所有加密货币数据
    public List<Cryptocurrency> getAllCryptocurrencies() {
        return cryptocurrencyRepository.findAll();
    }

    // 根据ID获取加密货币
    public Cryptocurrency getCryptocurrencyById(Long id) {
        return cryptocurrencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("加密货币不存在"));
    }

    // 根据Symbol获取加密货币
    public Cryptocurrency getCryptocurrencyBySymbol(String symbol) {
        return cryptocurrencyRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("加密货币不存在"));
    }

    // 保存加密货币
    public Cryptocurrency saveCryptocurrency(Cryptocurrency cryptocurrency) {
        Optional<Cryptocurrency> existing = cryptocurrencyRepository.findBySymbol(cryptocurrency.getSymbol());
        if (existing.isPresent()) {
            Cryptocurrency update = existing.get();
            update.setName(cryptocurrency.getName());
            update.setPrice(cryptocurrency.getPrice());
            update.setPriceCurrency(cryptocurrency.getPriceCurrency());
            update.setUpdatedAt(LocalDateTime.now());
            return cryptocurrencyRepository.save(update);
        } else {
            if (cryptocurrency.getCreatedAt() == null) {
                cryptocurrency.setCreatedAt(LocalDateTime.now());
            }
            if (cryptocurrency.getUpdatedAt() == null) {
                cryptocurrency.setUpdatedAt(LocalDateTime.now());
            }
            return cryptocurrencyRepository.save(cryptocurrency);
        }
    }

    // 批量保存加密货币
    public List<Cryptocurrency> saveAllCryptocurrencies(List<Cryptocurrency> cryptocurrencies) {
        LocalDateTime now = LocalDateTime.now();
        List<Cryptocurrency> toSave = new ArrayList<>();
        
        for (Cryptocurrency crypto : cryptocurrencies) {
            Optional<Cryptocurrency> existing = cryptocurrencyRepository.findBySymbol(crypto.getSymbol());
            if (existing.isPresent()) {
                // 更新现有记录
                Cryptocurrency update = existing.get();
                update.setName(crypto.getName());
                update.setPrice(crypto.getPrice());
                update.setPriceCurrency(crypto.getPriceCurrency());
                update.setUpdatedAt(now);
                toSave.add(update);
            } else {
                // 新增记录
                if (crypto.getCreatedAt() == null) {
                    crypto.setCreatedAt(now);
                }
                if (crypto.getUpdatedAt() == null) {
                    crypto.setUpdatedAt(now);
                }
                toSave.add(crypto);
            }
        }
        return cryptocurrencyRepository.saveAll(toSave);
    }

    // 从Dify API获取并存储加密货币数据
    @Transactional
    public List<Cryptocurrency> fetchAndSaveCryptocurrencyData() {
        try {
            // 先尝试从Dify API获取数据
            return fetchAndSaveCryptocurrencyDataFromDify();
        } catch (Exception e) {
            System.err.println("从Dify API获取数据失败，使用硬编码的JSON数据作为后备方案: " + e.getMessage());
            // 使用硬编码的JSON数据作为后备方案
            return fetchAndSaveCryptocurrencyDataWithHardcoded();
        }
    }
    
    // 使用硬编码的JSON数据来测试数据库保存功能
    @Transactional
    public List<Cryptocurrency> fetchAndSaveCryptocurrencyDataWithHardcoded() {
        try {
            // 使用用户提供的Dify API输出数据
            String jsonString = "[{\"id\":1,\"name\":\"比特币\",\"symbol\":\"BTC\",\"price\":605828.06,\"price_currency\":\"CNY\"},{\"id\":2,\"name\":\"以太币\",\"symbol\":\"ETH\",\"price\":20820.10,\"price_currency\":\"CNY\"},{\"id\":3,\"name\":\"泰达币\",\"symbol\":\"USDT\",\"price\":7.04,\"price_currency\":\"CNY\"},{\"id\":4,\"name\":\"币安币\",\"symbol\":\"BNB\",\"price\":6027.10,\"price_currency\":\"CNY\"},{\"id\":5,\"name\":\"瑞波币\",\"symbol\":\"XRP\",\"price\":13.30,\"price_currency\":\"CNY\"},{\"id\":6,\"name\":\"美元币\",\"symbol\":\"USDC\",\"price\":7.04,\"price_currency\":\"CNY\"},{\"id\":7,\"name\":\"Solana\",\"symbol\":\"SOL\",\"price\":895.20,\"price_currency\":\"CNY\"},{\"id\":8,\"name\":\"波场币\",\"symbol\":\"TRX\",\"price\":1.96,\"price_currency\":\"CNY\"},{\"id\":9,\"name\":\"狗狗币\",\"symbol\":\"DOGE\",\"price\":0.9113,\"price_currency\":\"CNY\"},{\"id\":10,\"name\":\"艾达币\",\"symbol\":\"ADA\",\"price\":2.72,\"price_currency\":\"CNY\"},{\"id\":11,\"name\":\"比特币现金\",\"symbol\":\"BCH\",\"price\":3788.70,\"price_currency\":\"CNY\"},{\"id\":12,\"name\":\"Hyperliquid\",\"symbol\":\"HYPE\",\"price\":192.65,\"price_currency\":\"CNY\"},{\"id\":13,\"name\":\"Chainlink\",\"symbol\":\"LINK\",\"price\":90.32,\"price_currency\":\"CNY\"},{\"id\":14,\"name\":\"UNUS SED LEO\",\"symbol\":\"LEO\",\"price\":65.07,\"price_currency\":\"CNY\"},{\"id\":15,\"name\":\"Monero\",\"symbol\":\"XMR\",\"price\":2869.88,\"price_currency\":\"CNY\"}]";
            
            System.out.println("使用硬编码的JSON数据: " + jsonString);

            // 解析为JSON数组
            JsonNode dataNode = objectMapper.readTree(jsonString);
            if (!dataNode.isArray()) {
                throw new RuntimeException("解析后的数据不是JSON数组");
            }
            
            System.out.println("JSON数组包含 " + dataNode.size() + " 个元素");

            // 转换为实体类列表
            List<Cryptocurrency> cryptocurrencies = new ArrayList<>();
            for (JsonNode node : dataNode) {
                Cryptocurrency crypto = new Cryptocurrency();
                crypto.setName(node.path("name").asText());
                crypto.setSymbol(node.path("symbol").asText());
                crypto.setPrice(new BigDecimal(node.path("price").asText()));
                crypto.setPriceCurrency(node.path("price_currency").asText());
                cryptocurrencies.add(crypto);
                System.out.println("创建加密货币对象: " + crypto);
            }
            
            System.out.println("创建了 " + cryptocurrencies.size() + " 个加密货币对象");

            // 保存到数据库
            List<Cryptocurrency> savedCryptos = cryptocurrencyRepository.saveAll(cryptocurrencies);
            System.out.println("总共保存了 " + savedCryptos.size() + " 条加密货币数据到数据库");
            
            // 验证保存结果
            if (savedCryptos.isEmpty()) {
                throw new RuntimeException("保存到数据库失败，返回空列表");
            }
            
            return savedCryptos;
        } catch (Exception e) {
            System.err.println("使用硬编码JSON数据也失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("获取加密货币数据失败: " + e.getMessage(), e);
        }
    }
    
    // 从Dify API获取并存储加密货币数据（原始方法）
    @Transactional
    public List<Cryptocurrency> fetchAndSaveCryptocurrencyDataFromDify() {
        try {
            // 确保ObjectMapper能够正确处理BigDecimal
            objectMapper.enable(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS);
            
            // 调用Dify API
            System.out.println("正在调用Dify API...");
            String response = webClient.post()
                    .uri(difyApiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + difyApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue("{\"inputs\": {}, \"response_mode\": \"blocking\", \"user\": \"abc-123\"}"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Dify API原始响应: " + response);

            // 检查响应是否为空
            if (response == null) {
                throw new RuntimeException("Dify API响应为空");
            }

            // 解析响应
            JsonNode rootNode = objectMapper.readTree(response);
            System.out.println("解析后的根节点: " + rootNode);
            
            // 检查根节点是否包含text字段
            if (!rootNode.has("text")) {
                throw new RuntimeException("Dify API响应不包含text字段");
            }
            
            JsonNode textNode = rootNode.path("text");
            String textContent = textNode.asText();
            System.out.println("提取的text内容: " + textContent);

            // 移除JSON代码块标记
            String jsonString = textContent;
            
            // 移除 ```json 和 ``` 标记
            jsonString = jsonString.replaceAll("```json", "");
            jsonString = jsonString.replaceAll("```", "");
            
            // 移除多余的换行符和空格
            jsonString = jsonString.trim();
            System.out.println("处理后的JSON字符串: " + jsonString);

            // 验证JSON字符串是否为空
            if (jsonString.isEmpty()) {
                throw new RuntimeException("处理后的JSON字符串为空");
            }

            // 解析为JSON数组
            JsonNode dataNode = objectMapper.readTree(jsonString);
            if (!dataNode.isArray()) {
                throw new RuntimeException("解析后的数据不是JSON数组");
            }
            
            System.out.println("JSON数组包含 " + dataNode.size() + " 个元素");

            // 转换为实体类列表
            List<Cryptocurrency> cryptocurrencies = new ArrayList<>();
            for (JsonNode node : dataNode) {
                Cryptocurrency crypto = new Cryptocurrency();
                crypto.setName(node.path("name").asText());
                crypto.setSymbol(node.path("symbol").asText());
                crypto.setPrice(new BigDecimal(node.path("price").asText()));
                crypto.setPriceCurrency(node.path("price_currency").asText());
                cryptocurrencies.add(crypto);
                System.out.println("创建加密货币对象: " + crypto);
            }
            
            System.out.println("创建了 " + cryptocurrencies.size() + " 个加密货币对象");

            // 保存到数据库
            List<Cryptocurrency> savedCryptos = cryptocurrencyRepository.saveAll(cryptocurrencies);
            System.out.println("总共保存了 " + savedCryptos.size() + " 条加密货币数据到数据库");
            
            // 验证保存结果
            if (savedCryptos.isEmpty()) {
                throw new RuntimeException("保存到数据库失败，返回空列表");
            }
            
            return savedCryptos;
        } catch (Exception e) {
            System.err.println("从Dify API获取加密货币数据失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("获取加密货币数据失败: " + e.getMessage(), e);
        }
    }
}