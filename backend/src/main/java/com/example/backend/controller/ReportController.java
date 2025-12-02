package com.example.backend.controller;

import com.example.backend.entity.Report;
import com.example.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // 获取报告列表
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String cryptoType,
            @RequestParam(required = false) String analyst) {
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("page", page);
            params.put("pageSize", pageSize);
            params.put("status", status);
            params.put("cryptoType", cryptoType);
            params.put("analyst", analyst);
            
            Map<String, Object> result = reportService.getReports(params);
            
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

    // 获取报告详情
    @GetMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> getReportDetail(@PathVariable Long reportId) {
        try {
            Report report = reportService.getReportById(reportId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", report);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 404);
            response.put("message", "报告不存在");
            
            return ResponseEntity.ok(response);
        }
    }

    // 添加报告
    @PostMapping
    public ResponseEntity<Map<String, Object>> addReport(@RequestBody Report report) {
        try {
            Report newReport = reportService.addReport(report);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "添加成功");
            response.put("data", newReport);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 更新报告
    @PutMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> updateReport(@PathVariable Long reportId, @RequestBody Report report) {
        try {
            report.setId(reportId);
            Report updatedReport = reportService.updateReport(report);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "更新成功");
            response.put("data", updatedReport);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 删除报告
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> deleteReport(@PathVariable Long reportId) {
        try {
            reportService.deleteReport(reportId);
            
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

    // 审核报告
    @PutMapping("/{reportId}/review")
    public ResponseEntity<Map<String, Object>> reviewReport(@PathVariable Long reportId, @RequestBody Map<String, Object> reviewData) {
        try {
            String status = (String) reviewData.get("status"); // approved, rejected
            String reviewerNote = (String) reviewData.get("reviewerNote");
            Long reviewerId = Long.parseLong(reviewData.get("reviewerId").toString());
            
            Report reviewedReport = reportService.reviewReport(reportId, status, reviewerNote, reviewerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "审核成功");
            response.put("data", reviewedReport);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    // 获取待处理报告数量
    @GetMapping("/pending/count")
    public ResponseEntity<Map<String, Object>> getPendingReportCount() {
        try {
            long count = reportService.getPendingReportCount();
            
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

    // 获取报告统计数据
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReportStats() {
        try {
            Map<String, Object> stats = reportService.getReportStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}