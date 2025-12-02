package com.example.backend.repository;

import com.example.backend.entity.OperationLog;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
    List<OperationLog> findByOperator(User operator);
    List<OperationLog> findByOperationType(String operationType);
    List<OperationLog> findByTargetEntity(String targetEntity);
}