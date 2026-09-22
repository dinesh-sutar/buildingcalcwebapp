package com.raaj.building_calculation_backend.controller;

import com.raaj.building_calculation_backend.dto.VisitorResponse;
import com.raaj.building_calculation_backend.service.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping("/visitor")
    public ResponseEntity<VisitorResponse> trackVisitor(
            @RequestHeader(value = "X-Visitor-Id", required = false) UUID visitorId,

            HttpServletRequest request) {

        VisitorResponse response = visitorService.trackVisitor(
                visitorId,
                request);

        return ResponseEntity.ok(response);
    }
}