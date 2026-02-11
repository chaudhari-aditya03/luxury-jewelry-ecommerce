package com.jewelryshop.service;

import com.jewelryshop.dto.CouponRequest;
import com.jewelryshop.entity.Coupon;

import java.math.BigDecimal;

public interface CouponService {
    Coupon createCoupon(CouponRequest request);
    Coupon validateCoupon(String code, BigDecimal orderAmount);
    BigDecimal applyCoupon(String code, BigDecimal orderAmount);
}
