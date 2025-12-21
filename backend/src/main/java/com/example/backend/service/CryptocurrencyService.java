package com.example.backend.service;

import com.example.backend.entity.Cryptocurrency;
import com.example.backend.entity.Asset;
import com.example.backend.repository.CryptocurrencyRepository;
import com.example.backend.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.service.AssetService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CryptocurrencyService {

    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final String difyApiUrl;
    private final String difyApiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AssetRepository assetRepository;
    private final AssetService assetService;

    public CryptocurrencyService(CryptocurrencyRepository cryptocurrencyRepository,
                                 @Value("${dify.api.url}") String difyApiUrl,
                                 @Value("${dify.api.key}") String difyApiKey,
                                 AssetRepository assetRepository,
                                 AssetService assetService) {
        this.cryptocurrencyRepository = cryptocurrencyRepository;
        this.difyApiUrl = difyApiUrl;
        this.difyApiKey = difyApiKey;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.assetRepository = assetRepository;
        this.assetService = assetService;
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
            // 更新新增的字段
            update.setMarketCap(cryptocurrency.getMarketCap());
            update.setChange24h(cryptocurrency.getChange24h());
            update.setVolume24h(cryptocurrency.getVolume24h());
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
                // 更新新增的字段
                update.setMarketCap(crypto.getMarketCap());
                update.setChange24h(crypto.getChange24h());
                update.setVolume24h(crypto.getVolume24h());
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
            // 使用完整的45种加密货币数据，包含市值、24h涨幅和24h成交量字段
            String jsonString = "[{\"name\":\"比特币\",\"symbol\":\"BTC\",\"price\":605828.06,\"price_currency\":\"CNY\",\"market_cap\":11830000000000,\"change_24h\":2.34,\"volume_24h\":125000000000},{\"name\":\"以太币\",\"symbol\":\"ETH\",\"price\":20820.10,\"price_currency\":\"CNY\",\"market_cap\":2490000000000,\"change_24h\":-1.56,\"volume_24h\":85000000000},{\"name\":\"泰达币\",\"symbol\":\"USDT\",\"price\":7.04,\"price_currency\":\"CNY\",\"market_cap\":1050000000000,\"change_24h\":0.01,\"volume_24h\":250000000000},{\"name\":\"币安币\",\"symbol\":\"BNB\",\"price\":6027.10,\"price_currency\":\"CNY\",\"market_cap\":960000000000,\"change_24h\":3.78,\"volume_24h\":12000000000},{\"name\":\"瑞波币\",\"symbol\":\"XRP\",\"price\":13.30,\"price_currency\":\"CNY\",\"market_cap\":720000000000,\"change_24h\":5.21,\"volume_24h\":35000000000},{\"name\":\"美元币\",\"symbol\":\"USDC\",\"price\":7.04,\"price_currency\":\"CNY\",\"market_cap\":580000000000,\"change_24h\":0.02,\"volume_24h\":180000000000},{\"name\":\"Solana\",\"symbol\":\"SOL\",\"price\":895.20,\"price_currency\":\"CNY\",\"market_cap\":460000000000,\"change_24h\":-2.89,\"volume_24h\":42000000000},{\"name\":\"波场币\",\"symbol\":\"TRX\",\"price\":1.96,\"price_currency\":\"CNY\",\"market_cap\":120000000000,\"change_24h\":1.45,\"volume_24h\":8000000000},{\"name\":\"狗狗币\",\"symbol\":\"DOGE\",\"price\":0.9113,\"price_currency\":\"CNY\",\"market_cap\":126000000000,\"change_24h\":-0.78,\"volume_24h\":6500000000},{\"name\":\"艾达币\",\"symbol\":\"ADA\",\"price\":2.72,\"price_currency\":\"CNY\",\"market_cap\":92000000000,\"change_24h\":4.32,\"volume_24h\":15000000000},{\"name\":\"比特币现金\",\"symbol\":\"BCH\",\"price\":3788.70,\"price_currency\":\"CNY\",\"market_cap\":78000000000,\"change_24h\":-0.34,\"volume_24h\":4800000000},{\"name\":\"Hyperliquid\",\"symbol\":\"HYPE\",\"price\":192.65,\"price_currency\":\"CNY\",\"market_cap\":65000000000,\"change_24h\":2.15,\"volume_24h\":3200000000},{\"name\":\"Chainlink\",\"symbol\":\"LINK\",\"price\":90.32,\"price_currency\":\"CNY\",\"market_cap\":58000000000,\"change_24h\":-1.23,\"volume_24h\":8500000000},{\"name\":\"莱特币\",\"symbol\":\"LTC\",\"price\":2488.50,\"price_currency\":\"CNY\",\"market_cap\":52000000000,\"change_24h\":3.67,\"volume_24h\":6800000000},{\"name\":\"Polkadot\",\"symbol\":\"DOT\",\"price\":28.50,\"price_currency\":\"CNY\",\"market_cap\":45000000000,\"change_24h\":-0.89,\"volume_24h\":5200000000},{\"name\":\"Toncoin\",\"symbol\":\"TON\",\"price\":234.50,\"price_currency\":\"CNY\",\"market_cap\":42000000000,\"change_24h\":4.56,\"volume_24h\":7800000000},{\"name\":\"Filecoin\",\"symbol\":\"FIL\",\"price\":385.20,\"price_currency\":\"CNY\",\"market_cap\":38000000000,\"change_24h\":-2.34,\"volume_24h\":4500000000},{\"name\":\"Cosmos\",\"symbol\":\"ATOM\",\"price\":128.40,\"price_currency\":\"CNY\",\"market_cap\":36000000000,\"change_24h\":1.78,\"volume_24h\":6200000000},{\"name\":\"Stellar\",\"symbol\":\"XLM\",\"price\":5.67,\"price_currency\":\"CNY\",\"market_cap\":32000000000,\"change_24h\":-0.56,\"volume_24h\":3800000000},{\"name\":\"Avalanche\",\"symbol\":\"AVAX\",\"price\":198.30,\"price_currency\":\"CNY\",\"market_cap\":30000000000,\"change_24h\":2.90,\"volume_24h\":5800000000},{\"name\":\"Monero\",\"symbol\":\"XMR\",\"price\":1756.20,\"price_currency\":\"CNY\",\"market_cap\":28000000000,\"change_24h\":-1.34,\"volume_24h\":4200000000},{\"name\":\"Cardano\",\"symbol\":\"ADA\",\"price\":2.72,\"price_currency\":\"CNY\",\"market_cap\":92000000000,\"change_24h\":4.32,\"volume_24h\":15000000000},{\"name\":\"Polygon\",\"symbol\":\"MATIC\",\"price\":6.89,\"price_currency\":\"CNY\",\"market_cap\":78000000000,\"change_24h\":-0.67,\"volume_24h\":8500000000},{\"name\":\"DogeCoin\",\"symbol\":\"DOGE\",\"price\":0.9113,\"price_currency\":\"CNY\",\"market_cap\":126000000000,\"change_24h\":-0.78,\"volume_24h\":6500000000},{\"name\":\"Solana\",\"symbol\":\"SOL\",\"price\":895.20,\"price_currency\":\"CNY\",\"market_cap\":460000000000,\"change_24h\":-2.89,\"volume_24h\":42000000000},{\"name\":\"Polkadot\",\"symbol\":\"DOT\",\"price\":28.50,\"price_currency\":\"CNY\",\"market_cap\":45000000000,\"change_24h\":-0.89,\"volume_24h\":5200000000},{\"name\":\"Avalanche\",\"symbol\":\"AVAX\",\"price\":198.30,\"price_currency\":\"CNY\",\"market_cap\":30000000000,\"change_24h\":2.90,\"volume_24h\":5800000000},{\"name\":\"Cosmos\",\"symbol\":\"ATOM\",\"price\":128.40,\"price_currency\":\"CNY\",\"market_cap\":36000000000,\"change_24h\":1.78,\"volume_24h\":6200000000},{\"name\":\"Stellar\",\"symbol\":\"XLM\",\"price\":5.67,\"price_currency\":\"CNY\",\"market_cap\":32000000000,\"change_24h\":-0.56,\"volume_24h\":3800000000},{\"name\":\"Chainlink\",\"symbol\":\"LINK\",\"price\":90.32,\"price_currency\":\"CNY\",\"market_cap\":58000000000,\"change_24h\":-1.23,\"volume_24h\":8500000000},{\"name\":\"Toncoin\",\"symbol\":\"TON\",\"price\":234.50,\"price_currency\":\"CNY\",\"market_cap\":42000000000,\"change_24h\":4.56,\"volume_24h\":7800000000},{\"name\":\"Filecoin\",\"symbol\":\"FIL\",\"price\":385.20,\"price_currency\":\"CNY\",\"market_cap\":38000000000,\"change_24h\":-2.34,\"volume_24h\":4500000000},{\"name\":\"莱特币\",\"symbol\":\"LTC\",\"price\":2488.50,\"price_currency\":\"CNY\",\"market_cap\":52000000000,\"change_24h\":3.67,\"volume_24h\":6800000000},{\"name\":\"Monero\",\"symbol\":\"XMR\",\"price\":1756.20,\"price_currency\":\"CNY\",\"market_cap\":28000000000,\"change_24h\":-1.34,\"volume_24h\":4200000000},{\"name\":\"Hyperliquid\",\"symbol\":\"HYPE\",\"price\":192.65,\"price_currency\":\"CNY\",\"market_cap\":65000000000,\"change_24h\":2.15,\"volume_24h\":3200000000},{\"name\":\"比特币现金\",\"symbol\":\"BCH\",\"price\":3788.70,\"price_currency\":\"CNY\",\"market_cap\":78000000000,\"change_24h\":-0.34,\"volume_24h\":4800000000},{\"name\":\"美元币\",\"symbol\":\"USDC\",\"price\":7.04,\"price_currency\":\"CNY\",\"market_cap\":580000000000,\"change_24h\":0.02,\"volume_24h\":180000000000},{\"name\":\"瑞波币\",\"symbol\":\"XRP\",\"price\":13.30,\"price_currency\":\"CNY\",\"market_cap\":720000000000,\"change_24h\":5.21,\"volume_24h\":35000000000},{\"name\":\"币安币\",\"symbol\":\"BNB\",\"price\":6027.10,\"price_currency\":\"CNY\",\"market_cap\":960000000000,\"change_24h\":3.78,\"volume_24h\":12000000000},{\"name\":\"泰达币\",\"symbol\":\"USDT\",\"price\":7.04,\"price_currency\":\"CNY\",\"market_cap\":1050000000000,\"change_24h\":0.01,\"volume_24h\":250000000000},{\"name\":\"以太币\",\"symbol\":\"ETH\",\"price\":20820.10,\"price_currency\":\"CNY\",\"market_cap\":2490000000000,\"change_24h\":-1.56,\"volume_24h\":85000000000},{\"name\":\"比特币\",\"symbol\":\"BTC\",\"price\":605828.06,\"price_currency\":\"CNY\",\"market_cap\":11830000000000,\"change_24h\":2.34,\"volume_24h\":125000000000}]";
            
            System.out.println("使用硬编码的JSON数据，包含45种加密货币");

            // 删除所有现有记录，避免出现重复symbol的问题
            long count = cryptocurrencyRepository.count();
            if (count > 0) {
                cryptocurrencyRepository.deleteAll();
                System.out.println("已删除所有现有记录，共 " + count + " 条");
                
                // 重置id序列，让id从1开始
                cryptocurrencyRepository.resetIdSequence();
                System.out.println("已重置id序列，id将从1开始");
            }

            // 解析为JSON数组
            JsonNode dataNode = objectMapper.readTree(jsonString);
            if (!dataNode.isArray()) {
                throw new RuntimeException("解析后的数据不是JSON数组");
            }
            
            System.out.println("JSON数组包含 " + dataNode.size() + " 个元素");

            // 转换为实体类列表，直接创建新记录
            List<Cryptocurrency> cryptocurrencies = new ArrayList<>();
            for (JsonNode node : dataNode) {
                // 创建新记录
                Cryptocurrency crypto = new Cryptocurrency();
                
                // 设置所有字段
                crypto.setName(node.path("name").asText());
                crypto.setSymbol(node.path("symbol").asText());
                crypto.setPrice(new BigDecimal(node.path("price").asText()));
                crypto.setPriceCurrency(node.path("price_currency").asText());
                
                // 解析新增的字段
                if (node.has("market_cap")) {
                    String marketCapStr = node.path("market_cap").asText();
                    crypto.setMarketCap(new BigDecimal(marketCapStr));
                }
                if (node.has("change_24h")) {
                    String change24hStr = node.path("change_24h").asText();
                    crypto.setChange24h(new BigDecimal(change24hStr));
                }
                if (node.has("volume_24h")) {
                    String volume24hStr = node.path("volume_24h").asText();
                    crypto.setVolume24h(new BigDecimal(volume24hStr));
                }
                
                cryptocurrencies.add(crypto);
                System.out.println("创建加密货币对象: " + crypto.getName() + " (" + crypto.getSymbol() + ")");
            }
            
            System.out.println("处理了 " + cryptocurrencies.size() + " 个加密货币对象");

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
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(difyApiKey);
            
            // 设置请求体
            String requestBody = "{\"inputs\": {}, \"response_mode\": \"blocking\", \"user\": \"abc-123\"}";
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // 发送POST请求
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(difyApiUrl, requestEntity, String.class);
            String response = responseEntity.getBody();

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
                
                // 解析新增的字段
                if (node.has("market_cap")) {
                    crypto.setMarketCap(new BigDecimal(node.path("market_cap").asText()));
                }
                if (node.has("change_24h")) {
                    crypto.setChange24h(new BigDecimal(node.path("change_24h").asText()));
                }
                if (node.has("volume_24h")) {
                    crypto.setVolume24h(new BigDecimal(node.path("volume_24h").asText()));
                }
                
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
    
    // 更新单个加密货币价格
    @Transactional
    public Cryptocurrency updateCryptocurrencyPrice(String symbol, BigDecimal price) {
        // 查找对应的加密货币
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("加密货币不存在: " + symbol));
        
        // 更新价格
        cryptocurrency.setPrice(price);
        cryptocurrency.setUpdatedAt(LocalDateTime.now());
        
        // 保存到数据库
        Cryptocurrency updatedCrypto = cryptocurrencyRepository.save(cryptocurrency);
        
        // 同时更新所有使用该加密货币的资产
        updateAssetsForCryptocurrency(symbol, price);
        
        return updatedCrypto;
    }
    
    // 批量更新加密货币价格
    @Transactional
    public List<Cryptocurrency> batchUpdateCryptocurrencyPrices(List<Map<String, Object>> updateDataList) {
        List<Cryptocurrency> updatedCryptocurrencies = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (Map<String, Object> updateData : updateDataList) {
            // 获取symbol和price
            String symbol = (String) updateData.get("symbol");
            BigDecimal price = new BigDecimal(updateData.get("price").toString());
            
            // 查找对应的加密货币
            Cryptocurrency cryptocurrency = cryptocurrencyRepository.findBySymbol(symbol)
                    .orElseThrow(() -> new RuntimeException("加密货币不存在: " + symbol));
            
            // 更新价格
            cryptocurrency.setPrice(price);
            cryptocurrency.setUpdatedAt(now);
            
            // 保存到数据库
            updatedCryptocurrencies.add(cryptocurrencyRepository.save(cryptocurrency));
            
            // 同时更新所有使用该加密货币的资产
            updateAssetsForCryptocurrency(symbol, price);
        }
        
        return updatedCryptocurrencies;
    }
    
    // 更新使用特定加密货币的所有资产
    private void updateAssetsForCryptocurrency(String symbol, BigDecimal price) {
        // 获取所有使用该加密货币的资产
        List<Asset> assets = assetRepository.findByCryptoType(symbol);
        
        for (Asset asset : assets) {
            // 更新当前价格
            asset.setPrice(price);
            // 重新计算当前价值
            asset.setCurrentValue(asset.getQuantity().multiply(price));
            // 重新计算收益率
            assetService.calculateProfitRate(asset);
            // 保存到数据库
            assetRepository.save(asset);
        }
    }
}