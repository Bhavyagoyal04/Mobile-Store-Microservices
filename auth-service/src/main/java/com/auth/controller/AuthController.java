package com.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.auth.dto.RegisterRequest;
import com.auth.model.User;
import com.auth.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    // REGISTER (FIXED)
    @PostMapping("/register")
    public User register(@RequestBody com.auth.dto.RegisterRequest req) {
        return service.register(req);
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        String token = service.login(user.getUsername(), user.getPassword());

        Map<String, String> res = new HashMap<>();
        res.put("token", token);

        return res;
    }
}