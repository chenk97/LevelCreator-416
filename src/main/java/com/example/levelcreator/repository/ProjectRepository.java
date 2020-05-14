package com.example.levelcreator.repository;

import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.parameters.P;


import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    @Override
    List<Project> findAll();

    public List<Project> findByUser(User user);

    public List<Project> findByType(String type);
}

