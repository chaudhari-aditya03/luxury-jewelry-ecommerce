package com.jewelryshop.service;

import com.jewelryshop.dto.*;

public interface AuthService {
    VerificationResponseDTO sendOtp(RegisterRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    VerificationResponseDTO resendOtp(ResendOtpRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String email);
}
