package com.raaj.building_calculation_backend.dto.building_type;

import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeResponse;
import com.raaj.building_calculation_backend.entity.BuildingType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingTypeResponse {

    private Long id;
    private StructureTypeResponse structureType;
    private String code;
    private String name;
    private Boolean active;

    public static BuildingTypeResponse from(BuildingType entity) {
        return new BuildingTypeResponse(
                entity.getId(),
                StructureTypeResponse.from(entity.getStructureType()),
                entity.getCode(),
                entity.getName(),
                entity.getActive());
    }
}
