package com.example.levelcreator.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

@Entity
@Table(name = "lc_map")
public class Map {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "mapJson")
    private String mapJSON;

    public Map(){
        super();
    }

    public Map(String mapJSON) {
        super();
        this.mapJSON = mapJSON;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMapJSON() {
        return mapJSON;
    }

    public void setMapJSON(String mapJSON) {
        this.mapJSON = mapJSON;
    }
}
