package com.jewelryshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetTokenValidationResponse {
    private boolean valid;
    private String message;
}