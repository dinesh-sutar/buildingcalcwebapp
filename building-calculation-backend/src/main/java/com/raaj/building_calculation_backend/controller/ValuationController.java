package com.raaj.building_calculation_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raaj.building_calculation_backend.dto.ValuationRequest;
import com.raaj.building_calculation_backend.dto.ValuationResponse;
import com.raaj.building_calculation_backend.service.ValuationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/valuation")
@RequiredArgsConstructor
public class ValuationController {

    private final ValuationService service;

    @PostMapping
    public ResponseEntity<ValuationResponse> calculate(@RequestBody ValuationRequest request) {
        return ResponseEntity.ok(service.calculate(request));
    }
}
