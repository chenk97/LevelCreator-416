package com.example.levelcreator.model;

import java.util.ArrayList;
import java.util.List;

public class TileLayer  extends Layer{

    private ArrayList<Integer> data;

    public TileLayer() {
        super();
    }

    public TileLayer(Integer layerId, int xOrigin, int yOrigin, int width, int height, boolean visible, boolean editable, List<Property> properties, ArrayList<Integer> data) {
        super(layerId, xOrigin, yOrigin, width, height, visible, editable, properties);
        this.data = data;
    }

    public ArrayList<Integer> getData() {
        return data;
    }

    public void setData(ArrayList<Integer> data) {
        this.data = data;
    }

}
