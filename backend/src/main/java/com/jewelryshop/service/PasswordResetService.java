package com.jewelryshop.service;

import com.jewelryshop.dto.ResetTokenValidationResponse;

public interface PasswordResetService {
    void sendResetPasswordEmail(String email);
    void resetPassword(String token, String newPassword);
    ResetTokenValidationResponse validateResetToken(String token);
}