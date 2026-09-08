// dto/BuildingFloorRateResponse.java
package com.raaj.building_calculation_backend.dto;

import java.math.BigDecimal;

import com.raaj.building_calculation_backend.entity.BuildingFloorRate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorRateResponse {

    private Long id;
    private BuildingTypeResponse buildingType;
    private FloorTypeResponse floorType;
    private FloorTypeResponse componentFloorType;
    private BigDecimal baseRate;
    private Boolean active;

    public static BuildingFloorRateResponse from(BuildingFloorRate entity) {
        return new BuildingFloorRateResponse(
                entity.getId(),
                BuildingTypeResponse.from(entity.getBuildingType()),
                FloorTypeResponse.from(entity.getFloorType()),
                FloorTypeResponse.from(entity.getComponentFloorType()),
                entity.getBaseRate(),
                entity.getActive());
    }
}