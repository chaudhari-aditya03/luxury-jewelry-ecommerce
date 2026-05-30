package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class OAuthController {

    @GetMapping("/google")
    @Operation(summary = "Start Google OAuth login")
    public ResponseEntity<Void> googleLogin() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("/oauth2/authorization/google"))
                .build();
    }

    @GetMapping("/oauth-error")
    @Operation(summary = "OAuth error debug endpoint")
    public ResponseEntity<ApiResponse<String>> oauthError(@RequestParam(required = false) String message) {
        String resolved = (message == null || message.isBlank()) ? "Unknown OAuth error" : message;
        log.error("OAuth error endpoint hit. message={}", resolved);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("OAuth error: " + resolved));
    }
}