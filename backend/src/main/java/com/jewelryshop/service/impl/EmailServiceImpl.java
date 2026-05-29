package com.jewelryshop.service.impl;

import com.jewelryshop.service.EmailService;
import com.jewelryshop.service.EmailTemplateService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplateService emailTemplateService;

    @Value("${app.mail.from-email:${spring.mail.username:}}")
    private String fromEmail;

    @Override
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
        helper.setTo(to);
        helper.setFrom(fromEmail);
        helper.setSubject(subject);
        helper.setText(emailTemplateService.render(templateName, variables), true);
        mailSender.send(message);
    }
}