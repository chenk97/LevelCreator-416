package com.example.levelcreator.service;

import com.example.levelcreator.model.Comment;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.CommentRepository;
import com.example.levelcreator.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private AuthenticationService authenticationService;

    public Comment saveComment(Comment comment, Authentication authentication, Project project){
        try {
            User user = authenticationService.getPrincipal(authentication);
            Date date = new Date();
            //SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            comment.setDate(date);
            comment.setUser(user);
            comment.setProject(project);
            commentRepository.save(comment);
            return comment;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }
    public List<Comment> getCommentsPerProj(Project project){
        return commentRepository.getAllComments(project.getId());
    }
}
