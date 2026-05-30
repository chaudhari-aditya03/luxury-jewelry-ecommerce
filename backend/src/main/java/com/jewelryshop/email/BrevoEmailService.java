package com.jewelryshop.email;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BrevoEmailService implements EmailService {

    private final HttpClient httpClient;
    private final EmailTemplateService emailTemplateService;
    private final Environment environment;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.mail.provider:${MAIL_PROVIDER:brevo}}")
    private String mailProvider;

    @Value("${app.mail.enabled:${MAIL_ENABLED:true}}")
    private boolean mailEnabled;

    @Value("${app.mail.api-key:${BREVO_API_KEY:${MAIL_API_KEY:}}}")
    private String brevoApiKey;

    @Value("${app.mail.from-email:${MAIL_FROM_EMAIL:}}")
    private String fromEmail;

    @Value("${app.mail.from-name:${MAIL_FROM_NAME:Luxury Maison}}")
    private String fromName;

    @Value("${app.mail.request-timeout-ms:${MAIL_REQUEST_TIMEOUT_MS:10000}}")
    private int requestTimeoutMs;

    @Value("${app.mail.max-retries:${MAIL_MAX_RETRIES:3}}")
    private int maxRetries;

    @Value("${app.mail.retry-backoff-ms:${MAIL_RETRY_BACKOFF_MS:400}}")
    private int retryBackoffMs;

    private String resolvedFromEmail;

    @PostConstruct
    void resolveSender() {
        resolvedFromEmail = firstNonBlank(
                fromEmail,
                environment.getProperty("MAIL_FROM_EMAIL"),
                environment.getProperty("app.admin.email")
        );

        if (resolvedFromEmail.isBlank()) {
            log.warn("MAIL_FROM_EMAIL is not configured. Brevo emails will fail until a verified sender is set.");
        }

        log.info("Email provider configured as {}", mailProvider);
    }

    @Override
    public EmailResponse sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        return send(EmailRequest.builder()
                .to(to)
                .subject(subject)
                .templateName(templateName)
                .variables(variables)
                .build());
    }

    @Override
    public EmailResponse send(EmailRequest request) {
        if (!mailEnabled || EmailConstants.PROVIDER_DISABLED.equalsIgnoreCase(mailProvider)) {
            log.warn("Mail delivery is disabled. Skipping template={} to={}", request.getTemplateName(), maskEmail(request.getTo()));
            return EmailResponse.builder()
                    .success(false)
                    .provider(EmailConstants.PROVIDER_BREVO)
                    .message("Mail delivery is disabled")
                    .statusCode(0)
                    .build();
        }

        if (!EmailConstants.PROVIDER_BREVO.equalsIgnoreCase(mailProvider)) {
            throw new IllegalStateException("Unsupported mail provider: " + mailProvider + ". Only Brevo is supported in production.");
        }

        String recipient = validateEmail(request.getTo(), "recipient");
        String sender = validateEmail(resolveSenderAddress(), "sender");
        String subject = validateText(request.getSubject(), "subject");
        String templateName = validateText(request.getTemplateName(), "templateName");

        String htmlBody = emailTemplateService.render(templateName, request.getVariables());
        Map<String, Object> payload = buildPayload(sender, recipient, subject, htmlBody);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(EmailConstants.BREVO_API_URL))
                .timeout(Duration.ofMillis(requestTimeoutMs))
                .header("accept", "application/json")
                .header("api-key", brevoApiKey == null ? "" : brevoApiKey.trim())
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(writeJson(payload)))
                .build();

        HttpResponse<String> response = executeWithRetry(httpRequest, templateName, recipient);
        String providerMessageId = extractMessageId(response.body());

        return EmailResponse.builder()
                .success(true)
                .provider(EmailConstants.PROVIDER_BREVO)
                .message("Email sent successfully")
                .providerMessageId(providerMessageId)
                .statusCode(response.statusCode())
                .build();
    }

    private HttpResponse<String> executeWithRetry(HttpRequest request, String templateName, String recipient) {
        int attempts = Math.max(1, maxRetries);
        RuntimeException lastException = null;

        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("Email sent successfully via Brevo template={} to={}", templateName, maskEmail(recipient));
                    return response;
                }

                if (isRetryableStatus(response.statusCode()) && attempt < attempts) {
                    waitBeforeRetry(attempt);
                    continue;
                }

                throw new IllegalStateException("Brevo API returned status " + response.statusCode() + ": " + response.body());
            } catch (IOException ex) {
                lastException = new IllegalStateException("Failed to send email through Brevo", ex);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("Brevo email request was interrupted", ex);
            }

            if (attempt < attempts) {
                waitBeforeRetry(attempt);
            }
        }

        if (lastException != null) {
            throw lastException;
        }

        throw new IllegalStateException("Unable to send email via Brevo after retries");
    }

    private Map<String, Object> buildPayload(String from, String to, String subject, String htmlBody) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sender", Map.of(
                "name", fromName != null && !fromName.isBlank() ? fromName.trim() : "Luxury Maison",
                "email", from
        ));
        payload.put("to", List.of(Map.of("email", to)));
        payload.put("subject", subject);
        payload.put("htmlContent", htmlBody);
        payload.put("textContent", stripHtml(htmlBody));
        return payload;
    }

    private String writeJson(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to serialize Brevo payload", ex);
        }
    }

    private String extractMessageId(String body) {
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            if (jsonNode.hasNonNull("messageId")) {
                return jsonNode.get("messageId").asText();
            }
            if (jsonNode.hasNonNull("id")) {
                return jsonNode.get("id").asText();
            }
        } catch (Exception ignored) {
            return body;
        }

        return body;
    }

    private String resolveSenderAddress() {
        return firstNonBlank(resolvedFromEmail, fromEmail, environment.getProperty("MAIL_FROM_EMAIL"));
    }

    private String validateEmail(String email, String label) {
        String resolved = email == null ? "" : email.trim();
        if (resolved.isBlank()) {
            throw new IllegalStateException("Mail " + label + " address is not configured");
        }

        try {
            new InternetAddress(resolved, true).validate();
            return resolved;
        } catch (AddressException ex) {
            throw new IllegalStateException("Invalid mail " + label + " address: " + resolved, ex);
        }
    }

    private String validateText(String value, String label) {
        String resolved = value == null ? "" : value.trim();
        if (resolved.isBlank()) {
            throw new IllegalStateException("Mail " + label + " is required");
        }
        return resolved;
    }

    private boolean isRetryableStatus(int statusCode) {
        return statusCode == 408 || statusCode == 425 || statusCode == 429 || (statusCode >= 500 && statusCode < 600);
    }

    private void waitBeforeRetry(int attempt) {
        long delay = (long) retryBackoffMs * attempt;
        try {
            Thread.sleep(delay);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Brevo retry wait interrupted", ex);
        }
    }

    private String stripHtml(String html) {
        return html == null ? "" : html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }

    private String maskEmail(String email) {
        if (email == null || email.isBlank()) {
            return "***";
        }

        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return "***";
        }

        return email.charAt(0) + "***" + email.substring(atIndex);
    }

    private String firstNonBlank(String... values) {
        return Arrays.stream(values)
                .filter(value -> value != null && !value.trim().isBlank())
                .map(String::trim)
                .findFirst()
                .orElse("");
    }
}
