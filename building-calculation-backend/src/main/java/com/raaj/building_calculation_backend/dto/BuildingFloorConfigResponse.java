// dto/BuildingFloorConfigResponse.java
package com.raaj.building_calculation_backend.dto;

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
    private BuildingTypeResponse buildingType;
    private FloorTypeResponse floorType;
    private Boolean enabled;

    public static BuildingFloorConfigResponse from(BuildingFloorConfig entity) {
        return new BuildingFloorConfigResponse(
                entity.getId(),
                BuildingTypeResponse.from(entity.getBuildingType()),
                FloorTypeResponse.from(entity.getFloorType()),
                entity.getEnabled());
    }
}