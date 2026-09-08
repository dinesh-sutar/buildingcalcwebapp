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

import com.raaj.building_calculation_backend.dto.BuildingFloorRateRequest;
import com.raaj.building_calculation_backend.dto.BuildingFloorRateResponse;
import com.raaj.building_calculation_backend.service.BuildingFloorRateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/building-floor-rates")
@RequiredArgsConstructor
public class BuildingFloorRateController {

    private final BuildingFloorRateService service;

    @GetMapping
    public ResponseEntity<List<BuildingFloorRateResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingFloorRateResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BuildingFloorRateResponse> create(
            @RequestBody BuildingFloorRateRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingFloorRateResponse> update(
            @PathVariable Long id,
            @RequestBody BuildingFloorRateRequest request) {

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