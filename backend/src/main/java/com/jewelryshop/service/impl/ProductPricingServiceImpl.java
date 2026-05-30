package com.jewelryshop.service.impl;

import com.jewelryshop.entity.Product;
import com.jewelryshop.service.ProductPricingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class ProductPricingServiceImpl implements ProductPricingService {

    @Override
    public BigDecimal calculateDiscountPrice(BigDecimal originalPrice, BigDecimal discountPercentage) {
        if (originalPrice == null) {
            return BigDecimal.ZERO;
        }
        if (discountPercentage == null || discountPercentage.compareTo(BigDecimal.ZERO) <= 0) {
            return originalPrice.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal discountAmount = originalPrice
                .multiply(discountPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return originalPrice.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal calculateSavings(BigDecimal originalPrice, BigDecimal discountPrice) {
        if (originalPrice == null || discountPrice == null) {
            return BigDecimal.ZERO;
        }
        return originalPrice.subtract(discountPrice).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal calculateDiscountPercentage(BigDecimal originalPrice, BigDecimal discountPrice) {
        if (originalPrice == null || discountPrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal savings = calculateSavings(originalPrice, discountPrice);
        return savings.multiply(BigDecimal.valueOf(100)).divide(originalPrice, 2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal getCurrentPrice(Product product) {
        BigDecimal basePrice = product.getOriginalPrice() != null ? product.getOriginalPrice() : product.getPrice();
        if (basePrice == null) {
            return BigDecimal.ZERO;
        }

        if (!isSaleActive(product)) {
            return basePrice.setScale(2, RoundingMode.HALF_UP);
        }

        if (product.getDiscountPrice() != null) {
            return product.getDiscountPrice().setScale(2, RoundingMode.HALF_UP);
        }

        return calculateDiscountPrice(basePrice, product.getDiscountPercentage());
    }

    @Override
    public boolean isSaleActive(Product product) {
        if (product == null || product.getDiscountPercentage() == null || product.getDiscountPercentage().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();
        if (product.getSaleStartDate() != null && now.isBefore(product.getSaleStartDate())) {
            return false;
        }
        if (product.getSaleEndDate() != null && now.isAfter(product.getSaleEndDate())) {
            return false;
        }
        return true;
    }
}