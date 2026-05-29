package com.jewelryshop.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        log.error("OAuth2 authentication failed. message={}, uri={}", exception.getMessage(), request.getRequestURI(), exception);

        String encodedMessage = URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        String redirectUrl = frontendUrl + "/oauth-error?message=" + encodedMessage;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
