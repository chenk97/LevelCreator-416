package com.example.levelcreator.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MapController {

    @RequestMapping("/customizeTileset")
    public String literallyCanvas(){
        return "lc.html";
    }


}
