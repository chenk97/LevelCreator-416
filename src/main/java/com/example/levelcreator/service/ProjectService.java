package com.example.levelcreator.service;

import com.example.levelcreator.model.Map;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.ProjectRepository;
import com.example.levelcreator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;


@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private AuthenticationService authenticationService;

    public Project saveProject(Map map, Authentication authentication){

        User user = authenticationService.getPrincipal(authentication);
        Project project = new Project();
        project.setUser(user);
        project.setMap(map);
        return project;
    }

}
