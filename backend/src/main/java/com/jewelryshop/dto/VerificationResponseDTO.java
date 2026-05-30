package com.jewelryshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponseDTO {
    private boolean success;
    private String message;
    private String email;
    private boolean emailVerified;
    private boolean verificationEmailSent;
}