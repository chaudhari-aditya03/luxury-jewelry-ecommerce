package com.jewelryshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserResponse user;
    private String welcomeCouponCode;
    private String welcomeCouponMessage;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public AuthResponse(String token, UserResponse user, String welcomeCouponCode, String welcomeCouponMessage) {
        this.token = token;
        this.user = user;
        this.welcomeCouponCode = welcomeCouponCode;
        this.welcomeCouponMessage = welcomeCouponMessage;
    }
}
