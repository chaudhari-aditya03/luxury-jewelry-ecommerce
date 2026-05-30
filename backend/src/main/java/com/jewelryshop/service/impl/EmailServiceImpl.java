package com.jewelryshop.service.impl;

import com.jewelryshop.email.EmailRequest;
import com.jewelryshop.email.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements com.jewelryshop.service.EmailService {

    private final EmailService emailService;

    @Override
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        emailService.send(
                EmailRequest.builder()
                        .to(to)
                        .subject(subject)
                        .templateName(templateName)
                        .variables(variables != null ? variables : Collections.emptyMap())
                        .build()
        );
    }
}