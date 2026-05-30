package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.dto.AuthResponse;
import com.jewelryshop.dto.ResendOtpRequest;
import com.jewelryshop.dto.VerificationResponseDTO;
import com.jewelryshop.dto.VerifyOtpRequest;
import com.jewelryshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Email Verification", description = "Email verification APIs")
public class EmailVerificationController {

    private final AuthService authService;

    @PostMapping({"/verify-otp", "/verify-email"})
    @Operation(summary = "Verify the registration OTP and create the user account")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmail(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", response));
    }

    @PostMapping({"/resend-otp", "/resend-verification"})
    @Operation(summary = "Resend verification OTP")
    public ResponseEntity<ApiResponse<VerificationResponseDTO>> resendVerification(
            @Valid @RequestBody ResendOtpRequest request) {
        VerificationResponseDTO response = authService.resendOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Verification email processed", response));
    }
}