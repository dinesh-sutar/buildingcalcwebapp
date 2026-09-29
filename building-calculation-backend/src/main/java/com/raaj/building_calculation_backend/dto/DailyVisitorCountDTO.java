package com.raaj.building_calculation_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DailyVisitorCountDTO {

    private LocalDate date;
    private Long visitorCount;
}