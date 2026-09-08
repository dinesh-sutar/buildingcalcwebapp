package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.FloorTypeRequest;
import com.raaj.building_calculation_backend.dto.FloorTypeResponse;
import com.raaj.building_calculation_backend.service.FloorTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/floor-types")
@RequiredArgsConstructor
public class FloorTypeController {

    private final FloorTypeService service;

    @GetMapping
    public ResponseEntity<List<FloorTypeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloorTypeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FloorTypeResponse> create(
            @RequestBody FloorTypeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FloorTypeResponse> update(
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