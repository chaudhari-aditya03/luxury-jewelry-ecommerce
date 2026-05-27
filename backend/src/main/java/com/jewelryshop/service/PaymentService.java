package com.jewelryshop.service;

import com.jewelryshop.dto.CreatePaymentRequest;
import com.jewelryshop.dto.ConfirmUpiPaymentRequest;
import com.jewelryshop.dto.PaymentInitiationResponse;
import com.jewelryshop.dto.PaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    PaymentInitiationResponse createPaymentOrder(CreatePaymentRequest request);
    PaymentResponse confirmUpiPayment(ConfirmUpiPaymentRequest request);
    PaymentResponse updatePaymentStatus(Long orderId, String status);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
}
