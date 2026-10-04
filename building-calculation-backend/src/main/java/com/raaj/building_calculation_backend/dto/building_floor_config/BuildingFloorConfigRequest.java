package com.raaj.building_calculation_backend.dto.building_floor_config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorConfigRequest {

    private Long structureTypeId;

    private Long buildingTypeId;

    private Long floorTypeId;

    private Boolean enabled;
}