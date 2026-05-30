package com.jewelryshop.service.impl;

import com.jewelryshop.dto.VerificationResponseDTO;
import com.jewelryshop.entity.EmailVerificationToken;
import com.jewelryshop.entity.User;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.repository.EmailVerificationTokenRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.EmailVerificationService;
import com.jewelryshop.service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final NotificationEmailService notificationEmailService;

    @Override
    @Transactional
    public VerificationResponseDTO sendVerificationEmail(User user) {
        tokenRepository.deleteByUserId(user.getId());

        String token = generateUniqueOtpCode();
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        verificationToken.setUsed(false);
        tokenRepository.save(verificationToken);

        user.setVerificationSentAt(LocalDateTime.now());
        userRepository.save(user);

        notificationEmailService.sendVerificationEmail(user, token);

        return new VerificationResponseDTO(true, "Verification code sent", user.getEmail(), false, true);
    }

    @Override
    @Transactional
    public VerificationResponseDTO verifyEmail(String email, String otpCode) {
        EmailVerificationToken verificationToken = tokenRepository
                .findByTokenAndUser_EmailAndUsedFalse(otpCode, email)
                .orElseThrow(() -> new BadRequestException("Invalid verification code"));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        notificationEmailService.sendWelcomeEmail(user);
        return new VerificationResponseDTO(true, "Email verified successfully", user.getEmail(), true, false);
    }

    @Override
    @Transactional
    public VerificationResponseDTO resendVerificationEmail(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new BadRequestException("No account found with this email address"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return new VerificationResponseDTO(true, "Email already verified", user.getEmail(), true, false);
        }

        return sendVerificationEmail(user);
    }

    private String generateUniqueOtpCode() {
        for (int attempts = 0; attempts < 20; attempts++) {
            String code = String.format("%06d", (int) (Math.random() * 1_000_000));
            if (!tokenRepository.existsByToken(code)) {
                return code;
            }
        }

        throw new IllegalStateException("Unable to generate a unique verification code");
    }
}