package com.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.auth.model.User;
import com.auth.security.JwtUtil;
import com.auth.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        service.login(user.getUsername(), user.getPassword());

        String token = jwtUtil.generateToken(user.getUsername());

        Map<String, String> res = new HashMap<>();
        res.put("token", token);

        return res;
    }
}