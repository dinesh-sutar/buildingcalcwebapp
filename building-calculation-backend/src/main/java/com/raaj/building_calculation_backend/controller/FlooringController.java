package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.FlooringRequest;
import com.raaj.building_calculation_backend.dto.FlooringResponse;
import com.raaj.building_calculation_backend.service.FlooringService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/floorings")
@RequiredArgsConstructor
public class FlooringController {

    private final FlooringService service;

    @GetMapping
    public ResponseEntity<List<FlooringResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlooringResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FlooringResponse> create(
            @RequestBody FlooringRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlooringResponse> update(
            @PathVariable Long id,
            @RequestBody FlooringRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}