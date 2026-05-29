package com.jewelryshop.service;

import jakarta.mail.MessagingException;

import java.util.Map;

public interface EmailService {
    void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException;
}