// dto/BuildingTypeResponse.java
package com.raaj.building_calculation_backend.dto.structure_type;

import com.raaj.building_calculation_backend.entity.StructureType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StructureTypeResponse {

    private Long id;
    private String code;
    private String name;
    private Boolean active;

    public static StructureTypeResponse from(StructureType entity) {
        return new StructureTypeResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getActive());
    }
}