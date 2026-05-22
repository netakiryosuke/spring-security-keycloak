package com.netakiryosuke.spring_security_keycloak.infrastructure;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.netakiryosuke.spring_security_keycloak.domain.User;
import com.netakiryosuke.spring_security_keycloak.domain.UserRepository;

@Repository
public class DummyUserRepository implements UserRepository{

    private static final Map<String, User> STORE = Map.of(
        "83371f03-6922-449f-9d58-dd5013089f8d", new User("83371f03-6922-449f-9d58-dd5013089f8d", "testuser", "user@example.com"),
        "cbce3bf2-eedd-4205-8f94-f5a2d34a1889", new User("cbce3bf2-eedd-4205-8f94-f5a2d34a1889", "adminuser", "admin@example.com")
    );

    @Override
    public Optional<User> findById(String id) {
        return Optional.ofNullable(STORE.get(id));
    }

    @Override
    public List<User> findAll() {
        return List.copyOf(STORE.values());
    }
}
