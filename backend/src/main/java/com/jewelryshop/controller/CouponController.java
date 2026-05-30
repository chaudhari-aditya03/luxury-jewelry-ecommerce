package com.jewelryshop.controller;

import com.jewelryshop.dto.ApiResponse;
import com.jewelryshop.dto.ApplyCouponRequest;
import com.jewelryshop.dto.CouponRequest;
import com.jewelryshop.dto.CouponValidationResponse;
import com.jewelryshop.dto.UserCouponResponse;
import com.jewelryshop.entity.Coupon;
import com.jewelryshop.security.CustomUserDetails;
import com.jewelryshop.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Coupon", description = "Coupon management APIs")
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all coupons (Admin)")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/admin/coupons/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get coupon analytics (Admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAnalytics()));
    }

    @PostMapping("/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create coupon (Admin)")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody CouponRequest request) {
        Coupon coupon = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully", coupon));
    }

    @PutMapping("/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update coupon (Admin)")
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        Coupon coupon = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", coupon));
    }

    @PutMapping("/admin/coupons/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate or deactivate coupon (Admin)")
    public ResponseEntity<ApiResponse<Coupon>> toggleCouponStatus(@PathVariable Long id, @RequestParam boolean active) {
        Coupon coupon = couponService.toggleCouponStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Coupon status updated successfully", coupon));
    }

    @PostMapping("/coupons/apply")
    @Operation(summary = "Apply coupon code")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> applyCoupon(
            Authentication authentication,
            @Valid @RequestBody ApplyCouponRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CouponValidationResponse response = couponService.applyCoupon(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied successfully", response));
    }

    @GetMapping("/coupons/my")
    @Operation(summary = "Get my coupons")
    public ResponseEntity<ApiResponse<List<UserCouponResponse>>> getMyCoupons(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(couponService.getMyCoupons(userDetails.getId())));
    }

    @GetMapping("/coupons/available")
    @Operation(summary = "Get available coupons")
    public ResponseEntity<ApiResponse<List<UserCouponResponse>>> getAvailableCoupons(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(couponService.getAvailableCoupons(userDetails.getId())));
    }

    @DeleteMapping("/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete coupon (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }
}
