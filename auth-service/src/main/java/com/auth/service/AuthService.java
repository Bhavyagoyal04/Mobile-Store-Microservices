package com.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.model.User;
import com.auth.repository.UserRepository;
import com.auth.exception.BadRequestException;
import com.auth.exception.ResourceNotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    public User register(User user) {
        return repo.save(user);
    }

    public User login(String username, String password) {

        User user = repo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new BadRequestException("Invalid password");
        }

        return user;
    }
}