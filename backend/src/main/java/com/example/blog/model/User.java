package com.example.blog.model;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true)
    private String username;
    @Column(nullable=false, unique=true)
    private String email;
    @Column(nullable=false)
    private String password;
    private String role; // ROLE_ADMIN, ROLE_AUTHOR, ROLE_READER
}
