package com.example.levelcreator.model;


import javax.persistence.*;

@Entity
@Table(name = "lc_tileset")
public class Tileset {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "imageHeight", nullable = false)
    private int imageHeight;

    @Column(name = "imageWidth", nullable = false)
    private int imageWidth;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = false)
    private Map map;

    public Tileset(){
        super();
    }

    public Tileset(int imageHeight, int imageWidth, Map map) {
        super();
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.map = map;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getImageHeight() {
        return imageHeight;
    }

    public void setImageHeight(int imageHeight) {
        this.imageHeight = imageHeight;
    }

    public int getImageWidth() {
        return imageWidth;
    }

    public void setImageWidth(int imageWidth) {
        this.imageWidth = imageWidth;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }
}
