package com.example.levelcreator.model;

public class DataPair {
    private int projectId;
    private String username;

    public DataPair() {
        super();
    }

    public DataPair(int projectId, String username) {
        this.projectId = projectId;
        this.username = username;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "DataPair{" +
                "projectId=" + projectId +
                ", username='" + username + '\'' +
                '}';
    }
}
