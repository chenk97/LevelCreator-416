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
import sun.misc.BASE64Decoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.util.Base64;


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

    @GetMapping(value = "/download/{id}")
    public ResponseEntity download(@PathVariable int id) {
        Project proj = projectService.getProjectById(id);
        byte[] imageBytes = decodeToImage(proj.getScreenshot());
//        HttpHeaders headers = new HttpHeaders();
//        headers.setCacheControl(CacheControl.noCache().getHeaderValue());
//        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
//        return responseEntity;
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = map.png")
                .body(imageBytes);
    }

    public static byte[] decodeToImage(String imageString) {
        System.out.println("*******imagestring*******"+imageString);
        BufferedImage image = null;
        byte[] imageByte = null;
        try {
            BASE64Decoder decoder = new BASE64Decoder();
            imageByte = decoder.decodeBuffer(imageString);
            System.out.println("*******imagebyte*******"+imageByte);
//            ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
//            image = ImageIO.read(bis);
//            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageByte;
    }
}


