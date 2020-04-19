package com.example.levelcreator.model;

import java.util.List;

public class ObjectLayer extends Layer{

    private List<Item> items;


    public ObjectLayer(){
        super();
    }

    public ObjectLayer(Integer layerId, int xOrigin, int yOrigin, int width, int height, boolean visible, boolean editable, List<Property> properties, List<Item> items) {
        super(layerId, xOrigin, yOrigin, width, height, visible, editable, properties);
        this.items = items;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
