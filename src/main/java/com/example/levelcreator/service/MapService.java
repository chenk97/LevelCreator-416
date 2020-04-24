package com.example.levelcreator.service;

import com.example.levelcreator.model.Map;
import com.example.levelcreator.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MapService {

    @Autowired
    private MapRepository mapRepo;

    public Map getMapById(int id){
        return mapRepo.findById(id).get();
    }

    public Map saveMap(){
        //get the json from localstorage and save
        Map map = new Map();
        mapRepo.save(map);
        return map;
    }
}
