package com.jewelryshop.repository;

import com.jewelryshop.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    List<CouponUsage> findByUser_IdOrderByUsedAtDesc(Long userId);

    boolean existsByCoupon_CodeAndUser_Id(String code, Long userId);

    Optional<CouponUsage> findTopByCoupon_CodeAndUser_IdOrderByUsedAtDesc(String code, Long userId);

    long countByCoupon_Id(Long couponId);

    long countByUser_Id(Long userId);

    @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM CouponUsage cu JOIN cu.order o WHERE cu.coupon.id = :couponId")
    BigDecimal getTotalDiscountGivenByCoupon(@Param("couponId") Long couponId);

    @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM CouponUsage cu JOIN cu.order o")
    BigDecimal getTotalDiscountGiven();

    @Query("SELECT COUNT(cu) FROM CouponUsage cu WHERE cu.order IS NOT NULL")
    long countCompletedUsages();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.paymentStatus = 'PAID'")
    long countSuccessfulOrdersForUser(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM CouponUsage cu JOIN cu.order o WHERE cu.user.id = :userId AND o.paymentStatus = 'PAID'")
    BigDecimal sumPaidRevenueForUser(@Param("userId") Long userId);
}