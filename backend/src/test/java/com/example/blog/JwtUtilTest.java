package com.example.blog;

import com.example.blog.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testGenerateAndParseToken() {
        String token = jwtUtil.generateToken("testuser", "ROLE_AUTHOR");
        assertNotNull(token);
        assertEquals("testuser", jwtUtil.getUsernameFromToken(token));
        assertEquals("ROLE_AUTHOR", jwtUtil.getRoleFromToken(token));
        assertTrue(jwtUtil.validateToken(token));
    }
}
