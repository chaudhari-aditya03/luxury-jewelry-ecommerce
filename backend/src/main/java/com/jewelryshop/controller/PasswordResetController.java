package com.jewelryshop.controller;

import com.jewelryshop.dto.*;
import com.jewelryshop.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Password Reset", description = "Forgot and reset password APIs")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    @Operation(summary = "Send a password reset email")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("If the email exists, a password reset link has been sent", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Passwords do not match"));
        }

        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null));
    }

    @PostMapping("/validate-reset-token")
    @Operation(summary = "Validate a reset token")
    public ResponseEntity<ApiResponse<ResetTokenValidationResponse>> validateResetToken(@RequestBody java.util.Map<String, String> body) {
        String token = body.get("token");
        ResetTokenValidationResponse response = passwordResetService.validateResetToken(token);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}