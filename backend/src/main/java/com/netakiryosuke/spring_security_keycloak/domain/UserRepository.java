package com.netakiryosuke.spring_security_keycloak.domain;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(String id);
    List<User> findAll();
}
