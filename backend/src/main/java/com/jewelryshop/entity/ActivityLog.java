package com.jewelryshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * ActivityLog entity to track user actions like login, add to cart, purchase, etc.
 */
@Entity
@Table(name = "activity_logs", indexes = {
    @Index(name = "idx_activity_user", columnList = "user_id"),
    @Index(name = "idx_activity_type", columnList = "activity_type"),
    @Index(name = "idx_activity_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String activityType; // LOGIN, LOGOUT, ADD_TO_CART, REMOVE_FROM_CART, PURCHASE, etc.

    @Column(nullable = false, length = 500)
    private String description; // e.g., "Added product 'Gold Ring' to cart"

    @Column(name = "entity_type")
    private String entityType; // PRODUCT, ORDER, WISHLIST, etc.

    @Column(name = "entity_id")
    private Long entityId; // ID of the related entity (product ID, order ID, etc.)

    @Column(length = 50)
    private String status; // SUCCESS, FAILED, PENDING

    @Column(length = 500)
    private String ipAddress;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Constructor for quick activity logging
     */
    public ActivityLog(User user, String activityType, String description, String entityType, Long entityId, String status) {
        this.user = user;
        this.activityType = activityType;
        this.description = description;
        this.entityType = entityType;
        this.entityId = entityId;
        this.status = status;
    }

    public void info(String s, String activityType, Long userId, String description) {
    }
}
