package com.jewelryshop.controller;

import com.jewelryshop.dto.*;
import com.jewelryshop.security.CustomUserDetails;
import com.jewelryshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Order", description = "Order management APIs")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders/place")
    @Operation(summary = "Place a new order")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        OrderResponse order = orderService.placeOrder(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/orders/my")
    @Operation(summary = "Get user orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<OrderResponse> orders = orderService.getUserOrders(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/orders/cancel/{id}")
    @Operation(summary = "Cancel order")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        OrderResponse order = orderService.cancelOrder(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }

    @DeleteMapping("/orders/history/{id}")
    @Operation(summary = "Delete order from user history")
    public ResponseEntity<ApiResponse<Void>> deleteOrderHistory(
            Authentication authentication,
            @PathVariable Long id) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        orderService.deleteOrderHistory(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Order history deleted successfully", null));
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin)")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/admin/orders/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        OrderResponse order = orderService.updateOrderStatus(id, request, userDetails.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }

    @DeleteMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete order history (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteOrderHistoryAdmin(@PathVariable Long id) {
        orderService.deleteOrderHistoryAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Order history deleted successfully", null));
    }
}
