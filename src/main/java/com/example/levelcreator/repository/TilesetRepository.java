package com.example.levelcreator.repository;

import com.example.levelcreator.model.Tileset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TilesetRepository extends JpaRepository<Tileset, Integer> {
}
