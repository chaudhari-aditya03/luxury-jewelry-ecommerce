package com.jewelryshop.email;

public final class EmailConstants {

    public static final String PROVIDER_BREVO = "brevo";
    public static final String PROVIDER_DISABLED = "disabled";
    public static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    public static final String TEMPLATE_VERIFY_EMAIL = "verify-email";
    public static final String TEMPLATE_FORGOT_PASSWORD = "forgot-password";
    public static final String TEMPLATE_PASSWORD_RESET_SUCCESS = "password-reset-success";
    public static final String TEMPLATE_ORDER_CONFIRMATION = "order-confirmation";
    public static final String TEMPLATE_ORDER_SHIPPED = "order-shipped";
    public static final String TEMPLATE_ORDER_DELIVERED = "order-delivered";
    public static final String TEMPLATE_ORDER_CANCELLED = "order-cancelled";
    public static final String TEMPLATE_WELCOME_EMAIL = "welcome-email";
    public static final String TEMPLATE_COUPON_OFFER = "coupon-offer";

    public static final int DEFAULT_TIMEOUT_MS = 5000;
    public static final int DEFAULT_RETRY_COUNT = 3;
    public static final int DEFAULT_RETRY_BACKOFF_MS = 400;

    private EmailConstants() {
    }
}
