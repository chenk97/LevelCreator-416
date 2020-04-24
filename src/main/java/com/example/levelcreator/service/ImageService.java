package com.example.levelcreator.service;

import com.example.levelcreator.model.Tileset;
import com.example.levelcreator.repository.TilesetRepository;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    @Autowired
    public TilesetRepository tilesetRepo;

    public Tileset saveImage(byte[] imageArr){
        Tileset tileset = new Tileset();
        //need to get map_id and gid!
        String imageAsString= Base64.encodeBase64String(imageArr);
        tileset.setImage(imageAsString);
        tilesetRepo.save(tileset);
        return tileset;
    }
}
