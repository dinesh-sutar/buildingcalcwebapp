package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.BuildingTypeRequest;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.service.BuildingTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/building-types")
@RequiredArgsConstructor
public class BuildingTypeController {

    private final BuildingTypeService service;

    @GetMapping
    public ResponseEntity<List<BuildingType>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingType> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BuildingType> create(
            @RequestBody BuildingTypeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingType> update(
            @PathVariable Long id,
            @RequestBody BuildingTypeRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}