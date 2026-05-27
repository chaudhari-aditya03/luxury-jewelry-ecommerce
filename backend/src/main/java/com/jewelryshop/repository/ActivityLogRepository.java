package com.jewelryshop.repository;

import com.jewelryshop.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    Page<ActivityLog> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId AND a.activityType = :activityType ORDER BY a.createdAt DESC")
    List<ActivityLog> findByUserIdAndActivityType(@Param("userId") Long userId, @Param("activityType") String activityType);

    @Query("SELECT a FROM ActivityLog a WHERE a.activityType = :activityType ORDER BY a.createdAt DESC")
    Page<ActivityLog> findByActivityType(@Param("activityType") String activityType, Pageable pageable);

    @Query("SELECT a FROM ActivityLog a WHERE a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<ActivityLog> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId AND a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<ActivityLog> findUserActivityByDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
