package com.jewelryshop.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDiscountRequest {

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "0.01", message = "Original price must be greater than 0")
    private BigDecimal originalPrice;

    @NotNull(message = "Discount percentage is required")
    @DecimalMin(value = "0.0", message = "Discount percentage cannot be negative")
    @DecimalMax(value = "90.0", message = "Discount percentage cannot exceed 90%")
    private BigDecimal discountPercentage;

    private LocalDateTime saleStartDate;
    private LocalDateTime saleEndDate;
}