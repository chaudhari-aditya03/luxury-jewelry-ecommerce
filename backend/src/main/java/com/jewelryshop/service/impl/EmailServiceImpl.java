package com.jewelryshop.service.impl;

import com.jewelryshop.service.EmailService;
import com.jewelryshop.service.EmailTemplateService;
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

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplateService emailTemplateService;
    private final Environment environment;

    @Value("${app.mail.from-email:${spring.mail.username:}}")
    private String fromEmail;

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
        String resolvedTo = validateEmail(to, "recipient");
        String resolvedSender = validateEmail(resolveSenderAddress(), "sender");
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Email subject is required");
        }
        if (templateName == null || templateName.isBlank()) {
            throw new IllegalArgumentException("Email template is required");
        }

        log.info("Sending email template={} to={} subject={}", templateName, maskEmail(resolvedTo), subject);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
        helper.setTo(resolvedTo);
        helper.setFrom(resolvedSender);
        helper.setSubject(subject);
        helper.setText(emailTemplateService.render(templateName, variables), true);

        try {
            mailSender.send(message);
            log.info("Email sent successfully template={} to={}", templateName, maskEmail(resolvedTo));
        } catch (Exception ex) {
            log.error("Failed to send email template={} to={}", templateName, maskEmail(resolvedTo), ex);
            throw ex;
        }
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