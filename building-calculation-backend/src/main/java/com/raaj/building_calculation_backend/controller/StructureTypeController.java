package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeRequest;
import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeResponse;
import com.raaj.building_calculation_backend.service.StructureTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/building-types")
@RequiredArgsConstructor
public class StructureTypeController {

    private final StructureTypeService service;

    @GetMapping
    public ResponseEntity<List<StructureTypeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StructureTypeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StructureTypeResponse> create(
            @RequestBody StructureTypeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StructureTypeResponse> update(
            @PathVariable Long id,
            @RequestBody StructureTypeRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}