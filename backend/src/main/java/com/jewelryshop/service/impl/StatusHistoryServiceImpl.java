package com.jewelryshop.service.impl;

import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.OrderStatusHistory;
import com.jewelryshop.entity.Payment;
import com.jewelryshop.entity.PaymentStatusHistory;
import com.jewelryshop.repository.OrderStatusHistoryRepository;
import com.jewelryshop.repository.PaymentStatusHistoryRepository;
import com.jewelryshop.service.StatusHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatusHistoryServiceImpl implements StatusHistoryService {

    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final PaymentStatusHistoryRepository paymentStatusHistoryRepository;

    @Override
    @Transactional
    public void recordOrderStatusChange(Order order, String oldStatus, String newStatus, String changedBy, String notes) {
        OrderStatusHistory history = new OrderStatusHistory(order, oldStatus, newStatus, changedBy, null, notes);
        orderStatusHistoryRepository.save(history);
        log.info("Recorded order status history: order={}, {} -> {}", order.getId(), oldStatus, newStatus);
    }

    @Override
    @Transactional
    public void recordPaymentStatusChange(Payment payment, String oldStatus, String newStatus, String changedBy, String notes) {
        PaymentStatusHistory history = new PaymentStatusHistory(payment, oldStatus, newStatus, changedBy, null, notes);
        paymentStatusHistoryRepository.save(history);
        log.info("Recorded payment status history: payment={}, {} -> {}", payment.getId(), oldStatus, newStatus);
    }
}