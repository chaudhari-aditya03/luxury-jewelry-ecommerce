package com.jewelryshop.controller;

import com.jewelryshop.dto.*;
import com.jewelryshop.security.CustomUserDetails;
import com.jewelryshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping({"/register", "/send-otp"})
    @Operation(summary = "Start registration by sending an OTP to the user's email")
    public ResponseEntity<ApiResponse<VerificationResponseDTO>> register(@Valid @RequestBody RegisterRequest request) {
        VerificationResponseDTO response = authService.sendOtp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Verification code sent successfully. Please check your email.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Login request received for email: {}", request.getEmail());
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UserResponse userResponse = authService.getCurrentUser(userDetails.getEmail());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }
}
