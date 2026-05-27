package com.jewelryshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {

    private Long id;
    private Long userId;
    private String userEmail;
    private String activityType;
    private String description;
    private String entityType;
    private Long entityId;
    private String status;
    private String ipAddress;
    private LocalDateTime createdAt;

}
