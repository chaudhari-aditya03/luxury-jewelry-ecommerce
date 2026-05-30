package com.jewelryshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponAnalyticsResponse {
    private long totalCoupons;
    private long activeCoupons;
    private long expiredCoupons;
    private long usageCount;
    private String mostUsedCoupon;
    private long mostUsedCouponCount;
    private BigDecimal totalDiscountGiven;
    private BigDecimal revenueGenerated;
}