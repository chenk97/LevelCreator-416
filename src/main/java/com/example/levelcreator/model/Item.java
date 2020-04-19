package com.example.levelcreator.model;

public class Item {

    private int id;

    private int gid;

    private double width;

    private double height;

    private double xCoordinate;

    private double yCoordinate;

    public Item(){
        super();
    }

    public Item(int id, int gid, double width, double height, double xCoordinate, double yCoordinate) {
        super();
        this.id = id;
        this.gid = gid;
        this.width = width;
        this.height = height;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }
}
