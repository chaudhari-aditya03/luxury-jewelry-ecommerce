package com.jewelryshop.email;

import jakarta.mail.MessagingException;

import java.util.Map;

public interface EmailService {
    EmailResponse sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException;

    EmailResponse send(EmailRequest request);
}
