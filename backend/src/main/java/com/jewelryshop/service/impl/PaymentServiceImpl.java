package com.jewelryshop.service.impl;

import com.jewelryshop.dto.CreatePaymentRequest;
import com.jewelryshop.dto.ConfirmUpiPaymentRequest;
import com.jewelryshop.dto.PaymentInitiationResponse;
import com.jewelryshop.dto.PaymentResponse;
import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.Payment;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.exception.ResourceNotFoundException;
import com.jewelryshop.repository.OrderRepository;
import com.jewelryshop.repository.PaymentRepository;
import com.jewelryshop.service.NotificationEmailService;
import com.jewelryshop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationEmailService notificationEmailService;

    @Value("${payment.upi.id:adityachaudhari312005@oksbi}")
    private String upiId;

    @Value("${payment.upi.payee-name:Jewelry Shop}")
    private String upiPayeeName;

    @Override
    @Transactional
    public PaymentInitiationResponse createPaymentOrder(CreatePaymentRequest request) {
        log.info("Initiating payment for order ID: {}", request.getOrderId());

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        Payment payment = paymentRepository.findTopByOrderIdOrderByCreatedAtDesc(order.getId())
                .orElseGet(Payment::new);

        if (payment.getId() == null) {
            payment.setOrder(order);
            payment.setAmount(order.getFinalAmount());
            payment.setStatus(Payment.PaymentStatus.PENDING);
        }

        if (order.getPaymentMethod() == Order.PaymentMethod.COD) {
            payment.setPaymentGateway("Cash on Delivery");
            payment.setTransactionId(payment.getTransactionId() != null ? payment.getTransactionId() : "COD-" + order.getOrderNumber());
            payment.setPaymentReference(null);
            Payment savedPayment = paymentRepository.save(payment);
            return buildCodInitiationResponse(order, savedPayment);
        }

        String transactionId = payment.getTransactionId() != null ? payment.getTransactionId() : "UPI-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        String upiUrl = buildUpiUrl(order.getFinalAmount(), order.getOrderNumber(), transactionId);

        payment.setPaymentGateway("UPI QR");
        payment.setTransactionId(transactionId);
        payment.setPaymentReference(payment.getPaymentReference());
        Payment savedPayment = paymentRepository.save(payment);

        return buildUpiInitiationResponse(order, savedPayment, upiUrl);
    }

    @Override
    @Transactional
    public PaymentResponse confirmUpiPayment(ConfirmUpiPaymentRequest request) {
        log.info("Confirming UPI payment for order: {}", request.getOrderId());

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (order.getPaymentMethod() != Order.PaymentMethod.UPI) {
            throw new BadRequestException("This order is not a UPI order");
        }

        Payment payment = paymentRepository.findTopByOrderIdOrderByCreatedAtDesc(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        boolean wasAlreadyPaid = order.getPaymentStatus() == Order.PaymentStatus.PAID;
        payment.setPaymentReference(request.getPaymentReference().trim());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        order.setPaymentStatus(Order.PaymentStatus.PAID);
        orderRepository.save(order);

        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long orderId, String status) {
        log.info("Updating payment status for order: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Order.PaymentStatus paymentStatus;
        try {
            paymentStatus = Order.PaymentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment status: " + status);
        }

        Payment payment = paymentRepository.findTopByOrderIdOrderByCreatedAtDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        boolean wasAlreadyPaid = order.getPaymentStatus() == Order.PaymentStatus.PAID;
        order.setPaymentStatus(paymentStatus);
        orderRepository.save(order);

        payment.setStatus(mapPaymentStatus(paymentStatus));
        paymentRepository.save(payment);

        log.info("Payment status updated successfully");
        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        log.info("Fetching all payments with pagination");
        Page<Payment> payments = paymentRepository.findAllWithOrderDetails(pageable);
        return payments.map(this::mapToPaymentResponse);
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder().getId());
        response.setOrderNumber(payment.getOrder().getOrderNumber());
        response.setUserId(payment.getOrder().getUser().getId());
        response.setPaymentMethod(payment.getOrder().getPaymentMethod());
        response.setPaymentGateway(payment.getPaymentGateway());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentReference(payment.getPaymentReference());
        response.setAmount(payment.getAmount());
        response.setStatus(Payment.PaymentStatus.valueOf(payment.getStatus().name()));
        response.setOrderPaymentStatus(Order.PaymentStatus.valueOf(payment.getOrder().getPaymentStatus().name()));
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }

    private PaymentInitiationResponse buildCodInitiationResponse(Order order, Payment payment) {
        PaymentInitiationResponse response = new PaymentInitiationResponse();
        response.setOrderId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentGateway(payment.getPaymentGateway());
        response.setAmount(order.getFinalAmount());
        response.setTransactionId(payment.getTransactionId());
        response.setStatus(payment.getStatus());
        response.setInstructions("Cash on Delivery selected. Collect payment when the order is delivered.");
        return response;
    }

    private PaymentInitiationResponse buildUpiInitiationResponse(Order order, Payment payment, String upiUrl) {
        PaymentInitiationResponse response = new PaymentInitiationResponse();
        response.setOrderId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentGateway(payment.getPaymentGateway());
        response.setAmount(order.getFinalAmount());
        response.setTransactionId(payment.getTransactionId());
        response.setStatus(payment.getStatus());
        response.setUpiId(upiId);
        response.setPayeeName(upiPayeeName);
        response.setUpiUrl(upiUrl);
        response.setQrCodeUrl("https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + URLEncoder.encode(upiUrl, StandardCharsets.UTF_8));
        response.setInstructions("Scan the QR or open the UPI app, pay the exact amount, then enter the UPI reference number to confirm payment.");
        return response;
    }

    private String buildUpiUrl(BigDecimal amount, String orderNumber, String transactionId) {
        return "upi://pay?pa=" + encode(upiId)
                + "&pn=" + encode(upiPayeeName)
                + "&am=" + encode(amount.toPlainString())
                + "&cu=INR"
                + "&tn=" + encode("Order " + orderNumber)
                + "&tr=" + encode(transactionId);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private Payment.PaymentStatus mapPaymentStatus(Order.PaymentStatus paymentStatus) {
        return switch (paymentStatus) {
            case PAID -> Payment.PaymentStatus.SUCCESS;
            case FAILED, REFUNDED -> Payment.PaymentStatus.FAILED;
            case PENDING -> Payment.PaymentStatus.PENDING;
        };
    }
}
