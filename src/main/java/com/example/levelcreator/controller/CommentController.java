package com.example.levelcreator.controller;

import com.example.levelcreator.model.Comment;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.service.CommentService;
import com.example.levelcreator.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
//import sun.misc.BASE64Decoder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;


@Controller
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/saveComment/{id}")
    public String saveComment(@PathVariable int id, Comment comment, Authentication authentication) {
        Project project = projectService.getProjectById(id);
        //project.getCommentList().add(comment);
        commentService.saveComment(comment,authentication,project);
        //projectService.save(project);
        return "redirect:/project/{id}";
    }

    @GetMapping(value = "/delComment/{id}")
    public String delete(@PathVariable int id) {
        //Project project = projectService.getProjectById(id);
        Comment comment  = commentService.getCommentById(id);
        Project project = comment.getProject();
        int theID = project.getId();
        //project.getCommentList().remove(comment);
        commentService.deleteComment(id);
        //projectService.save(project);
        return "redirect:/project/"+ theID;
    }

//    @GetMapping(value = "/download/{id}")
//    public ResponseEntity<byte[]> download(@PathVariable int id) throws IOException {
//        Project proj = projectService.getProjectById(id);
//        BASE64Decoder decoder = new BASE64Decoder();
//        byte[] imageBytes = decoder.decodeBuffer(proj.getScreenshot().replace("data:image/png;base64,",""));
//        ByteArrayOutputStream baos = new ByteArrayOutputStream(imageBytes.length);
//        baos.write(imageBytes, 0, imageBytes.length);
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", "image/png");
//        headers.set("Content-Disposition", "attachment; filename = map.png");
//        return new ResponseEntity<byte[]>(baos.toByteArray(), headers, HttpStatus.OK);
//    }
}


