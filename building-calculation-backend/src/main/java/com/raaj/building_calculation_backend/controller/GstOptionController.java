package com.raaj.building_calculation_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raaj.building_calculation_backend.dto.GstOptionRequest;
import com.raaj.building_calculation_backend.dto.GstOptionResponse;
import com.raaj.building_calculation_backend.service.GstOptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gst-options")
@RequiredArgsConstructor
public class GstOptionController {

    private final GstOptionService service;

    @GetMapping
    public ResponseEntity<List<GstOptionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GstOptionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<GstOptionResponse> create(
            @RequestBody GstOptionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GstOptionResponse> update(
            @PathVariable Long id,
            @RequestBody GstOptionRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}