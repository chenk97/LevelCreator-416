package com.example.levelcreator.service;

import com.example.levelcreator.model.Map;
import com.example.levelcreator.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
public class MapService {

    @Autowired
    private MapRepository mapRepo;

    public Map getMapById(int id){
        return mapRepo.findById(id).get();
    }

    public Map save(Map map){
        mapRepo.save(map);
        return map;
    }

    public List<Map> findAllMaps(){
        return mapRepo.findAll();
    }
}
