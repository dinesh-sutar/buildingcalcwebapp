package com.raaj.building_calculation_backend.controller;

import com.raaj.building_calculation_backend.dto.BoundaryTypesRequest;
import com.raaj.building_calculation_backend.entity.BoundaryTypes;
import com.raaj.building_calculation_backend.service.BoundaryTypesService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boundary-types")
@RequiredArgsConstructor
public class BoundaryTypesController {

    private final BoundaryTypesService service;

    // CREATE
    @PostMapping
    public ResponseEntity<BoundaryTypes> create(
            @Valid @RequestBody BoundaryTypesRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<BoundaryTypes>> getAll() {

        return ResponseEntity.ok(service.getAll());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<BoundaryTypes> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<BoundaryTypes> update(
            @PathVariable Long id,
            @Valid @RequestBody BoundaryTypesRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}