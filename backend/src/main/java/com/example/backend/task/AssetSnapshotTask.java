package com.example.backend.task;

import com.example.backend.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class AssetSnapshotTask {

    @Autowired
    private AssetService assetService;
    
    // 每天凌晨1点保存一次资产快照
    @Scheduled(cron = "0 0 1 * * ?")
    public void saveDailyAssetSnapshot() {
        System.out.println("开始保存每日资产快照...");
        assetService.saveAllAssetsSnapshot();
        System.out.println("每日资产快照保存完成");
    }
    
    // 每小时保存一次资产快照
    @Scheduled(cron = "0 0 * * * ?")
    public void saveHourlyAssetSnapshot() {
        System.out.println("开始保存每小时资产快照...");
        assetService.saveAllAssetsSnapshot();
        System.out.println("每小时资产快照保存完成");
    }
    
    // 每5分钟保存一次资产快照（用于测试）
    @Scheduled(cron = "0 */5 * * * ?")
    public void saveTestAssetSnapshot() {
        System.out.println("开始保存测试资产快照...");
        assetService.saveAllAssetsSnapshot();
        System.out.println("测试资产快照保存完成");
    }
}