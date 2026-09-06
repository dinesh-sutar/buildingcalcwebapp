package com.raaj.building_calculation_backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorRateRequest {

    private Long buildingTypeId;

    private Long floorTypeId;

    private Long componentFloorTypeId;

    private BigDecimal baseRate;

    private Boolean active;
}