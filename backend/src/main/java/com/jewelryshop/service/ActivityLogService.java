package com.jewelryshop.service;

import com.jewelryshop.dto.ActivityLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityLogService {

    /**
     * Log a user activity
     */
    void logActivity(Long userId, String activityType, String description, String entityType, Long entityId, String status, String ipAddress);

    /**
     * Log activity without entity reference
     */
    void logActivity(Long userId, String activityType, String description, String status, String ipAddress);

    /**
     * Get user's activity logs
     */
    Page<ActivityLogResponse> getUserActivityLogs(Long userId, Pageable pageable);

    /**
     * Get all activity logs (admin only)
     */
    Page<ActivityLogResponse> getAllActivityLogs(Pageable pageable);

    /**
     * Get activity logs by type
     */
    Page<ActivityLogResponse> getActivityLogsByType(String activityType, Pageable pageable);

}
