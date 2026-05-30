package com.jewelryshop.repository;

import com.jewelryshop.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = "SELECT p FROM Payment p " +
            "LEFT JOIN FETCH p.order o " +
            "LEFT JOIN FETCH o.user " +
            "WHERE p.deletedAt IS NULL",
            countQuery = "SELECT COUNT(p) FROM Payment p WHERE p.deletedAt IS NULL")
    Page<Payment> findAllWithOrderDetails(Pageable pageable);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByOrderIdAndStatus(Long orderId, Payment.PaymentStatus status);

    Optional<Payment> findTopByOrderIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long orderId);

    Optional<Payment> findByIdAndDeletedAtIsNull(Long id);
}
