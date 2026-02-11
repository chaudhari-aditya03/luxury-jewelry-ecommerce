package com.jewelryshop.service;

import com.jewelryshop.dto.CreatePaymentRequest;
import com.jewelryshop.dto.VerifyPaymentRequest;
import org.json.JSONObject;

public interface PaymentService {
    JSONObject createPaymentOrder(CreatePaymentRequest request) throws Exception;
    boolean verifyPayment(VerifyPaymentRequest request) throws Exception;
    void updatePaymentStatus(Long orderId, String status);
}
