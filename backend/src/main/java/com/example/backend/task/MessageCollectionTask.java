package com.example.backend.task;

import com.example.backend.entity.Message;
import com.example.backend.service.MessageService;
import com.example.backend.service.MessageCollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MessageCollectionTask {

    @Autowired
    private MessageCollectionService messageCollectionService;

    // 每天早上8点触发消息采集
    @Scheduled(cron = "0 0 8 * * ?")
    public void collectMessagesDaily() {
        System.out.println("开始每日消息采集...");
        messageCollectionService.collectAndSaveMessages();
        System.out.println("每日消息采集完成");
    }
}
