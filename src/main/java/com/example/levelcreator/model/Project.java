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
    //image stored as base64 byte[] string
    private String screenshot;

    @Column(name = "createdDate")
    private String createdDate;

    @Lob
    @Column(name = "mapJson")
    private String mapJSON;


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

    @OneToMany(mappedBy = "project_id")
    private Set<Comment> commentList;

    public Project(){
        super();
    }

    public Project(Integer id, String name, String type, @NotBlank String screenshot, String createdDate, String mapJSON,
                 User user, Set<User> collaborators, Set<Comment> commentList) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.screenshot = screenshot;
        this.createdDate = createdDate;
        this.mapJSON = mapJSON;

        this.likes = 0;
        this.user = user;
        this.collaborators = collaborators;
        this.commentList = commentList;
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

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getMapJSON() {
        return mapJSON;
    }

    public void setMapJSON(String mapJSON) {
        this.mapJSON = mapJSON;
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

    public Set<Comment> getCommentList(){
        return commentList;
    }

    public void setCommentList(Set<Comment> commentList){
        this.commentList = commentList;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", screenshot='" + screenshot + '\'' +
                ", createdDate='" + createdDate + '\'' +
                ", mapJSON='" + mapJSON + '\'' +
                ", likes=" + likes +
                ", user=" + user +
                ", collaborators=" + collaborators +
                '}';
    }
}
