package com.jewelryshop.service;

import com.jewelryshop.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String email);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
