package com.jewelryshop.service;

import com.jewelryshop.dto.VerificationResponseDTO;
import com.jewelryshop.entity.User;

public interface EmailVerificationService {
    VerificationResponseDTO sendVerificationEmail(User user);
    VerificationResponseDTO verifyEmail(String email, String otpCode);
    VerificationResponseDTO resendVerificationEmail(String email);
}