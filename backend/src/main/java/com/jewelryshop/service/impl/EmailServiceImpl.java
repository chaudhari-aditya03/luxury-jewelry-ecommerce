package com.jewelryshop.service.impl;

import com.jewelryshop.service.EmailService;
import com.jewelryshop.service.EmailTemplateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private static final String PROVIDER_SMTP = "smtp";
    private static final String PROVIDER_RESEND = "resend";
    private static final String PROVIDER_BREVO = "brevo";
    private static final String PROVIDER_DISABLED = "disabled";
    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final JavaMailSender mailSender;
    private final EmailTemplateService emailTemplateService;
    private final Environment environment;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${app.mail.from-email:${spring.mail.username:}}")
    private String fromEmail;

    @Value("${app.mail.from-name:Jewelry Shop}")
    private String fromName;

    @Value("${app.mail.provider:smtp}")
    private String mailProvider;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.api-key:}")
    private String mailApiKey;

    private String resolvedFromEmail;

    @jakarta.annotation.PostConstruct
    void resolveFromEmail() {
        resolvedFromEmail = firstNonBlank(
                fromEmail,
                environment.getProperty("app.mail.from-email"),
                environment.getProperty("MAIL_FROM_EMAIL"),
                environment.getProperty("MAIL_USERNAME"),
                environment.getProperty("spring.mail.username"),
                environment.getProperty("SMTP_USERNAME"),
                environment.getProperty("GMAIL_USERNAME")
        );
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        if (!mailEnabled || PROVIDER_DISABLED.equalsIgnoreCase(mailProvider)) {
            log.warn("Mail delivery is disabled. Skipping template={} to={}", templateName, maskEmail(to));
            return;
        }

        String resolvedTo = validateEmail(to, "recipient");
        String resolvedSender = validateEmail(resolveSenderAddress(), "sender");
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Email subject is required");
        }
        if (templateName == null || templateName.isBlank()) {
            throw new IllegalArgumentException("Email template is required");
        }

        log.info("Sending email template={} to={} subject={}", templateName, maskEmail(resolvedTo), subject);

        String htmlBody = emailTemplateService.render(templateName, variables);

        if (PROVIDER_RESEND.equalsIgnoreCase(mailProvider)) {
            sendViaResend(resolvedSender, resolvedTo, subject, htmlBody, templateName);
            return;
        }

        if (PROVIDER_BREVO.equalsIgnoreCase(mailProvider)) {
            sendViaBrevo(resolvedSender, resolvedTo, subject, htmlBody, templateName);
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
        helper.setTo(resolvedTo);
        helper.setFrom(resolvedSender);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        try {
            mailSender.send(message);
            log.info("Email sent successfully template={} to={}", templateName, maskEmail(resolvedTo));
        } catch (Exception ex) {
            log.error("Failed to send email template={} to={}", templateName, maskEmail(resolvedTo), ex);
            throw ex;
        }
    }

    private void sendViaResend(String from, String to, String subject, String htmlBody, String templateName) throws MessagingException {
        if (mailApiKey == null || mailApiKey.isBlank()) {
            throw new IllegalStateException("MAIL_API_KEY is required when app.mail.provider=resend");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("from", formatSender(from));
        payload.put("to", new String[]{to});
        payload.put("subject", subject);
        payload.put("html", htmlBody);

        try {
            String requestBody = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + mailApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email sent successfully via Resend template={} to={}", templateName, maskEmail(to));
                return;
            }

            throw new IllegalStateException("Resend API returned status " + response.statusCode() + ": " + response.body());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Resend email request was interrupted", ex);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to send email through Resend", ex);
        }
    }

    private void sendViaBrevo(String from, String to, String subject, String htmlBody, String templateName) throws MessagingException {
        if (mailApiKey == null || mailApiKey.isBlank()) {
            throw new IllegalStateException("MAIL_API_KEY is required when app.mail.provider=brevo");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sender", Map.of("name", fromName != null && !fromName.isBlank() ? fromName.trim() : "Jewelry Shop", "email", from));
        payload.put("to", java.util.List.of(Map.of("email", to)));
        payload.put("subject", subject);
        payload.put("htmlContent", htmlBody);

        try {
            String requestBody = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .header("api-key", mailApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email sent successfully via Brevo template={} to={}", templateName, maskEmail(to));
                return;
            }

            throw new IllegalStateException("Brevo API returned status " + response.statusCode() + ": " + response.body());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Brevo email request was interrupted", ex);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to send email through Brevo", ex);
        }
    }

    private String formatSender(String senderEmail) {
        String displayName = fromName != null && !fromName.isBlank() ? fromName.trim() : "Jewelry Shop";
        return displayName + " <" + senderEmail + ">";
    }

    private String validateEmail(String email, String label) throws AddressException {
        String resolvedEmail = email != null ? email.trim() : "";
        if (resolvedEmail.isBlank()) {
            throw new IllegalStateException("Mail " + label + " address is not configured");
        }

        InternetAddress address = new InternetAddress(resolvedEmail, true);
        address.validate();
        return resolvedEmail;
    }

    private String maskEmail(String email) {
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

    private String resolveSenderAddress() {
        String configuredSender = firstNonBlank(resolvedFromEmail, fromEmail);
        if (!configuredSender.isBlank()) {
            return configuredSender;
        }

        if (mailSender instanceof JavaMailSenderImpl javaMailSenderImpl) {
            return firstNonBlank(javaMailSenderImpl.getUsername());
        }

        return "";
    }
}