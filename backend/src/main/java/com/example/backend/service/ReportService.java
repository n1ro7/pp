package com.example.backend.service;

import com.example.backend.entity.Report;
import com.example.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    // 获取报告列表（支持分页和筛选）
    public Map<String, Object> getReports(Map<String, Object> params) {
        // 简化实现，实际应该根据参数进行分页和筛选
        List<Report> reports = reportRepository.findAll();
        
        Map<String, Object> result = new HashMap<>();
        result.put("items", reports);
        result.put("total", reports.size());
        result.put("page", params.get("page"));
        result.put("pageSize", params.get("pageSize"));
        
        return result;
    }

    // 获取报告详情
    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("报告不存在"));
    }

    // 添加新报告
    public Report addReport(Report report) {
        report.setStatus("pending");
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    // 更新报告
    public Report updateReport(Report report) {
        Report existingReport = reportRepository.findById(report.getId())
                .orElseThrow(() -> new RuntimeException("报告不存在"));
        
        existingReport.setTitle(report.getTitle());
        existingReport.setContent(report.getContent());
        existingReport.setCryptoType(report.getCryptoType());
        if (report.getConfidenceIndex() != null) {
            existingReport.setConfidenceIndex(report.getConfidenceIndex());
        }
        if (report.getExpectedChange() != null) {
            existingReport.setExpectedChange(report.getExpectedChange());
        }
        existingReport.setUpdatedAt(LocalDateTime.now());
        
        return reportRepository.save(existingReport);
    }

    // 删除报告
    public void deleteReport(Long reportId) {
        reportRepository.deleteById(reportId);
    }

    // 审核报告
    public Report reviewReport(Long reportId, String status, String reviewerNote, Long reviewerId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("报告不存在"));
        
        report.setStatus(status);
        report.setReviewComment(reviewerNote);
        report.setReviewedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        
        if ("approved".equals(status)) {
            report.setPublishAt(LocalDateTime.now());
            // 审核通过时，调用更新持仓接口
            // 这里可以添加调用AssetService或其他相关服务的逻辑
            System.out.println("审核通过，准备更新持仓: " + report.getCryptoType());
            // 示例：assetService.updateAssetHoldings(report.getCryptoType(), report.getCoreSuggestion());
        }
        
        return reportRepository.save(report);
    }

    // 获取待处理报告数量
    public long getPendingReportCount() {
        return reportRepository.countByStatus("pending");
    }

    // 获取报告统计数据
    public Map<String, Object> getReportStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 简化实现，实际应该从数据库查询统计数据
        stats.put("totalReports", reportRepository.count());
        stats.put("pendingReports", reportRepository.countByStatus("pending"));
        stats.put("approvedReports", reportRepository.countByStatus("approved"));
        stats.put("rejectedReports", reportRepository.countByStatus("rejected"));
        
        return stats;
    }
}