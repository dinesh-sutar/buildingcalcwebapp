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
public class FloorCostOutput {

    private Long componentFloorTypeId;
    private String componentFloorTypeName;
    private BigDecimal cost;
}
