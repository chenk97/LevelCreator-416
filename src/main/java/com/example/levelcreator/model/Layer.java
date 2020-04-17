package com.example.levelcreator.model;

import java.util.List;

public class Layer {

    private Integer layerId;

    private List<Integer> data;

    public Layer(){
        super();
    }

    public Layer(Integer layerId, List<Integer> data) {
        super();
        this.layerId = layerId;
        this.data = data;
    }
}
