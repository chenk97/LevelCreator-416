package com.example.levelcreator.model;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "lc_tileset")
public class Tileset {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

//    @ManyToOne
//    @JoinColumn(name = "map_id", nullable = false)
//    private Map map;

    @Lob
    @NotBlank
    //image stored as base64 byte[] string
    private String image;

//    private int firstGid;

    public Tileset(){
        super();
    }

    public Tileset(Map map, int firstGid, String image) {
        super();
//        this.map = map;
        this.image = image;
//        this.firstGid = firstGid;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

//    public Map getMap() {
//        return map;
//    }
//
//    public void setMap(Map map) {
//        this.map = map;
//    }

//    public int getFirstGid() {
//        return firstGid;
//    }
//
//    public void setFirstGid(int firstGid) {
//        this.firstGid = firstGid;
//    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
