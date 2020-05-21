package com.example.levelcreator.controller;


import com.example.levelcreator.model.Comment;
import com.example.levelcreator.model.DataPair;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.CommentService;
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

    @Autowired
    private CommentService commentService;


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
    public ModelAndView showUserProject(Authentication authentication, @RequestParam(required = false) String name) {
        ModelAndView modelAndView = new ModelAndView();
        List<Project> projects = new ArrayList<Project>();
        try {
            projects = projectService.getProjectByUserandName(authentication, name);
            Collections.sort(projects, new customComparator());
        } catch (Exception e) {
            e.printStackTrace();
        }
        modelAndView.addObject("projects", projects);
        return modelAndView;
    }


    @GetMapping("/teamWork")
    public ModelAndView showTeamProject(Authentication authentication) {
        ModelAndView modelAndView = new ModelAndView();
        Set<Project> teamWorks = new HashSet<Project>();
        try {
            User user = authenticationService.getPrincipal(authentication);
            teamWorks = user.getProjectList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        modelAndView.addObject("teamWorks", teamWorks);
        return modelAndView;
    }


    //    Display public project in home screen
    @GetMapping("/home")
    public ModelAndView showHomePage(@RequestParam(required = false) String name) {
        ModelAndView modelAndView = new ModelAndView();
        List<Project> projects = new ArrayList<Project>();
        try {
            projects = projectService.getProjectByTypeAndName("true", name);
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
        System.out.println("new project"+newProject);
        Project project = projectService.saveProjectNew(newProject, authentication);
        System.out.println("saved project"+project);
        String str = String.format("/workspace/%d", project.getId());
        return str;
    }


    @RequestMapping(value = "/workspace/{id}", method = RequestMethod.GET)
    public String loadProject(@PathVariable int id, Authentication authentication, Model model) {
//        ModelAndView modelAndView = new ModelAndView();
        Project project = projectService.getProjectById(id);
        System.out.println("***currentProject***:"+project.getName());
        //current user
        User principal = authenticationService.getPrincipal(authentication);
        //get owner of project
        User owner = project.getUser();
        Set<User> collaborators = project.getCollaborators();
        System.out.println("***collaborators***: "+collaborators);
        model.addAttribute("theProject",project);
        model.addAttribute("user", principal);
        model.addAttribute("project", project);
        model.addAttribute("collaborators", collaborators);
        if(principal.equals(owner)){
            System.out.println("Current user is owner!");
            model.addAttribute("isOwner", true);
        }
        return "workspace";
    }



    @RequestMapping(value="/workspace/addCollaborator", method=RequestMethod.POST)
    public String addCollaborator(@RequestBody DataPair dataPair, Model model) {
        System.out.println("#####get value pair for add#####");
        Project project = projectService.getProjectById(dataPair.getProjectId());
        User collaborator = userService.getUserByUsername(dataPair.getUsername());
        if(collaborator!=null){
            userService.addCollaborativeWork(collaborator,project);
        }else{
            model.addAttribute("UserNotExist", true);
        }
        Set<User> collaborators = project.getCollaborators();
        model.addAttribute("collaborators", collaborators);
        return "fragments::collaborators";
    }


    @RequestMapping(value="/workspace/removeCollaborator", method=RequestMethod.POST)
    public String removeCollaborator(@RequestBody DataPair dataPair, Model model) {
        System.out.println("#####get value pair for delete#####");
        Project project = projectService.getProjectById(dataPair.getProjectId());
        User collaborator = userService.getUserByUsername(dataPair.getUsername());
        collaborator.getProjectList().remove(project);
        project.getCollaborators().remove(collaborator);
        userService.save(collaborator);
        Set<User> collaborators = project.getCollaborators();
        model.addAttribute("collaborators", collaborators);
        return "fragments::collaborators";
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

    //Update delete new project from database if user doesn't want to save.
    @RequestMapping(value = "/deleteNewProject", method = RequestMethod.PUT)
    public @ResponseBody
    void deleteNewProject(@RequestBody int theId) {
        projectService.deleteProject(theId);
    }

    @RequestMapping(value = "/getMyProject/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String getProjectByProject(@RequestBody int theId) {
        System.out.println("HIIIIIIIIIIIIIIIIIIIIII!!!!!!!!!!!!!!!!!!!!!!!!!!!111");
        Project theProject = projectService.getProjectById(theId);
        return theProject.getCanvasJSON();
    }


    @GetMapping(value = "/myWork/delete/{id}")
    public String delete(@PathVariable int id) {
        Project project = projectService.getProjectById(id);
        commentService.deleteCommentsPerProj(id);
        projectService.save(project);
        //remove collaborator relationship
        for(User collaborator: project.getCollaborators()){
            collaborator.getProjectList().remove(project);
            project.getCollaborators().remove(collaborator);
            userService.save(collaborator);
        }
        projectService.deleteProject(id);
        return "redirect:/myWork";
    }

    @RequestMapping("/project/{id}")
    public String getProject(@PathVariable int id) {
        Project proj = projectService.getProjectById(id);
        System.out.println("currentProject:"+proj.getName());
        return "project";
    }

    @GetMapping("/project/{id}")
    public ModelAndView returnCurProj(@PathVariable int id, Authentication authentication){
        User principal = authenticationService.getPrincipal(authentication);
        ModelAndView model = new ModelAndView("project");
        Project proj = projectService.getProjectById(id);
        List<Comment> comments = new ArrayList<Comment>();
        comments = commentService.getCommentsPerProj(proj);
        model.addObject("user",principal);
        model.addObject("comments", comments);
        model.addObject("proj",proj);
        return model;
    }


    @ModelAttribute("comment")
    public Comment getComment(){
        return new Comment();
    }


    @GetMapping(value = "/downloadJson/{id}")
    public ResponseEntity download(@PathVariable int id) {
        Project proj = projectService.getProjectById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = map.json")
                .body(proj.getMapJSON());
    }
}

