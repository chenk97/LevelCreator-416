package com.example.levelcreator.model;

import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "project")
public class Project {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type")
    private String type;

    @Lob
    @NotBlank
    //image stored as base64 byte[] string
    private String screenshot;

    @Column(name = "createdDate")
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdDate;

    @Lob
    @Column(name = "mapJson")
    private String mapJSON;

    @Lob
    @Column(name = "canvasJson")
    private String canvasJSON;


    @Column
    private int likes;

    @ManyToOne
    @JoinColumn(name = "owner", nullable = false)
    private User user;

//    @OneToOne
//    @JoinColumn(name = "map_id", referencedColumnName = "id")
//    private Map map;

    @ManyToMany(mappedBy = "projectList")
    private Set<User> collaborators;

    public Project(){
        super();
    }

    public Project(Integer id, String name, String type, @NotBlank String screenshot, Date createdDate, String mapJSON,
                   String canvasJSON, int likes, User user, Set<User> collaborators) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.screenshot = screenshot;
        this.createdDate = createdDate;
        this.mapJSON = mapJSON;
        this.canvasJSON = canvasJSON;
        this.likes = likes;
        this.user = user;
        this.collaborators = collaborators;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getScreenshot() {
        return screenshot;
    }

    public void setScreenshot(String screenshot) {
        this.screenshot = screenshot;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getMapJSON() {
        return mapJSON;
    }

    public void setMapJSON(String mapJSON) {
        this.mapJSON = mapJSON;
    }

    public String getCanvasJSON() {
        return canvasJSON;
    }

    public void setCanvasJSON(String canvasJSON) {
        this.canvasJSON = canvasJSON;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

//    public Map getMap() {
//        return map;
//    }
//
//    public void setMap(Map map) {
//        this.map = map;
//    }

    public Set<User> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(Set<User> collaborators) {
        this.collaborators = collaborators;
    }
}
