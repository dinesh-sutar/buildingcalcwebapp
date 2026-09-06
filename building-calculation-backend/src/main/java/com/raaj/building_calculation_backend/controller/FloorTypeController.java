package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.FloorTypeRequest;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.service.FloorTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/floor-types")
@RequiredArgsConstructor
public class FloorTypeController {

    private final FloorTypeService service;

    @GetMapping
    public ResponseEntity<List<FloorType>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloorType> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FloorType> create(
            @RequestBody FloorTypeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FloorType> update(
            @PathVariable Long id,
            @RequestBody FloorTypeRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}