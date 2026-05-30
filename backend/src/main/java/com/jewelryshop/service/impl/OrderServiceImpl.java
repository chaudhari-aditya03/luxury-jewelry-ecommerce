package com.jewelryshop.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jewelryshop.dto.*;
import com.jewelryshop.entity.*;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.exception.ResourceNotFoundException;
import com.jewelryshop.repository.*;
import com.jewelryshop.service.CouponService;
import com.jewelryshop.service.OrderService;
import com.jewelryshop.service.ActivityLogService;
import com.jewelryshop.service.NotificationEmailService;
import com.jewelryshop.service.ProductPricingService;
import com.jewelryshop.service.StatusHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final ObjectMapper objectMapper;
    private final ActivityLogService activityLogService;
    private final ProductPricingService productPricingService;
    private final NotificationEmailService notificationEmailService;
    private final StatusHistoryService statusHistoryService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        log.info("Placing order for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getAddressId()));

        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            
            if (!product.getIsActive() || product.getDeletedAt() != null) {
                throw new BadRequestException("Product " + product.getName() + " is no longer available");
            }

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

                BigDecimal price = productPricingService.getCurrentPrice(product);

            if (item.getVariant() != null) {
                price = price.add(item.getVariant().getAdditionalPrice());
            }

            totalAmount = totalAmount.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            CouponValidationResponse couponValidation = couponService.validateCouponForUser(userId, request.getCouponCode(), totalAmount);
            discountAmount = couponValidation.getDiscountAmount();

            appliedCoupon = couponRepository.getReferenceById(couponValidation.getCouponId());
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount);

        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setCoupon(appliedCoupon);
        order.setAddressSnapshot(serializeAddress(address));
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setOrderStatus(Order.OrderStatus.PLACED);

        Order savedOrder = orderRepository.save(order);

        // Create order items and reduce stock
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());

                BigDecimal price = productPricingService.getCurrentPrice(cartItem.getProduct());

            if (cartItem.getVariant() != null) {
                price = price.add(cartItem.getVariant().getAdditionalPrice());
            }

            orderItem.setPrice(price);
            savedOrder.getOrderItems().add(orderItem);

            // Reduce stock
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        orderRepository.save(savedOrder);

        statusHistoryService.recordOrderStatusChange(
            savedOrder,
            "NONE",
            savedOrder.getOrderStatus().name(),
            user.getEmail(),
            "Order placed"
        );

        if (appliedCoupon != null) {
            couponService.recordCouponUsage(appliedCoupon.getId(), userId, savedOrder.getId());
        }

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        activityLogService.logActivity(userId, "PURCHASE",
                "Placed order " + savedOrder.getOrderNumber() + " with total amount: ₹" + finalAmount,
                "ORDER", savedOrder.getId(), "SUCCESS", null);

        notificationEmailService.sendOrderPlacedEmails(savedOrder);

        log.info("Order placed successfully: {}", savedOrder.getOrderNumber());
        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String changedBy) {
        log.info("Updating order status for order: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String oldStatus = order.getOrderStatus().name();

        order.setOrderStatus(request.getOrderStatus());
        orderRepository.save(order);

        statusHistoryService.recordOrderStatusChange(
                order,
                oldStatus,
                request.getOrderStatus().name(),
                changedBy,
                request.getNotes()
        );

        notificationEmailService.sendOrderStatusEmail(order);

        log.info("Order status updated successfully: {}", orderId);
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId, CancelOrderRequest request) {
        log.info("Cancelling order: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own orders");
        }

        if (order.getOrderStatus() == Order.OrderStatus.SHIPPED ||
            order.getOrderStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel order that is already shipped or delivered");
        }

        if (order.getOrderStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        String oldStatus = order.getOrderStatus().name();

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setOrderStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(request.getReason());
        orderRepository.save(order);

        statusHistoryService.recordOrderStatusChange(
            order,
            oldStatus,
            Order.OrderStatus.CANCELLED.name(),
            order.getUser().getEmail(),
            request.getReason()
        );

        notificationEmailService.sendOrderStatusEmail(order);

        log.info("Order cancelled successfully: {}", orderId);
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public void deleteOrderHistory(Long userId, Long orderId) {
        log.info("Deleting order history for user {} and order {}", userId, orderId);

        Order order = orderRepository.findByIdAndUserIdAndDeletedAtIsNull(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setDeletedAt(LocalDateTime.now());
        orderRepository.save(order);

        activityLogService.logActivity(userId, "ORDER_HISTORY_DELETE",
                "Deleted order history for order " + order.getOrderNumber(),
                "ORDER", order.getId(), "SUCCESS", null);

        log.info("Order history deleted successfully for order {}", orderId);
    }

    @Override
    @Transactional
    public void deleteOrderHistoryAdmin(Long orderId) {
        log.info("Deleting order history from admin for order {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getDeletedAt() != null) {
            throw new BadRequestException("Order history is already deleted");
        }

        order.setDeletedAt(LocalDateTime.now());
        orderRepository.save(order);

        activityLogService.logActivity(order.getUser().getId(), "ORDER_HISTORY_DELETE_ADMIN",
                "Admin deleted order history for order " + order.getOrderNumber(),
                "ORDER", order.getId(), "SUCCESS", null);

        log.info("Admin order history deleted successfully for order {}", orderId);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        log.info("Fetching orders for user: {}", userId);
        List<Order> orders = orderRepository.findByUserIdWithDetailsOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        log.info("Fetching all orders with pagination");
        Page<Order> orders = orderRepository.findAllWithDetails(pageable);
        return orders.map(this::mapToOrderResponse);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setUserId(order.getUser().getId());
        response.setCustomerName(order.getUser().getFullName());
        response.setCustomerEmail(order.getUser().getEmail());
        response.setCouponId(order.getCoupon() != null ? order.getCoupon().getId() : null);
        response.setCouponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null);
        response.setAddressSnapshot(order.getAddressSnapshot());
        response.setTotalAmount(order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setFinalAmount(order.getFinalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setOrderStatus(order.getOrderStatus());
        response.setCancellationReason(order.getCancellationReason());
        response.setItemsCount(order.getOrderItems() != null ? order.getOrderItems().size() : 0);
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());
        response.setOrderItems(items);

        return response;
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());

        if (!item.getProduct().getImages().isEmpty()) {
            response.setProductImage(item.getProduct().getImages().get(0).getImageUrl());
        }

        if (item.getVariant() != null) {
            response.setVariantId(item.getVariant().getId());
            response.setVariantName(item.getVariant().getVariantName());
        }

        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

        return response;
    }

    private String generateOrderNumber() {
        return "ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String serializeAddress(Address address) {
        try {
            return objectMapper.writeValueAsString(address);
        } catch (JsonProcessingException e) {
            log.error("Error serializing address", e);
            return address.toString();
        }
    }
}
