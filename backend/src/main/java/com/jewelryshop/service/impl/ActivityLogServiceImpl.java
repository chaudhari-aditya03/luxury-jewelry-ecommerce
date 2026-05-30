package com.jewelryshop.service.impl;

import com.jewelryshop.dto.ActivityLogResponse;
import com.jewelryshop.entity.ActivityLog;
import com.jewelryshop.entity.User;
import com.jewelryshop.exception.ResourceNotFoundException;
import com.jewelryshop.repository.ActivityLogRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void logActivity(Long userId, String activityType, String description, String entityType, Long entityId, String status, String ipAddress) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            ActivityLog log = new ActivityLog(user, activityType, description, entityType, entityId, status);
            log.setIpAddress(ipAddress);
            activityLogRepository.save(log);

            log.info("Activity logged: {} for user: {} - {}", activityType, userId, description);
        } catch (Exception e) {
            log.error("Failed to log activity: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void logActivity(Long userId, String activityType, String description, String status, String ipAddress) {
        logActivity(userId, activityType, description, null, null, status, ipAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getUserActivityLogs(Long userId, Pageable pageable) {
        log.info("Fetching activity logs for user: {}", userId);

        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Page<ActivityLog> logs = activityLogRepository.findByUserId(userId, pageable);
        return logs.map(this::mapToActivityLogResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getAllActivityLogs(Pageable pageable) {
        log.info("Fetching all activity logs");
        Page<ActivityLog> logs = activityLogRepository.findAll(pageable);
        return logs.map(this::mapToActivityLogResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByType(String activityType, Pageable pageable) {
        log.info("Fetching activity logs by type: {}", activityType);
        Page<ActivityLog> logs = activityLogRepository.findByActivityType(activityType, pageable);
        return logs.map(this::mapToActivityLogResponse);
    }

    private ActivityLogResponse mapToActivityLogResponse(ActivityLog log) {
        ActivityLogResponse response = new ActivityLogResponse();
        response.setId(log.getId());
        response.setUserId(log.getUser().getId());
        response.setUserEmail(log.getUser().getEmail());
        response.setActivityType(log.getActivityType());
        response.setDescription(log.getDescription());
        response.setEntityType(log.getEntityType());
        response.setEntityId(log.getEntityId());
        response.setStatus(log.getStatus());
        response.setIpAddress(log.getIpAddress());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }

}
