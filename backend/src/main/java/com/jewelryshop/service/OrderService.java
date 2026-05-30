package com.jewelryshop.service;

import com.jewelryshop.dto.*;
import com.jewelryshop.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(Long userId, PlaceOrderRequest request);
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String changedBy);
    OrderResponse cancelOrder(Long userId, Long orderId, CancelOrderRequest request);
    void deleteOrderHistory(Long userId, Long orderId);
    void deleteOrderHistoryAdmin(Long orderId);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getUserOrders(Long userId);
    Page<OrderResponse> getAllOrders(Pageable pageable);
}
