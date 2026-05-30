package com.jewelryshop.service.impl;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.User;
import com.jewelryshop.service.EmailService;
import com.jewelryshop.service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    @Value("${app.order.delivery-working-days:5}")
    private int deliveryWorkingDays;

    private static final DateTimeFormatter EMAIL_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Override
    public void sendWelcomeEmail(User user) {
        sendQuietly(user.getEmail(), "Welcome to " + brandName, "welcome-email", buildBaseModel(user));
    }

    @Override
    public void sendVerificationEmail(User user, String verificationCode) {
        Map<String, Object> model = buildBaseModel(user);
        model.put("verificationCode", verificationCode);
        sendRequired(user.getEmail(), "Verify your email - " + brandName, "verify-email", model);
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
        String recipientEmail = order.getUser() != null ? order.getUser().getEmail() : null;
        String subject = "Order confirmed - " + order.getOrderNumber();

        dispatchAfterCommit("order confirmation", () ->
            sendQuietly(recipientEmail, subject, "order-confirmation", model));
        if (adminEmail != null && !adminEmail.isBlank()) {
            dispatchAfterCommit("admin order confirmation", () ->
                    sendQuietly(adminEmail, "New order received - " + order.getOrderNumber(), "order-confirmation", model));
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
        LocalDateTime placedAt = order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.now();
        LocalDateTime estimatedDelivery = addWorkingDays(placedAt, deliveryWorkingDays);
        List<Map<String, Object>> orderItems = new ArrayList<>();

        order.getOrderItems().forEach(item -> {
            Map<String, Object> itemModel = new HashMap<>();
            itemModel.put("productName", item.getProduct() != null ? item.getProduct().getName() : "Product");
            itemModel.put("quantity", item.getQuantity());
            itemModel.put("price", item.getPrice());
            itemModel.put("subtotal", item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            itemModel.put("variantName", item.getVariant() != null ? item.getVariant().getVariantName() : null);
            orderItems.add(itemModel);
        });

        model.put("brandName", brandName);
        model.put("customerName", order.getUser().getFullName());
        model.put("orderNumber", order.getOrderNumber());
        model.put("orderStatus", order.getOrderStatus().name());
        model.put("paymentStatus", order.getPaymentStatus().name());
        model.put("paymentMethod", order.getPaymentMethod().name());
        model.put("totalAmount", order.getTotalAmount());
        model.put("discountAmount", order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
        model.put("finalAmount", order.getFinalAmount());
        model.put("addressSnapshot", order.getAddressSnapshot());
        model.put("placedOnDate", EMAIL_DATE_FORMATTER.format(placedAt));
        model.put("estimatedDeliveryDate", EMAIL_DATE_FORMATTER.format(estimatedDelivery));
        model.put("deliveryWorkingDays", deliveryWorkingDays);
        model.put("deliveryEstimateText", "within " + deliveryWorkingDays + " working days from the order date");
        model.put("orderItems", orderItems);
        return model;
    }

    private LocalDateTime addWorkingDays(LocalDateTime start, int workingDays) {
        LocalDateTime current = start;
        int daysAdded = 0;

        while (daysAdded < workingDays) {
            current = current.plusDays(1);
            DayOfWeek dayOfWeek = current.getDayOfWeek();
            if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                daysAdded++;
            }
        }

        return current;
    }

    private void sendQuietly(String to, String subject, String templateName, Map<String, Object> model) {
        try {
            emailService.sendHtmlEmail(to, subject, templateName, model);
        } catch (Exception ex) {
            log.error("Failed to send {} email to {}", templateName, to, ex);
        }
    }

    private void sendRequired(String to, String subject, String templateName, Map<String, Object> model) {
        try {
            emailService.sendHtmlEmail(to, subject, templateName, model);
        } catch (Exception ex) {
            log.error("Failed to send required {} email to {}", templateName, to, ex);
            throw new IllegalStateException("Unable to send " + templateName.replace('-', ' ') + " email", ex);
        }
    }

    private void dispatchAfterCommit(String description, Runnable task) {
        Runnable guardedTask = () -> {
            try {
                task.run();
            } catch (Exception ex) {
                log.error("Failed to dispatch {} email after commit", description, ex);
            }
        };

        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    guardedTask.run();
                }
            });
            return;
        }

        guardedTask.run();
    }
}