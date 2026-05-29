package com.jewelryshop.service;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.User;

public interface NotificationEmailService {
    void sendWelcomeEmail(User user);
    void sendVerificationEmail(User user, String verificationLink);
    void sendForgotPasswordEmail(User user, String resetLink);
    void sendPasswordResetSuccessEmail(User user);
    void sendOrderPlacedEmails(Order order);
    void sendOrderStatusEmail(Order order);
    void sendCouponOfferEmail(String email, String couponTitle, String couponCode, String offerText);
    void sendContactAutoReply(String email, String customerName);
}