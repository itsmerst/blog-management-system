package com.example.blog.controller;

import com.example.blog.model.*;
import com.example.blog.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;

    public PostController(PostRepository postRepository, UserRepository userRepository,
                          CategoryRepository categoryRepository, TagRepository tagRepository,
                          CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public List<Post> list() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return postRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('AUTHOR') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String,Object> body) {
        String title = (String) body.get("title");
        String content = (String) body.get("content");
        String authorName = (String) body.get("author");
        List<String> cats = (List<String>) body.getOrDefault("categories", new ArrayList<>());
        List<String> tags = (List<String>) body.getOrDefault("tags", new ArrayList<>());
        if(title==null||content==null||authorName==null) return ResponseEntity.badRequest().body("missing");
        Optional<User> ou = userRepository.findByUsername(authorName);
        if(ou.isEmpty()) return ResponseEntity.badRequest().body("unknown author");
        Post p = new Post();
        p.setTitle(title);
        p.setSlug(title.toLowerCase().replaceAll("[^a-z0-9]+","-"));
        p.setContent(content);
        p.setStatus("PUBLISHED");
        p.setPublishedAt(LocalDateTime.now());
        p.setAuthor(ou.get());
        Set<Category> catSet = cats.stream().map(name -> categoryRepository.findByName(name).orElseGet(() -> {
            Category c = new Category();
            c.setName(name); c.setSlug(name.toLowerCase().replaceAll("[^a-z0-9]+","-"));
            return categoryRepository.save(c);
        })).collect(Collectors.toSet());
        p.setCategories(catSet);
        Set<Tag> tagSet = tags.stream().map(name -> tagRepository.findByName(name).orElseGet(() -> {
            Tag t = new Tag(); t.setName(name); t.setSlug(name.toLowerCase().replaceAll("[^a-z0-9]+","-"));
            return tagRepository.save(t);
        })).collect(Collectors.toSet());
        p.setTags(tagSet);
        postRepository.save(p);
        return ResponseEntity.status(201).body(p);
    }

    @PreAuthorize("hasRole('AUTHOR') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return postRepository.findById(id).map(p -> {
            String title = (String) body.get("title");
            String content = (String) body.get("content");
            List<String> cats = (List<String>) body.getOrDefault("categories", new ArrayList<>());
            List<String> tags = (List<String>) body.getOrDefault("tags", new ArrayList<>());
            if(title!=null) { p.setTitle(title); p.setSlug(title.toLowerCase().replaceAll("[^a-z0-9]+","-")); }
            if(content!=null) p.setContent(content);
            Set<Category> catSet = cats.stream().map(name -> categoryRepository.findByName(name).orElseGet(() -> {
                Category c = new Category();
                c.setName(name); c.setSlug(name.toLowerCase().replaceAll("[^a-z0-9]+","-"));
                return categoryRepository.save(c);
            })).collect(Collectors.toSet());
            p.setCategories(catSet);
            Set<Tag> tagSet = tags.stream().map(name -> tagRepository.findByName(name).orElseGet(() -> {
                Tag t = new Tag(); t.setName(name); t.setSlug(name.toLowerCase().replaceAll("[^a-z0-9]+","-"));
                return tagRepository.save(t);
            })).collect(Collectors.toSet());
            p.setTags(tagSet);
            postRepository.save(p);
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if(!postRepository.existsById(id)) return ResponseEntity.notFound().build();
        postRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody Map<String,String> body) {
        String content = body.get("content");
        String username = body.get("username");
        Optional<Post> op = postRepository.findById(id);
        if(op.isEmpty()) return ResponseEntity.notFound().build();
        Comment c = new Comment();
        c.setPost(op.get());
        if(username!=null) {
            userRepository.findByUsername(username).ifPresent(c::setUser);
        }
        c.setContent(content);
        c.setCreatedAt(LocalDateTime.now());
        commentRepository.save(c);
        return ResponseEntity.status(201).body(c);
    }
}
