package com.jewelryshop.service.impl;

import com.jewelryshop.dto.AuthResponse;
import com.jewelryshop.dto.LoginRequest;
import com.jewelryshop.dto.RegisterRequest;
import com.jewelryshop.dto.ResendOtpRequest;
import com.jewelryshop.dto.UserResponse;
import com.jewelryshop.dto.VerificationResponseDTO;
import com.jewelryshop.dto.VerifyOtpRequest;
import com.jewelryshop.entity.OtpVerification;
import com.jewelryshop.entity.PendingRegistration;
import com.jewelryshop.entity.User;
import com.jewelryshop.exception.BadRequestException;
import com.jewelryshop.repository.OtpVerificationRepository;
import com.jewelryshop.repository.PendingRegistrationRepository;
import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.service.AuthService;
import com.jewelryshop.service.NotificationEmailService;
import com.jewelryshop.email.EmailService;
import com.jewelryshop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;
    private final NotificationEmailService notificationEmailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    @Value("${app.mail.from-name:Jewelry Shop}")
    private String brandName;

    @Value("${app.otp.expiry-minutes:5}")
    private long otpExpiryMinutes;

    @Value("${app.otp.max-resend-count:3}")
    private int maxResendCount;

    @Value("${app.otp.max-attempt-count:5}")
    private int maxAttemptCount;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public VerificationResponseDTO sendOtp(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        log.info("Starting registration OTP flow for email={}", maskEmail(email));

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(email)
                .orElseGet(PendingRegistration::new);
        pendingRegistration.setEmail(email);
        pendingRegistration.setFullName(request.getFullName().trim());
        pendingRegistration.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        pendingRegistration.setPhone(request.getPhone());
        pendingRegistration.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        pendingRegistration.setConsumed(false);
        pendingRegistrationRepository.save(pendingRegistration);

        String otpCode = generateOtpCode();
        OtpVerification otpVerification = otpVerificationRepository.findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email)
                .orElseGet(OtpVerification::new);
        otpVerification.setEmail(email);
        otpVerification.setOtp(otpCode);
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        otpVerification.setVerified(false);
        otpVerification.setAttemptCount(0);
        otpVerification.setResendCount(0);
        otpVerificationRepository.save(otpVerification);

        sendOtpEmail(pendingRegistration.getFullName(), email, otpCode, pendingRegistration.getExpiresAt());
        log.info("OTP generated and email sent for email={}", maskEmail(email));

        return new VerificationResponseDTO(true, "Verification code sent successfully", email, false, true);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = normalizeEmail(request.getEmail());
        String otpCode = request.getOtpCode().trim();
        log.info("Verifying registration OTP for email={}", maskEmail(email));

        OtpVerification otpVerification = otpVerificationRepository.findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No active verification code found for this email"));

        if (otpVerification.getAttemptCount() >= maxAttemptCount) {
            throw new BadRequestException("Too many incorrect attempts. Please request a new OTP");
        }

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpVerification.setAttemptCount(otpVerification.getAttemptCount() + 1);
            otpVerificationRepository.save(otpVerification);
            throw new BadRequestException("Verification code has expired. Please request a new OTP");
        }

        if (!otpVerification.getOtp().equals(otpCode)) {
            otpVerification.setAttemptCount(otpVerification.getAttemptCount() + 1);
            otpVerificationRepository.save(otpVerification);
            throw new BadRequestException("Invalid verification code");
        }

        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Registration request not found. Please register again"));

        if (pendingRegistration.isConsumed() || pendingRegistration.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Registration request has expired. Please register again");
        }

        User user = new User();
        user.setFullName(pendingRegistration.getFullName());
        user.setEmail(pendingRegistration.getEmail());
        user.setPassword(pendingRegistration.getPasswordHash());
        user.setPhone(pendingRegistration.getPhone());
        user.setRole(User.Role.USER);
        user.setIsActive(true);
        user.setEmailVerified(true);

        User savedUser = userRepository.save(user);
        pendingRegistration.setConsumed(true);
        pendingRegistrationRepository.save(pendingRegistration);

        otpVerification.setVerified(true);
        otpVerificationRepository.save(otpVerification);
        otpVerificationRepository.deleteByEmail(email);
        pendingRegistrationRepository.deleteByEmail(email);

        String welcomeCouponMessage = "Use WELCOME10 and get 10% OFF on your first order. Minimum order ₹3000. Maximum discount ₹1000. Valid for 30 days.";
        try {
            notificationEmailService.sendCouponOfferEmail(
                    savedUser.getEmail(),
                    "Welcome to " + brandName,
                    "WELCOME10",
                    welcomeCouponMessage
            );
        } catch (Exception ex) {
            log.warn("Welcome coupon email delivery failed for email={}", maskEmail(email), ex);
        }

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        UserResponse userResponse = modelMapper.map(savedUser, UserResponse.class);

        log.info("Registration completed successfully for email={}", maskEmail(email));
        return new AuthResponse(token, userResponse, "WELCOME10", welcomeCouponMessage);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public VerificationResponseDTO resendOtp(ResendOtpRequest request) {
        String email = normalizeEmail(request.getEmail());
        log.info("Resending registration OTP for email={}", maskEmail(email));

        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No pending registration found for this email"));

        if (pendingRegistration.isConsumed()) {
            throw new BadRequestException("This registration has already been completed");
        }

        if (pendingRegistration.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Registration request has expired. Please register again");
        }

        OtpVerification otpVerification = otpVerificationRepository.findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No active verification code found for this email"));

        if (otpVerification.getResendCount() >= maxResendCount) {
            throw new BadRequestException("Resend limit reached. Please wait before requesting another code");
        }

        String otpCode = generateOtpCode();
        otpVerification.setOtp(otpCode);
        otpVerification.setAttemptCount(0);
        otpVerification.setResendCount(otpVerification.getResendCount() + 1);
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        otpVerificationRepository.save(otpVerification);

        pendingRegistration.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        pendingRegistrationRepository.save(pendingRegistration);

        sendOtpEmail(pendingRegistration.getFullName(), email, otpCode, pendingRegistration.getExpiresAt());
        return new VerificationResponseDTO(true, "Verification code resent successfully", email, false, true);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Account is deactivated. Please contact support");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new BadRequestException("Please verify your email before login");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            log.info("Authentication successful for email: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Authentication failed for email: {}", request.getEmail(), e);
            throw new BadRequestException("Invalid email or password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);

        log.info("User logged in successfully: {}", user.getEmail());
        return new AuthResponse(token, userResponse);
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return modelMapper.map(user, UserResponse.class);
    }

    private void sendOtpEmail(String fullName, String email, String otpCode, LocalDateTime expiresAt) {
        Map<String, Object> model = new HashMap<>();
        model.put("brandName", brandName);
        model.put("customerName", fullName);
        model.put("verificationCode", otpCode);
        model.put("expiryTime", expiresAt);
        model.put("validityMinutes", otpExpiryMinutes);

        try {
            emailService.sendHtmlEmail(email, "Verify your email - " + brandName, "verify-email", model);
        } catch (Exception ex) {
            log.error("OTP email delivery failed for email={}", maskEmail(email), ex);
            throw new IllegalStateException("Unable to send verification email", ex);
        }
    }

    private String generateOtpCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }

        return email.trim().toLowerCase();
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return "***";
        }

        return email.charAt(0) + "***" + email.substring(atIndex);
    }
}
