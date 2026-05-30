package com.jewelryshop.service;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.Payment;

public interface StatusHistoryService {
    void recordOrderStatusChange(Order order, String oldStatus, String newStatus, String changedBy, String notes);
    void recordPaymentStatusChange(Payment payment, String oldStatus, String newStatus, String changedBy, String notes);
}