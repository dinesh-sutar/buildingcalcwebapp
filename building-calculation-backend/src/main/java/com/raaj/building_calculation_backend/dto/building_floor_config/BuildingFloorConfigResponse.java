package com.raaj.building_calculation_backend.dto.building_floor_config;

import com.raaj.building_calculation_backend.dto.building_type.BuildingTypeResponse;
import com.raaj.building_calculation_backend.dto.floor.FloorTypeResponse;
import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeResponse;
import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorConfigResponse {

    private Long id;

    private StructureTypeResponse structureType;

    private BuildingTypeResponse buildingType;

    private FloorTypeResponse floorType;

    private Boolean enabled;

    public static BuildingFloorConfigResponse from(BuildingFloorConfig entity) {
        return new BuildingFloorConfigResponse(
                entity.getId(),
                StructureTypeResponse.from(entity.getStructureType()),
                BuildingTypeResponse.from(entity.getBuildingType()),
                FloorTypeResponse.from(entity.getFloorType()),
                entity.getEnabled());
    }
}