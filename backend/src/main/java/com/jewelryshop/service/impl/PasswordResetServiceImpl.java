package com.jewelryshop.service.impl;

import com.jewelryshop.dto.ResetTokenValidationResponse;
import com.jewelryshop.entity.PasswordResetToken;
import com.jewelryshop.entity.User;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.repository.PasswordResetTokenRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.PasswordResetService;
import com.jewelryshop.service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationEmailService notificationEmailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Transactional
    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElse(null);

        if (user == null) {
            log.info("Password reset requested for unknown email: {}", email);
            return;
        }

        passwordResetTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString().replace("-", "");
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        resetToken.setUsed(false);
        passwordResetTokenRepository.save(resetToken);

        notificationEmailService.sendForgotPasswordEmail(user, frontendUrl + "/reset-password?token=" + token);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("This reset link has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired. Please request a new one");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        notificationEmailService.sendPasswordResetSuccessEmail(user);
        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public ResetTokenValidationResponse validateResetToken(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (resetToken.isUsed()) {
            return new ResetTokenValidationResponse(false, "This reset link has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ResetTokenValidationResponse(false, "Reset token has expired");
        }

        return new ResetTokenValidationResponse(true, "Reset token is valid");
    }
}