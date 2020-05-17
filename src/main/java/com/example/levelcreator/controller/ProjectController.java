package com.example.levelcreator.controller;


import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.Response;
import com.example.levelcreator.model.User;
import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.levelcreator.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class ProjectController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private ProjectService projectService;

//    @RequestMapping("/myWork")
//    public String myWork() {
//        return "mywork.html";
//    }

    //Order projects by date newest to oldest
    public class customComparator implements Comparator<Project> {
        public int compare(Project o1, Project o2) {
            String date1 = o1.getCreatedDate();
            String date2 = o2.getCreatedDate();
            if (date1.compareTo(date2) > 0) {
                return -1;
            } else if (date1.compareTo(date2) < 0) {
                return 1;
            } else {
                return 0;
            }

        }
    }

    //Display users project in mywork screen
    @GetMapping("/myWork")
    public ModelAndView showUserProject(Authentication authentication) {
        ModelAndView modelAndView = new ModelAndView();
        List<Project> projects = new ArrayList<Project>();
        try {


            projects = projectService.getProjectByUser(authentication);
            Collections.sort(projects, new customComparator());


//            modelAndView.setViewName("mapResults");
        } catch (Exception e) {
            e.printStackTrace();
//            modelAndView.setViewName("error");
        }
        modelAndView.addObject("projects", projects);
        return modelAndView;
    }

    //    Display public project in home screen
    @GetMapping("/home")
    public ModelAndView showHomePage(Authentication authentication) {
        ModelAndView modelAndView = new ModelAndView();
        List<Project> projects = new ArrayList<Project>();
        try {
            projects = projectService.getProjectByType("true");
            Collections.sort(projects, new customComparator());
        } catch (Exception e) {
            e.printStackTrace();
        }
        modelAndView.addObject("projects", projects);
        return modelAndView;
    }

    //submitting the form with map preferences directs the user to the workspace page where they are able to start creating
//    @RequestMapping("/workspace")
//    public String submitNewProject() {
//        return "workspace";
//    }

    @RequestMapping(value = "/addProject", method = RequestMethod.POST)
    @ResponseBody
    public String addProject(@RequestBody Project newProject, Authentication authentication){
        System.out.println("**redirecting to workspace +++ POST**");
        System.out.println("new proj"+newProject);
        Project project = projectService.saveProjectNew(newProject, authentication);
        System.out.println("saved proj"+project);
        String str = String.format("/workspace/%d", project.getId());
        return str;
    }


    @RequestMapping(value = "/workspace/{id}", method = RequestMethod.GET)
    public String loadProject(@PathVariable int id, Authentication authentication, Model model) {
//        ModelAndView modelAndView = new ModelAndView();
        Project project = projectService.getProjectById(id);
        System.out.println("***currentProject***:"+project.toString());
        //current user
        User principal = authenticationService.getPrincipal(authentication);
        //get owner of project
        User owner = project.getUser();
        Set<User> collaborators = project.getCollaborators();
        System.out.println("***collaborators***: "+collaborators);
        model.addAttribute("user", principal);
        model.addAttribute("project", project);
        model.addAttribute("collaborators", collaborators);
        if(principal.equals(owner)){
            System.out.println("Current user is owner!");
            model.addAttribute("isOwner", true);
        }
        return "workspace";
    }


    // Saves project to database
    @RequestMapping(value = "/saveProject", method = RequestMethod.POST)
    public @ResponseBody
    void saveProject(@RequestBody Project newProject, Authentication authentication) {
        projectService.saveProjectNew(newProject, authentication);
    }

    // Update project in database
    @RequestMapping(value = "/updateProject", method = RequestMethod.PUT)
    public @ResponseBody
    void updateProject(@RequestBody Project newProject) {
        projectService.updateProject(newProject);
    }

    //Update project type in database
    @RequestMapping(value = "/togglePublic", method = RequestMethod.PUT)
    public @ResponseBody
    void updateProject(@RequestBody int theId) {
        projectService.updateType(theId);
    }

///////////////////////////////////////////
/*
    @GetMapping("/workspace")
    public ModelAndView getProject( int id) {
        Project project = projectService.getProjectById(id);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("project", project);
        return modelAndView;
    }
*/

    @GetMapping(value = "/download/{id}")
    public ResponseEntity download(@PathVariable int id) {
        //newProject = projectService.getProjectById(id);
        //ModelAndView model = new ModelAndView();
        //model.addObject("proj",newProject);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/json"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = map.json")
                .body(projectService.getProjectById(id).getMapJSON());
    }


    @GetMapping(value = "/myWork/delete/{id}")
    public String delete(@PathVariable int id) {
        projectService.deleteProject(id);
        return "redirect:/myWork";
    }
}

