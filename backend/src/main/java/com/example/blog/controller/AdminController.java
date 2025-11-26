package com.example.blog.controller;

import com.example.blog.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    public AdminController(UserRepository userRepository) { this.userRepository = userRepository; }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<?> listUsers() {
        return userRepository.findAll();
    }
}
