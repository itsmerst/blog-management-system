package com.example.blog.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(unique = true)
    private String slug;
    @Lob
    private String content; // rich-text HTML
    private String status;
    private LocalDateTime publishedAt;
    @ManyToOne
    private User author;
    @ManyToMany
    private Set<Category> categories;
    @ManyToMany
    private Set<Tag> tags;
}
