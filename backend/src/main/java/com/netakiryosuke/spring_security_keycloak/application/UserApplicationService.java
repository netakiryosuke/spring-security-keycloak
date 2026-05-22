package com.netakiryosuke.spring_security_keycloak.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.netakiryosuke.spring_security_keycloak.domain.User;
import com.netakiryosuke.spring_security_keycloak.domain.UserRepository;

@Service
public class UserApplicationService {

    private final UserRepository userRepository;

    public UserApplicationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User lookup(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> list() {
        return userRepository.findAll();
    }
}
