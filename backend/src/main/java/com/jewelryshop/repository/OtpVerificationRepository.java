package com.jewelryshop.repository;

import com.jewelryshop.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);

    Optional<OtpVerification> findByEmailAndOtpAndVerifiedFalse(String email, String otp);

    @Modifying
    void deleteByEmail(String email);

    @Modifying
    void deleteByExpiresAtBefore(LocalDateTime expiresAt);
}