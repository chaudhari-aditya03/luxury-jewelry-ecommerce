package com.jewelryshop.dto;

import com.jewelryshop.entity.Coupon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCouponResponse {
    private Long couponId;
    private String code;
    private Coupon.DiscountType discountType;
    private Coupon.CouponType couponType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderAmount;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private Boolean active;
    private Boolean used;
    private LocalDateTime usedAt;
    private Boolean eligible;
    private String status;
    private String title;
    private String description;
    private List<String> conditions = new ArrayList<>();
}