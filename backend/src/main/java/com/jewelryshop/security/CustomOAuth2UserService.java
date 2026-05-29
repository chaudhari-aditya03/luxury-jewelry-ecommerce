package com.jewelryshop.security;

import com.jewelryshop.entity.User;
import com.jewelryshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();

        String email = (String) attributes.get("email");
        String providerId = String.valueOf(attributes.get("sub"));
        String fullName = (String) attributes.getOrDefault("name", email);
        String picture = (String) attributes.get("picture");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_email"), "Google account does not provide an email");
        }

        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setPassword("OAUTH2_USER");
            newUser.setRole(User.Role.USER);
            newUser.setIsActive(true);
            newUser.setEmailVerified(true);
            newUser.setProvider("google");
            newUser.setProviderId(providerId);
            newUser.setProfilePicture(picture);
            return userRepository.save(newUser);
        });

        if (user.getProvider() == null) {
            user.setProvider("google");
            user.setProviderId(providerId);
            user.setProfilePicture(picture);
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attributes,
                "email"
        );
    }
}