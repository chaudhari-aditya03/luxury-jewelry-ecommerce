package com.jewelryshop.service.impl;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.User;
import com.jewelryshop.service.EmailService;
import com.jewelryshop.service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailServiceImpl implements NotificationEmailService {

    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.admin.email:${spring.mail.username:}}")
    private String adminEmail;

    @Value("${app.mail.from-name:Jewelry Shop}")
    private String brandName;

    @Override
    public void sendWelcomeEmail(User user) {
        sendQuietly(user.getEmail(), "Welcome to " + brandName, "welcome-email", buildBaseModel(user));
    }

    @Override
    public void sendVerificationEmail(User user, String verificationLink) {
        Map<String, Object> model = buildBaseModel(user);
        model.put("verificationLink", verificationLink);
        sendQuietly(user.getEmail(), "Verify your email - " + brandName, "verify-email", model);
    }

    @Override
    public void sendForgotPasswordEmail(User user, String resetLink) {
        Map<String, Object> model = buildBaseModel(user);
        model.put("resetLink", resetLink);
        sendQuietly(user.getEmail(), "Reset your password - " + brandName, "forgot-password", model);
    }

    @Override
    public void sendPasswordResetSuccessEmail(User user) {
        sendQuietly(user.getEmail(), "Password changed successfully", "password-reset-success", buildBaseModel(user));
    }

    @Override
    public void sendOrderPlacedEmails(Order order) {
        Map<String, Object> model = buildOrderModel(order);
        sendQuietly(order.getUser().getEmail(), "Order confirmed - " + order.getOrderNumber(), "order-confirmation", model);
        if (adminEmail != null && !adminEmail.isBlank()) {
            sendQuietly(adminEmail, "New order received - " + order.getOrderNumber(), "order-confirmation", model);
        }
    }

    @Override
    public void sendOrderStatusEmail(Order order) {
        Map<String, Object> model = buildOrderModel(order);
        String template = switch (order.getOrderStatus()) {
            case SHIPPED -> "order-shipped";
            case DELIVERED -> "order-delivered";
            case CANCELLED -> "order-cancelled";
            default -> "order-confirmation";
        };
        sendQuietly(order.getUser().getEmail(), "Order update - " + order.getOrderNumber(), template, model);
    }

    @Override
    public void sendCouponOfferEmail(String email, String couponTitle, String couponCode, String offerText) {
        Map<String, Object> model = new HashMap<>();
        model.put("brandName", brandName);
        model.put("couponTitle", couponTitle);
        model.put("couponCode", couponCode);
        model.put("offerText", offerText);
        model.put("frontendUrl", frontendUrl);
        sendQuietly(email, couponTitle, "coupon-offer", model);
    }

    @Override
    public void sendContactAutoReply(String email, String customerName) {
        Map<String, Object> model = new HashMap<>();
        model.put("brandName", brandName);
        model.put("customerName", customerName);
        sendQuietly(email, "We received your message", "welcome-email", model);
    }

    private Map<String, Object> buildBaseModel(User user) {
        Map<String, Object> model = new HashMap<>();
        model.put("brandName", brandName);
        model.put("customerName", user.getFullName());
        model.put("frontendUrl", frontendUrl);
        return model;
    }

    private Map<String, Object> buildOrderModel(Order order) {
        Map<String, Object> model = new HashMap<>();
        model.put("brandName", brandName);
        model.put("customerName", order.getUser().getFullName());
        model.put("orderNumber", order.getOrderNumber());
        model.put("orderStatus", order.getOrderStatus().name());
        model.put("totalAmount", order.getTotalAmount());
        model.put("discountAmount", order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
        model.put("finalAmount", order.getFinalAmount());
        model.put("addressSnapshot", order.getAddressSnapshot());
        model.put("order", order);
        return model;
    }

    private void sendQuietly(String to, String subject, String templateName, Map<String, Object> model) {
        try {
            emailService.sendHtmlEmail(to, subject, templateName, model);
        } catch (Exception ex) {
            log.error("Failed to send {} email to {}: {}", templateName, to, ex.getMessage());
        }
    }
}