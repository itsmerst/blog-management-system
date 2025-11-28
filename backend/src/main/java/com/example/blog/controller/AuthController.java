package com.example.blog.controller;

import com.example.blog.model.User;
import com.example.blog.model.RefreshToken;
import com.example.blog.repository.UserRepository;
import com.example.blog.repository.RefreshTokenRepository;
import com.example.blog.security.JwtUtil;
import com.example.blog.security.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;      // <- interface
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,        // <- interface
                          JwtUtil jwtUtil,
                          RefreshTokenService refreshTokenService,
                          RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role","ROLE_READER");
        if(username==null||email==null||password==null) return ResponseEntity.badRequest().body("missing fields");
        if(userRepository.findByUsername(username).isPresent()) return ResponseEntity.badRequest().body("username exists");
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole(role);
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message","registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Optional<User> ou = userRepository.findByUsername(username);
        if(ou.isEmpty()) return ResponseEntity.status(401).body(Map.of("error","invalid credentials"));
        User u = ou.get();
        if(!passwordEncoder.matches(password, u.getPassword())) return ResponseEntity.status(401).body(Map.of("error","invalid credentials"));
        String token = jwtUtil.generateToken(u.getUsername(), u.getRole());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(u);
        Map<String,Object> res = new HashMap<>();
        res.put("token", token);
        res.put("refreshToken", refreshToken.getToken());
        res.put("role", u.getRole());
        res.put("username", u.getUsername());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String,String> body) {
        String requestToken = body.get("refreshToken");
        if (requestToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "missing"));
        }

        return refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
                    return ResponseEntity.ok(Map.of("token", token));
                })
                .orElseGet(() -> ResponseEntity.status(403)
                        .body(Map.of("error", "Invalid refresh token")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        if(username!=null) {
            userRepository.findByUsername(username).ifPresent(u -> refreshTokenService.deleteByUserId(u.getId()));
        }
        return ResponseEntity.ok(Map.of("message","logged out"));
    }
}
