package com.example.levelcreator.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

@Entity
@Table(name = "map")
public class Map {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "mapJson")
    private String mapJSON;

    @Column(name = "layersJson")
    private String layersJSON;

    @OneToMany(mappedBy = "map")
    private Set<Tileset> tilesetList;

    public Map(){
        super();
    }

    public Map(Integer id, String mapJSON, String layersJSON, Set<Tileset> tilsetList) {
        this.id = id;
        this.mapJSON = mapJSON;
        this.layersJSON = layersJSON;
        this.tilesetList = tilsetList;
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

    public String getLayersJSON() {
        return layersJSON;
    }

    public void setLayersJSON(String layersJSON) {
        this.layersJSON = layersJSON;
    }

    public Set<Tileset> getTilesetList() {
        return tilesetList;
    }

    public void setTilesetList(Set<Tileset> tilesetList) {
        this.tilesetList = tilesetList;
    }
}
