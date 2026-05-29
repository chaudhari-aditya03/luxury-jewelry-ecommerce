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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final NotificationEmailService notificationEmailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Transactional
    public VerificationResponseDTO sendVerificationEmail(User user) {
        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString().replace("-", "");
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        verificationToken.setUsed(false);
        tokenRepository.save(verificationToken);

        user.setVerificationSentAt(LocalDateTime.now());
        userRepository.save(user);

        String link = frontendUrl + "/verify-email?token=" + token;
        notificationEmailService.sendVerificationEmail(user, link);

        return new VerificationResponseDTO(true, "Verification email sent", user.getEmail(), false, true);
    }

    @Override
    @Transactional
    public VerificationResponseDTO verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.isUsed()) {
            throw new BadRequestException("Verification token has already been used");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
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
}