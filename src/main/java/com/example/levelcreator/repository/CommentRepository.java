package com.example.levelcreator.repository;

import com.example.levelcreator.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Override
    List<Comment> findAll();

    @Query(value = "SELECT * FROM Comment comment WHERE project_id =:projectId", nativeQuery = true)
    List<Comment> getAllComments(@Param("projectId") int id);

}
