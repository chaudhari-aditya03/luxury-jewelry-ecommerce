package com.jewelryshop.config;

import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;

import jakarta.annotation.PostConstruct;
import java.util.Properties;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MailConfig {

    private final Environment environment;

    @Value("${spring.mail.host:${MAIL_HOST:localhost}}")
    private String host;

    @Value("${spring.mail.port:${MAIL_PORT:25}}")
    private int port;

    @Value("${spring.mail.username:${MAIL_USERNAME:}}")
    private String username;

    @Value("${spring.mail.password:${MAIL_PASSWORD:}}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth:${MAIL_SMTP_AUTH:false}}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:${MAIL_STARTTLS_ENABLE:false}}")
    private boolean startTls;

    @Value("${spring.mail.properties.mail.smtp.connectiontimeout:${MAIL_CONNECTION_TIMEOUT:5000}}")
    private int connectionTimeout;

    @Value("${spring.mail.properties.mail.smtp.timeout:${MAIL_TIMEOUT:5000}}")
    private int timeout;

    @Value("${spring.mail.properties.mail.smtp.writetimeout:${MAIL_WRITE_TIMEOUT:5000}}")
    private int writeTimeout;

    @Value("${spring.mail.properties.mail.debug:${MAIL_DEBUG:false}}")
    private boolean debug;

    @Value("${app.mail.from-email:${MAIL_FROM_EMAIL:${MAIL_USERNAME:${spring.mail.username:}}}}")
    private String fromEmail;

    @Value("${app.mail.provider:brevo}")
    private String mailProvider;

    private String resolvedFromEmail;

    @PostConstruct
    void validateMailConfiguration() {
        resolvedFromEmail = firstNonBlank(
                fromEmail,
                environment.getProperty("app.mail.from-email"),
                environment.getProperty("MAIL_FROM_EMAIL"),
                environment.getProperty("MAIL_USERNAME"),
                environment.getProperty("spring.mail.username"),
                environment.getProperty("SMTP_USERNAME"),
                environment.getProperty("GMAIL_USERNAME")
        );

        if ("smtp".equalsIgnoreCase(mailProvider) && (username == null || username.isBlank() || password == null || password.isBlank())) {
            log.warn("SMTP credentials are not fully configured. Set MAIL_USERNAME and MAIL_PASSWORD if app.mail.provider=smtp.");
        }

        if (resolvedFromEmail == null || resolvedFromEmail.isBlank()) {
            log.warn("Mail sender address is not configured. Set MAIL_FROM_EMAIL or MAIL_USERNAME so outbound mail can be addressed correctly.");
        }

        log.info("Mail provider configured as {}", mailProvider);
    }

    @Bean
    @Primary
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding("UTF-8");

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.auth", String.valueOf(smtpAuth));
        properties.put("mail.smtp.starttls.enable", String.valueOf(startTls));
        properties.put("mail.smtp.starttls.required", String.valueOf(startTls));
        properties.put("mail.smtp.ssl.trust", host);
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
        properties.put("mail.smtp.connectiontimeout", String.valueOf(connectionTimeout));
        properties.put("mail.smtp.timeout", String.valueOf(timeout));
        properties.put("mail.smtp.writetimeout", String.valueOf(writeTimeout));
        properties.put("mail.debug", String.valueOf(debug));

        log.info("Configured JavaMailSender host={} port={} username={} debug={}", host, port, maskUsername(username), debug);
        return mailSender;
    }

    @Bean
    public SpringResourceTemplateResolver emailTemplateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setPrefix("classpath:/templates/emails/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setCacheable(false);
        return resolver;
    }

    @Bean
    @Primary
    public TemplateEngine emailTemplateEngine(SpringResourceTemplateResolver emailTemplateResolver) {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(emailTemplateResolver);
        return engine;
    }

    private String maskUsername(String value) {
        if (value == null || value.isBlank()) {
            return "<unset>";
        }

        int atIndex = value.indexOf('@');
        if (atIndex <= 1) {
            return "***";
        }

        return value.charAt(0) + "***" + value.substring(atIndex);
    }

    private String firstNonBlank(String... values) {
        return Arrays.stream(values)
                .filter(value -> value != null && !value.trim().isBlank())
                .map(String::trim)
                .findFirst()
                .orElse("");
    }
}