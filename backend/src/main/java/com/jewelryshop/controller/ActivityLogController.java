package com.jewelryshop.controller;

import com.jewelryshop.dto.ActivityLogResponse;
import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.security.CustomUserDetails;
import com.jewelryshop.service.ActivityLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
@Tag(name = "Activity Logs", description = "User activity logs APIs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping("/my")
    @Operation(summary = "Get current user's activity logs")
    public ResponseEntity<ApiResponse<Page<ActivityLogResponse>>> getMyActivityLogs(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityLogResponse> logs = activityLogService.getUserActivityLogs(userDetails.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping
    @Operation(summary = "Get all activity logs (admin only)")
    public ResponseEntity<ApiResponse<Page<ActivityLogResponse>>> getAllActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityLogResponse> logs = activityLogService.getAllActivityLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/type/{activityType}")
    @Operation(summary = "Get activity logs by type (admin only)")
    public ResponseEntity<ApiResponse<Page<ActivityLogResponse>>> getActivityLogsByType(
            @PathVariable String activityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityLogResponse> logs = activityLogService.getActivityLogsByType(activityType, pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

}
