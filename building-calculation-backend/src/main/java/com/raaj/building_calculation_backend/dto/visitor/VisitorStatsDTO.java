package com.raaj.building_calculation_backend.dto.visitor;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitorStatsDTO {

    private String period;
    private Long visitorCount;
}