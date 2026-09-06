package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raaj.building_calculation_backend.dto.BuildingFloorConfigRequest;
import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;
import com.raaj.building_calculation_backend.service.BuildingFloorConfigService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/building-floor-configs")
@RequiredArgsConstructor
public class BuildingFloorConfigController {

    private final BuildingFloorConfigService service;

    @GetMapping
    public ResponseEntity<List<BuildingFloorConfig>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingFloorConfig> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BuildingFloorConfig> create(
            @RequestBody BuildingFloorConfigRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingFloorConfig> update(
            @PathVariable Long id,
            @RequestBody BuildingFloorConfigRequest request) {

        return ResponseEntity.ok(
                service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}