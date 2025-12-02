package com.example.backend.repository;

import com.example.backend.entity.Report;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(String status);
    List<Report> findByAnalyst(User analyst);
    List<Report> findByReviewer(User reviewer);
    List<Report> findByCryptoType(String cryptoType);
    long countByStatus(String status);
}