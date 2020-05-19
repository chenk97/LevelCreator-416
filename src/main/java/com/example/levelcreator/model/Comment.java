package com.example.levelcreator.model;

import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "content")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdDate")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable=false)
    private User user;

    @ManyToOne(optional=true, fetch=FetchType.LAZY)
    @JoinColumn(name="REPLYTO_ID")
    private Comment replyTo;

    @OneToMany(mappedBy="replyTo")
    private List<Comment> replies = new ArrayList<Comment>();

    @ManyToOne
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    private Project project;

    public Comment(){
        super();
    }

    public Comment(String content, User user, Date date, Project project) {
        super();
        this.content = content;
        this.user = user;
        this.date = date;
        this.project = project;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
