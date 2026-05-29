package com.jewelryshop.security;

import com.jewelryshop.entity.User;
import com.jewelryshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("OAuth2 loadUser start. registrationId={}", userRequest.getClientRegistration().getRegistrationId());

        OAuth2User oauth2User = delegate.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();
        log.debug("OAuth2 attributes received keys={}", attributes.keySet());

        String email = (String) attributes.get("email");
        String providerId = String.valueOf(attributes.get("sub"));
        String fullName = (String) attributes.getOrDefault("name", email);
        String picture = (String) attributes.get("picture");

        if (email == null || email.isBlank()) {
            log.error("OAuth2 user does not include email. attributes={}", attributes);
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_email"), "Google account does not provide an email");
        }

        if (providerId == null || providerId.isBlank() || "null".equalsIgnoreCase(providerId)) {
            log.error("OAuth2 user does not include provider subject id. email={}", email);
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_provider_id"), "Google account does not provide a subject id");
        }

        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setPassword("OAUTH2_USER");
            newUser.setRole(User.Role.USER);
            newUser.setIsActive(true);
            newUser.setEmailVerified(true);
            newUser.setProvider("GOOGLE");
            newUser.setProviderId(providerId);
            newUser.setProfilePicture(picture);
            log.info("Creating new OAuth2 user for email={}", email);
            return userRepository.save(newUser);
        });

        if (user.getProvider() == null || user.getProvider().isBlank()) {
            user.setProvider("GOOGLE");
            user.setProviderId(providerId);
            user.setProfilePicture(picture);
            user.setEmailVerified(true);
            userRepository.save(user);
            log.info("Updated existing user with OAuth provider details. email={}", email);
        }

        if (user.getRole() == null) {
            log.error("OAuth2 user has null role. email={}", email);
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_role"), "User role is not configured");
        }

        log.info("OAuth2 loadUser successful. email={}, role={}", email, user.getRole().name());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attributes,
                "email"
        );
    }
}