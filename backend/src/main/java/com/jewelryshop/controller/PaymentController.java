package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.dto.ConfirmUpiPaymentRequest;
import com.jewelryshop.dto.CreatePaymentRequest;
import com.jewelryshop.dto.PaymentInitiationResponse;
import com.jewelryshop.dto.PaymentResponse;
import com.jewelryshop.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    @Operation(summary = "Initiate payment for UPI QR or COD")
    public ResponseEntity<ApiResponse<PaymentInitiationResponse>> createPaymentOrder(
            @Valid @RequestBody CreatePaymentRequest request) {
        PaymentInitiationResponse paymentOrder = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Payment initiated successfully", paymentOrder));
    }

    @PostMapping("/confirm-upi")
    @Operation(summary = "Confirm a UPI payment with reference number")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmUpiPayment(
            @Valid @RequestBody ConfirmUpiPaymentRequest request) {
        PaymentResponse payment = paymentService.confirmUpiPayment(request);
        return ResponseEntity.ok(ApiResponse.success("UPI payment confirmed successfully", payment));
    }

    @PutMapping("/admin/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update payment status (Admin)")
    public ResponseEntity<ApiResponse<PaymentResponse>> processRefund(
            @RequestParam Long orderId,
            @RequestParam String status) {
        PaymentResponse payment = paymentService.updatePaymentStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated", payment));
    }

    @GetMapping("/admin/payments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all payments (Admin)")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }
}
