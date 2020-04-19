package com.example.levelcreator.model;

import java.util.List;

public class Layer {

    private Integer layerId;

    private int xOrigin;

    private int yOrigin;

    private int width;

    private int height;

    private boolean visible;

    private boolean editable;//for lock

    private List<Property> properties;

    public Layer(){
        super();
    }

    public Layer(Integer layerId, int xOrigin, int yOrigin, int width, int height,
                 boolean visible, boolean editable, List<Property> properties) {
        super();
        this.layerId = layerId;
        this.xOrigin = xOrigin;
        this.yOrigin = yOrigin;
        this.width = width;
        this.height = height;
        this.visible = visible;
        this.editable = editable;
        this.properties = properties;
    }

    public Integer getLayerId() {
        return layerId;
    }

    public void setLayerId(Integer layerId) {
        this.layerId = layerId;
    }

    public int getxOrigin() {
        return xOrigin;
    }

    public void setxOrigin(int xOrigin) {
        this.xOrigin = xOrigin;
    }

    public int getyOrigin() {
        return yOrigin;
    }

    public void setyOrigin(int yOrigin) {
        this.yOrigin = yOrigin;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public List<Property> getProperties() {
        return properties;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }
}
