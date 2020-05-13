package com.example.levelcreator.repository;

import com.example.levelcreator.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    @Override
    List<Project> findAll();
}

