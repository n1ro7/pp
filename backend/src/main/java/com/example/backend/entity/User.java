package com.example.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @JsonIgnore // 避免在JSON响应中包含密码
    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String role; // admin, user, analyst

    @Column(nullable = false, length = 20)
    private String status = "active"; // active, locked, deleted

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // 关联关系
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Asset> assets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserMessage> userMessages;

    @OneToMany(mappedBy = "analyst", cascade = CascadeType.ALL)
    private List<Report> analystReports;

    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL)
    private List<Report> reviewedReports;

    @OneToMany(mappedBy = "operator", cascade = CascadeType.ALL)
    private List<OperationLog> operationLogs;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}