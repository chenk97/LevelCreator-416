package com.example.levelcreator.service;

import com.example.levelcreator.model.Map;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.ProjectRepository;
import com.example.levelcreator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.util.List;


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
//        project.setMap(map);
        return project;
    }

    /***this is probably how you save***/
    public Project saveProjectNew(Project project, Authentication authentication){
        try{
            User user = authenticationService.getPrincipal(authentication);
            project.setUser(user);
            projectRepo.save(project);
            return project;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }



    public List<Project> getProjects(){
        return projectRepo.findAll();
    }

    public Project getProjectById(int id){
        return projectRepo.findById(id).get();
    }

    public Project updateProject(Project project){
        try{
            Project proj = (Project)projectRepo.findById(project.getId()).get();
            proj.setType(project.getType());
            return proj;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

}
