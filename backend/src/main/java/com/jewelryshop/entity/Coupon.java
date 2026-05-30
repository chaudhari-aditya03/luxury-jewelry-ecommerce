package com.jewelryshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 50, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 10, scale = 2, nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "one_time_per_user")
    private Boolean oneTimePerUser = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_type", length = 30)
    private CouponType couponType = CouponType.PUBLIC;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public enum DiscountType {
        PERCENT, FIXED
    }

    public enum CouponType {
        WELCOME, FIRST_ORDER, FESTIVAL, PUBLIC, VIP
    }
}
