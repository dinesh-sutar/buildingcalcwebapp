package com.raaj.building_calculation_backend.controller;

import com.raaj.building_calculation_backend.constant.VisitorPeriod;
import com.raaj.building_calculation_backend.dto.VisitorResponse;
import com.raaj.building_calculation_backend.dto.VisitorStatsDTO;
import com.raaj.building_calculation_backend.service.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
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

    @GetMapping("/stats")
    public List<VisitorStatsDTO> getVisitorStats(

            @RequestParam(required = false, defaultValue = "DAILY") VisitorPeriod period,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return visitorService.getVisitorStats(
                period,
                from,
                to);
    }
}