package com.jewelryshop.security;

import com.jewelryshop.repository.UserRepository;
import com.jewelryshop.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:https://jewelryeshop.vercel.app}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        try {
            log.info("OAuth2 success handler triggered. requestUri={}", request.getRequestURI());

            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            if (email == null || email.isBlank()) {
                throw new IllegalStateException("OAuth success received without email attribute");
            }

            var user = userRepository.findByEmailAndDeletedAtIsNull(email)
                    .orElseThrow(() -> new IllegalStateException("OAuth user not found in database for email: " + email));

            if (user.getRole() == null) {
                throw new IllegalStateException("OAuth user has no role for email: " + email);
            }

            if (frontendUrl == null || frontendUrl.isBlank()) {
                throw new IllegalStateException("Frontend URL is not configured");
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            String redirectUrl = frontendUrl + "/oauth-success?token=" + token;
            log.info("OAuth2 success completed. email={}, role={}, redirect={}", user.getEmail(), user.getRole().name(), redirectUrl);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception ex) {
            log.error("OAuth2 success flow failed", ex);
            throw ex;
        }
    }
}