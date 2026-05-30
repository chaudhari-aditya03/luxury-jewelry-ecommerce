package com.jewelryshop.service.impl;

import com.jewelryshop.dto.ApplyCouponRequest;
import com.jewelryshop.dto.CouponRequest;
import com.jewelryshop.dto.CouponValidationResponse;
import com.jewelryshop.dto.UserCouponResponse;
import com.jewelryshop.entity.Coupon;
import com.jewelryshop.entity.CouponUsage;
import com.jewelryshop.entity.Order;
import com.jewelryshop.entity.User;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.exception.ResourceNotFoundException;
import com.jewelryshop.repository.CouponRepository;
import com.jewelryshop.repository.CouponUsageRepository;
import com.jewelryshop.repository.OrderRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponServiceImpl implements CouponService {

    private static final BigDecimal VIP_THRESHOLD = BigDecimal.valueOf(50000);
    private static final int WELCOME_VALIDITY_DAYS = 30;

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Coupon createCoupon(CouponRequest request) {
        String code = normalizeCode(request.getCode());
        if (couponRepository.existsByCodeAndDeletedAtIsNull(code)) {
            throw new BadRequestException("Coupon code already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        coupon.setCouponType(request.getCouponType() != null ? request.getCouponType() : Coupon.CouponType.PUBLIC);
        coupon.setOneTimePerUser(request.getOneTimePerUser() != null ? request.getOneTimePerUser() : false);
        coupon.setDescription(request.getDescription());

        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));

        String code = normalizeCode(request.getCode());
        if (!coupon.getCode().equalsIgnoreCase(code) && couponRepository.existsByCodeAndDeletedAtIsNull(code)) {
            throw new BadRequestException("Coupon code already exists");
        }

        coupon.setCode(code);
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setStartDate(request.getStartDate() != null ? request.getStartDate() : coupon.getStartDate());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setIsActive(request.getIsActive() != null ? request.getIsActive() : coupon.getIsActive());
        coupon.setCouponType(request.getCouponType() != null ? request.getCouponType() : coupon.getCouponType());
        coupon.setOneTimePerUser(request.getOneTimePerUser() != null ? request.getOneTimePerUser() : coupon.getOneTimePerUser());
        coupon.setDescription(request.getDescription());

        return couponRepository.save(coupon);
    }

    @Override
    public Coupon validateCoupon(String code, BigDecimal orderAmount) {
        CouponValidationResponse validation = validateCouponForUser(null, code, orderAmount);
        return couponRepository.findById(validation.getCouponId())
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", validation.getCouponId()));
    }

    @Override
    public CouponValidationResponse validateCouponForUser(Long userId, String code, BigDecimal orderAmount) {
        if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than 0");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndDeletedAtIsNull(normalizeCode(code))
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "code", code));

        CouponValidationResponse response = buildBaseValidationResponse(coupon, orderAmount);
        validateCouponEligibility(userId, coupon, response, orderAmount);

        BigDecimal discountAmount = calculateDiscount(coupon, orderAmount);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(orderAmount.subtract(discountAmount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP));
        response.setStatus("Available");
        response.setMessage("Coupon applied successfully");
        response.setEligible(true);
        return response;
    }

    @Override
    public CouponValidationResponse applyCoupon(Long userId, ApplyCouponRequest request) {
        return validateCouponForUser(userId, request.getCode(), request.getOrderAmount());
    }

    @Override
    @Transactional
    public void recordCouponUsage(Long couponId, Long userId, Long orderId) {
        if (couponId == null || userId == null || orderId == null) {
            return;
        }

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", couponId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOrder(order);
        usage.setUsedAt(LocalDateTime.now());
        couponUsageRepository.save(usage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserCouponResponse> getMyCoupons(Long userId) {
        return couponRepository.findAllByDeletedAtIsNullOrderByIdDesc()
                .stream()
                .map(coupon -> buildUserCouponResponse(coupon, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserCouponResponse> getAvailableCoupons(Long userId) {
        return getMyCoupons(userId).stream()
                .filter(response -> "Available".equalsIgnoreCase(response.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics() {
        List<Coupon> coupons = couponRepository.findAllByDeletedAtIsNullOrderByIdDesc();
        long totalCoupons = coupons.size();
        long activeCoupons = couponRepository.countByDeletedAtIsNullAndIsActiveTrue();
        long expiredCoupons = couponRepository.countByDeletedAtIsNullAndExpiryDateBefore(LocalDate.now());
        long usageCount = couponUsageRepository.countCompletedUsages();
        BigDecimal totalDiscountGiven = couponRepository.sumTotalDiscountGiven();
        BigDecimal revenueGenerated = couponRepository.sumRevenueGenerated();

        Coupon mostUsedCoupon = coupons.stream()
                .max(Comparator.comparingLong(coupon -> couponUsageRepository.countByCoupon_Id(coupon.getId())))
                .orElse(null);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalCoupons", totalCoupons);
        analytics.put("activeCoupons", activeCoupons);
        analytics.put("expiredCoupons", expiredCoupons);
        analytics.put("usageCount", usageCount);
        analytics.put("mostUsedCoupon", mostUsedCoupon != null ? mostUsedCoupon.getCode() : null);
        analytics.put("mostUsedCouponCount", mostUsedCoupon != null ? couponUsageRepository.countByCoupon_Id(mostUsedCoupon.getId()) : 0L);
        analytics.put("totalDiscountGiven", totalDiscountGiven);
        analytics.put("revenueGenerated", revenueGenerated);
        return analytics;
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAllByDeletedAtIsNullOrderByIdDesc();
    }

    @Override
    @Transactional
    public Coupon toggleCouponStatus(Long id, boolean active) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        coupon.setIsActive(active);
        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        coupon.setDeletedAt(LocalDateTime.now());
        coupon.setIsActive(false);
        couponRepository.save(coupon);
    }

    private CouponValidationResponse buildBaseValidationResponse(Coupon coupon, BigDecimal orderAmount) {
        CouponValidationResponse response = new CouponValidationResponse();
        response.setCouponId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDiscountType(coupon.getDiscountType());
        response.setCouponType(coupon.getCouponType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        response.setMinOrderAmount(coupon.getMinOrderAmount());
        response.setStartDate(coupon.getStartDate());
        response.setExpiryDate(coupon.getExpiryDate());
        response.setOneTimePerUser(coupon.getOneTimePerUser());
        response.setOriginalAmount(orderAmount.setScale(2, RoundingMode.HALF_UP));
        response.setConditions(buildCouponConditions(coupon));
        return response;
    }

    private void validateCouponEligibility(Long userId, Coupon coupon, CouponValidationResponse response, BigDecimal orderAmount) {
        LocalDate today = LocalDate.now();

        if (Boolean.FALSE.equals(coupon.getIsActive()) || coupon.getDeletedAt() != null) {
            throw new BadRequestException("Coupon is inactive");
        }

        if (coupon.getStartDate() != null && today.isBefore(coupon.getStartDate())) {
            throw new BadRequestException("Coupon is not active yet");
        }

        if (coupon.getExpiryDate() != null && today.isAfter(coupon.getExpiryDate())) {
            throw new BadRequestException("Coupon has expired");
        }

        if (coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount not met");
        }

        if (userId == null) {
            response.setEligible(true);
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        boolean alreadyUsed = couponUsageRepository.existsByCoupon_CodeAndUser_Id(coupon.getCode(), userId);
        response.setStatus(alreadyUsed ? "Used" : "Available");
        response.setEligible(!alreadyUsed);

        if (Boolean.TRUE.equals(coupon.getOneTimePerUser()) && alreadyUsed) {
            throw new BadRequestException("Coupon already used");
        }

        if (coupon.getCouponType() == Coupon.CouponType.WELCOME) {
            LocalDate welcomeExpiry = user.getCreatedAt() != null
                    ? user.getCreatedAt().toLocalDate().plusDays(WELCOME_VALIDITY_DAYS)
                    : today.plusDays(WELCOME_VALIDITY_DAYS);
            response.setExpiryDate(welcomeExpiry);
            if (today.isAfter(welcomeExpiry)) {
                throw new BadRequestException("Coupon has expired");
            }
        }

        if (coupon.getCouponType() == Coupon.CouponType.FIRST_ORDER) {
            long completedOrders = couponUsageRepository.countSuccessfulOrdersForUser(userId);
            if (completedOrders > 0) {
                throw new BadRequestException("Coupon already used");
            }
        }

        if (coupon.getCouponType() == Coupon.CouponType.VIP) {
            BigDecimal spend = couponUsageRepository.sumPaidRevenueForUser(userId);
            if (spend.compareTo(VIP_THRESHOLD) < 0) {
                throw new BadRequestException("User is not eligible for this coupon");
            }
        }

        response.setEligible(true);
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discountAmount;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENT) {
            discountAmount = orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discountAmount = coupon.getDiscountValue().setScale(2, RoundingMode.HALF_UP);
        }

        if (coupon.getMaxDiscountAmount() != null && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
            discountAmount = coupon.getMaxDiscountAmount();
        }

        if (discountAmount.compareTo(orderAmount) > 0) {
            discountAmount = orderAmount;
        }

        return discountAmount.setScale(2, RoundingMode.HALF_UP);
    }

    private List<String> buildCouponConditions(Coupon coupon) {
        List<String> conditions = new ArrayList<>();

        if (coupon.getMinOrderAmount() != null && coupon.getMinOrderAmount().compareTo(BigDecimal.ZERO) > 0) {
            conditions.add("Minimum order ₹" + coupon.getMinOrderAmount().setScale(0, RoundingMode.HALF_UP));
        }
        if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            conditions.add("Maximum discount ₹" + coupon.getMaxDiscountAmount().setScale(0, RoundingMode.HALF_UP));
        }
        if (Boolean.TRUE.equals(coupon.getOneTimePerUser())) {
            conditions.add("One-time use per user");
        }
        if (coupon.getCouponType() == Coupon.CouponType.WELCOME) {
            conditions.add("Valid for 30 days after registration");
        } else if (coupon.getCouponType() == Coupon.CouponType.FIRST_ORDER) {
            conditions.add("Available only before the first successful order");
        } else if (coupon.getCouponType() == Coupon.CouponType.VIP) {
            conditions.add("Requires ₹50,000 lifetime spending");
        }

        return conditions;
    }

    private UserCouponResponse buildUserCouponResponse(Coupon coupon, Long userId) {
        UserCouponResponse response = new UserCouponResponse();
        response.setCouponId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDiscountType(coupon.getDiscountType());
        response.setCouponType(coupon.getCouponType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        response.setMinOrderAmount(coupon.getMinOrderAmount());
        response.setStartDate(coupon.getStartDate());
        response.setExpiryDate(coupon.getExpiryDate());
        response.setActive(Boolean.TRUE.equals(coupon.getIsActive()) && coupon.getDeletedAt() == null);
        response.setConditions(buildCouponConditions(coupon));
        response.setDescription(coupon.getDescription() != null ? coupon.getDescription() : buildDescription(coupon));
        response.setTitle(buildTitle(coupon));

        CouponUsage usage = userId != null
                ? couponUsageRepository.findTopByCoupon_CodeAndUser_IdOrderByUsedAtDesc(coupon.getCode(), userId).orElse(null)
                : null;
        response.setUsed(usage != null);
        response.setUsedAt(usage != null ? usage.getUsedAt() : null);
        response.setEligible(isCouponAvailableForUser(coupon, userId));
        response.setStatus(determineCouponStatus(coupon, userId, usage));
        return response;
    }

    private boolean isCouponAvailableForUser(Coupon coupon, Long userId) {
        if (coupon.getDeletedAt() != null || Boolean.FALSE.equals(coupon.getIsActive())) {
            return false;
        }

        LocalDate today = LocalDate.now();
        if (coupon.getStartDate() != null && today.isBefore(coupon.getStartDate())) {
            return false;
        }
        if (coupon.getExpiryDate() != null && today.isAfter(coupon.getExpiryDate())) {
            return false;
        }

        if (userId == null) {
            return true;
        }

        boolean alreadyUsed = couponUsageRepository.existsByCoupon_CodeAndUser_Id(coupon.getCode(), userId);
        if (Boolean.TRUE.equals(coupon.getOneTimePerUser()) && alreadyUsed) {
            return false;
        }

        if (coupon.getCouponType() == Coupon.CouponType.FIRST_ORDER && couponUsageRepository.countSuccessfulOrdersForUser(userId) > 0) {
            return false;
        }

        if (coupon.getCouponType() == Coupon.CouponType.VIP && couponUsageRepository.sumPaidRevenueForUser(userId).compareTo(VIP_THRESHOLD) < 0) {
            return false;
        }

        if (coupon.getCouponType() == Coupon.CouponType.WELCOME) {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || user.getCreatedAt() == null || LocalDate.now().isAfter(user.getCreatedAt().toLocalDate().plusDays(WELCOME_VALIDITY_DAYS))) {
                return false;
            }
        }

        return true;
    }

    private String determineCouponStatus(Coupon coupon, Long userId, CouponUsage usage) {
        if (coupon.getDeletedAt() != null || Boolean.FALSE.equals(coupon.getIsActive())) {
            return "Inactive";
        }
        if (usage != null) {
            return "Used";
        }
        if (!isCouponAvailableForUser(coupon, userId)) {
            return "Locked";
        }
        return "Available";
    }

    private String buildTitle(Coupon coupon) {
        return switch (coupon.getCouponType()) {
            case WELCOME -> "Welcome to Luxury Maison";
            case FIRST_ORDER -> "First Order Reward";
            case FESTIVAL -> "Festival Offer";
            case VIP -> "VIP Reward";
            default -> "Luxury Maison Coupon";
        };
    }

    private String buildDescription(Coupon coupon) {
        String discountText = coupon.getDiscountType() == Coupon.DiscountType.PERCENT
                ? coupon.getDiscountValue().stripTrailingZeros().toPlainString() + "% OFF"
                : "₹" + coupon.getDiscountValue().setScale(0, RoundingMode.HALF_UP) + " OFF";
        return coupon.getCode() + " gives " + discountText;
    }

    private String normalizeCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Coupon code is required");
        }
        return code.trim().toUpperCase(Locale.ROOT);
    }
}
