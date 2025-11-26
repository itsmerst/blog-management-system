package com.example.blog.controller;

import com.example.blog.model.Tag;
import com.example.blog.repository.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    private final TagRepository tagRepository;
    public TagController(TagRepository tagRepository) { this.tagRepository = tagRepository; }

    @GetMapping
    public List<Tag> list() { return tagRepository.findAll(); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tag t) {
        if(t.getName()==null) return ResponseEntity.badRequest().body("missing");
        t.setSlug(t.getName().toLowerCase().replaceAll("[^a-z0-9]+","-"));
        return ResponseEntity.status(201).body(tagRepository.save(t));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tag t) {
        return tagRepository.findById(id).map(existing -> {
            if(t.getName()!=null) {
                existing.setName(t.getName());
                existing.setSlug(t.getName().toLowerCase().replaceAll("[^a-z0-9]+","-"));
            }
            return ResponseEntity.ok(tagRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if(!tagRepository.existsById(id)) return ResponseEntity.notFound().build();
        tagRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }
}
