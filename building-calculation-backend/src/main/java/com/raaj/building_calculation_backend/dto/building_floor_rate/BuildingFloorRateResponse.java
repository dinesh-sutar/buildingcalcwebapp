package com.raaj.building_calculation_backend.dto.building_floor_rate;

import java.math.BigDecimal;

import com.raaj.building_calculation_backend.dto.building_type.BuildingTypeResponse;
import com.raaj.building_calculation_backend.dto.floor.FloorTypeResponse;
import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeResponse;
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

    private StructureTypeResponse structureType;

    private BuildingTypeResponse buildingType;

    private FloorTypeResponse floorType;

    private FloorTypeResponse componentFloorType;

    private BigDecimal baseRate;

    private Boolean active;

    public static BuildingFloorRateResponse from(BuildingFloorRate entity) {
        return new BuildingFloorRateResponse(
                entity.getId(),
                StructureTypeResponse.from(entity.getStructureType()),
                BuildingTypeResponse.from(entity.getBuildingType()),
                FloorTypeResponse.from(entity.getFloorType()),
                FloorTypeResponse.from(entity.getComponentFloorType()),
                entity.getBaseRate(),
                entity.getActive());
    }
}