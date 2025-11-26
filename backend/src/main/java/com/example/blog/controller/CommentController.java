package com.example.blog.controller;

import com.example.blog.model.Comment;
import com.example.blog.repository.CommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    public CommentController(CommentRepository commentRepository) { this.commentRepository = commentRepository; }

    @GetMapping
    public List<Comment> list() { return commentRepository.findAll(); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Comment c) {
        return commentRepository.findById(id).map(existing -> {
            if(c.getContent()!=null) existing.setContent(c.getContent());
            existing.setApproved(c.getApproved()!=null ? c.getApproved() : existing.getApproved());
            return ResponseEntity.ok(commentRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if(!commentRepository.existsById(id)) return ResponseEntity.notFound().build();
        commentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }
}
