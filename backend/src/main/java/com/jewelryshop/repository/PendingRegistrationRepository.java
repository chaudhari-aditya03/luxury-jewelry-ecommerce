package com.jewelryshop.repository;

import com.jewelryshop.entity.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {

    Optional<PendingRegistration> findByEmail(String email);

    @Modifying
    void deleteByEmail(String email);

    @Modifying
    void deleteByExpiresAtBefore(LocalDateTime expiresAt);
}