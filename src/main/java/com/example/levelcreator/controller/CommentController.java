package com.example.levelcreator.controller;

import com.example.levelcreator.model.Comment;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.service.CommentService;
import com.example.levelcreator.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ProjectService projectService;


    @PostMapping("/saveComment/{id}")
    public String saveComment(@PathVariable int id, Comment comment, Authentication authentication) {
        Project project = projectService.getProjectById(id);
        project.getCommentList().add(comment);
        commentService.saveComment(comment,authentication,project);
        return "redirect:/project/{id}";
    }

    @GetMapping(value = "/delComment/{id}")
    public String delete(@PathVariable int id) {
        Comment comment  = commentService.getCommentById(id);
        commentService.deleteComment(id);
        return "redirect:/project/{id}";
    }
/*
    @GetMapping(value = "/download/{id}")
    public ResponseEntity download(@PathVariable int id) {
        Project proj = projectService.getProjectById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/json"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = map.json")
                .body(proj.getMapJSON());
    }*/
}


