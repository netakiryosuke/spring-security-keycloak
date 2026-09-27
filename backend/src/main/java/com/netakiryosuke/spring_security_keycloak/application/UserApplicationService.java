package com.netakiryosuke.spring_security_keycloak.application;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.netakiryosuke.spring_security_keycloak.domain.User;
import com.netakiryosuke.spring_security_keycloak.domain.UserRepository;

@Service
public class UserApplicationService {

    private final UserRepository userRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    public UserApplicationService(UserRepository userRepository, AuthenticatedUserProvider authenticatedUserProvider) {
        this.userRepository = userRepository;
        this.authenticatedUserProvider = authenticatedUserProvider;
    }

    @PreAuthorize("hasRole('USER')")
    public User lookupMyself() {
        String userId = authenticatedUserProvider.getUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummaryDto> list() {
        return userRepository.findAll().stream()
                .map(user -> new UserSummaryDto(
                        user.id(), user.username(), user.email(), user.birthDate()))
                .toList();
    }
}
