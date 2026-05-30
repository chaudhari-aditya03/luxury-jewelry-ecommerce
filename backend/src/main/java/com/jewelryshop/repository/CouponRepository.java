package com.jewelryshop.repository;

import com.jewelryshop.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCode(String code);

    Optional<Coupon> findByCodeIgnoreCase(String code);

    Optional<Coupon> findByCodeIgnoreCaseAndDeletedAtIsNull(String code);

    Optional<Coupon> findByCodeAndIsActiveTrue(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndDeletedAtIsNull(String code);

    List<Coupon> findAllByDeletedAtIsNullOrderByIdDesc();

    long countByDeletedAtIsNull();

    long countByDeletedAtIsNullAndIsActiveTrue();

    long countByDeletedAtIsNullAndExpiryDateBefore(LocalDate date);

    @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM CouponUsage cu JOIN cu.order o WHERE cu.coupon.deletedAt IS NULL")
    BigDecimal sumTotalDiscountGiven();

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM CouponUsage cu JOIN cu.order o WHERE cu.coupon.deletedAt IS NULL")
    BigDecimal sumRevenueGenerated();
}
