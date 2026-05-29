package com.jewelryshop.service.impl;

import com.jewelryshop.dto.DashboardSummaryResponse;
import com.jewelryshop.dto.MonthlySalesResponse;
import com.jewelryshop.entity.Product;
import com.jewelryshop.repository.OrderRepository;
import com.jewelryshop.repository.ProductRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        log.info("Generating dashboard summary");

        DashboardSummaryResponse response = new DashboardSummaryResponse();

        response.setTotalUsers(userRepository.countActiveUsers());
        response.setTotalOrders(orderRepository.count());
        response.setActiveOrders(orderRepository.countActiveOrders());
        
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        response.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        response.setTotalProducts(productRepository.count());
        
        // Count products with low stock (less than 10)
        long lowStockProducts = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() < 10 && p.getIsActive())
                .count();
        response.setLowStockProducts(lowStockProducts);

        List<Product> saleProducts = productRepository.findAll().stream()
            .filter(product -> product.getDiscountPercentage() != null && product.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0)
            .toList();
        response.setProductsOnSale((long) saleProducts.size());

        BigDecimal discountSum = BigDecimal.ZERO;
        BigDecimal revenueSaved = BigDecimal.ZERO;
        for (Product product : saleProducts) {
            BigDecimal base = product.getOriginalPrice() != null ? product.getOriginalPrice() : product.getPrice();
            BigDecimal discountPrice = product.getDiscountPrice();
            if (discountPrice == null && base != null && product.getDiscountPercentage() != null) {
            discountPrice = base.subtract(base.multiply(product.getDiscountPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            }
            if (base != null && discountPrice != null) {
            discountSum = discountSum.add(product.getDiscountPercentage());
            revenueSaved = revenueSaved.add(base.subtract(discountPrice));
            }
        }

        response.setAverageDiscount(saleProducts.isEmpty()
            ? BigDecimal.ZERO
            : discountSum.divide(BigDecimal.valueOf(saleProducts.size()), 2, RoundingMode.HALF_UP));
        response.setRevenueSaved(revenueSaved.setScale(2, RoundingMode.HALF_UP));

        return response;
    }

    @Override
    public List<MonthlySalesResponse> getMonthlySales(int year) {
        log.info("Generating monthly sales report for year: {}", year);

        List<MonthlySalesResponse> monthlySales = new ArrayList<>();

        for (Month month : Month.values()) {
            LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime endDate = startDate.plusMonths(1);

            BigDecimal revenue = orderRepository.getRevenueByDateRange(startDate, endDate);

            MonthlySalesResponse monthData = new MonthlySalesResponse();
            monthData.setMonth(month.name());
            monthData.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);
            monthData.setTotalOrders(0L); // You can add a query to count orders by date range

            monthlySales.add(monthData);
        }

        return monthlySales;
    }
}
