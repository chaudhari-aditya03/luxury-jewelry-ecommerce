package com.jewelryshop.service;

import com.jewelryshop.entity.Product;

import java.math.BigDecimal;

public interface ProductPricingService {
    BigDecimal calculateDiscountPrice(BigDecimal originalPrice, BigDecimal discountPercentage);
    BigDecimal calculateSavings(BigDecimal originalPrice, BigDecimal discountPrice);
    BigDecimal calculateDiscountPercentage(BigDecimal originalPrice, BigDecimal discountPrice);
    BigDecimal getCurrentPrice(Product product);
    boolean isSaleActive(Product product);
}