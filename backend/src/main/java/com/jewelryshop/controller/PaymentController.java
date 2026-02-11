package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.dto.CreatePaymentRequest;
import com.jewelryshop.dto.VerifyPaymentRequest;
import com.jewelryshop.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    @Operation(summary = "Create payment order")
    public ResponseEntity<ApiResponse<String>> createPaymentOrder(
            @Valid @RequestBody CreatePaymentRequest request) {
        try {
            JSONObject paymentOrder = paymentService.createPaymentOrder(request);
            return ResponseEntity.ok(ApiResponse.success("Payment order created", paymentOrder.toString()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify payment")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        try {
            boolean isValid = paymentService.verifyPayment(request);
            if (isValid) {
                return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", true));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Payment verification error: " + e.getMessage()));
        }
    }

    @PostMapping("/refund")
    @Operation(summary = "Process refund (Admin)")
    public ResponseEntity<ApiResponse<Void>> processRefund(
            @RequestParam Long orderId,
            @RequestParam String status) {
        paymentService.updatePaymentStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated", null));
    }
}
