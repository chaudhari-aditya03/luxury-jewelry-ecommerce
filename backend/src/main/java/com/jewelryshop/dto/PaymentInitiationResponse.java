package com.jewelryshop.dto;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitiationResponse {
    private Long orderId;
    private String orderNumber;
    private Order.PaymentMethod paymentMethod;
    private String paymentGateway;
    private BigDecimal amount;
    private String transactionId;
    private Payment.PaymentStatus status;
    private String upiId;
    private String payeeName;
    private String upiUrl;
    private String qrCodeUrl;
    private String instructions;
}