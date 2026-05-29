package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.dto.ResendVerificationRequest;
import com.jewelryshop.dto.VerificationResponseDTO;
import com.jewelryshop.service.EmailVerificationService;
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

    private final EmailVerificationService emailVerificationService;

    @GetMapping("/verify-email")
    @Operation(summary = "Verify an email using token")
    public ResponseEntity<ApiResponse<VerificationResponseDTO>> verifyEmail(@RequestParam String token) {
        VerificationResponseDTO response = emailVerificationService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", response));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email")
    public ResponseEntity<ApiResponse<VerificationResponseDTO>> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {
        VerificationResponseDTO response = emailVerificationService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Verification email processed", response));
    }
}