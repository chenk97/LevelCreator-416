package com.example.levelcreator.repository;

import com.example.levelcreator.model.Map;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<Map, Integer> {
}
