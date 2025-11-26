package com.example.blog.controller;

import com.example.blog.model.Category;
import com.example.blog.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    public CategoryController(CategoryRepository categoryRepository) { this.categoryRepository = categoryRepository; }

    @GetMapping
    public List<Category> list() { return categoryRepository.findAll(); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Category c) {
        if(c.getName()==null) return ResponseEntity.badRequest().body("missing");
        c.setSlug(c.getName().toLowerCase().replaceAll("[^a-z0-9]+","-"));
        return ResponseEntity.status(201).body(categoryRepository.save(c));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Category c) {
        return categoryRepository.findById(id).map(existing -> {
            if(c.getName()!=null) {
                existing.setName(c.getName());
                existing.setSlug(c.getName().toLowerCase().replaceAll("[^a-z0-9]+","-"));
            }
            return ResponseEntity.ok(categoryRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if(!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }
}
