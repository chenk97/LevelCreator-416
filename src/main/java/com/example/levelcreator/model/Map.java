package com.example.levelcreator.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.io.IOException;
import java.util.HashMap;

@Entity
@Table(name = "lc_map")
public class Map {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tileHeight", nullable = false)
    private int tileHeight;

    @Column(name = "tileWidth", nullable = false)
    private int tileWidth;

    @Column(name = "height", nullable = false)
    private int height;

    @Column(name = "width", nullable = false)
    private int width;

    @Column(name = "orientation", nullable = false)
    private String orientation;

    @Column(name = "map")
    private String mapJSON;

    public Map(){
        super();
    }

    public Map(int tileHeight, int tileWidth, int height, int width, String orientation, String mapJSON) {
        super();
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;
        this.height = height;
        this.width = width;
        this.orientation = orientation;
        this.mapJSON = mapJSON;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getTileHeight() {
        return tileHeight;
    }

    public void setTileHeight(int tileHeight) {
        this.tileHeight = tileHeight;
    }

    public int getTileWidth() {
        return tileWidth;
    }

    public void setTileWidth(int tileWidth) {
        this.tileWidth = tileWidth;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    public String getMapJSON() {
        return mapJSON;
    }

    public void setMapJSON(String mapJSON) {
        this.mapJSON = mapJSON;
    }
}
