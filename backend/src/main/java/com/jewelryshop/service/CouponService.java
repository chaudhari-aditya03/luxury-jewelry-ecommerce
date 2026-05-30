package com.jewelryshop.service;

import com.jewelryshop.dto.ApplyCouponRequest;
import com.jewelryshop.dto.CouponRequest;
import com.jewelryshop.dto.CouponValidationResponse;
import com.jewelryshop.dto.UserCouponResponse;
import com.jewelryshop.entity.Coupon;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface CouponService {
    Coupon createCoupon(CouponRequest request);
    Coupon updateCoupon(Long id, CouponRequest request);
    Coupon validateCoupon(String code, BigDecimal orderAmount);
    CouponValidationResponse validateCouponForUser(Long userId, String code, BigDecimal orderAmount);
    CouponValidationResponse applyCoupon(Long userId, ApplyCouponRequest request);
    void recordCouponUsage(Long couponId, Long userId, Long orderId);
    List<UserCouponResponse> getMyCoupons(Long userId);
    List<UserCouponResponse> getAvailableCoupons(Long userId);
    Map<String, Object> getAnalytics();
    List<Coupon> getAllCoupons();
    Coupon toggleCouponStatus(Long id, boolean active);
    void deleteCoupon(Long id);
}
