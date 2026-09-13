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
public class FloorAreaInput {

    private Long componentFloorTypeId; // the actual floor this area belongs to: Ground/First/Second/...

    private BigDecimal area;
}
