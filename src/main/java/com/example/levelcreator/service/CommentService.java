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
            Comment newComment = new Comment();
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm");
            newComment.setDate(ft.format(date));
            newComment.setUser(user);
            newComment.setProject(project);
            newComment.setContent(comment.getContent());

            commentRepository.save(newComment);
            return newComment;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public List<Comment> getCommentsPerProj(Project project){
        return commentRepository.getAllComments(project.getId());
    }

    public Comment getCommentById(int id) {
        return commentRepository.findById(id).get();
    }

    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }

    public void deleteCommentsPerProj(Integer id){commentRepository.deleteAllComments(id);}
}
