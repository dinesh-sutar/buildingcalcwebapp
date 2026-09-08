// dto/BuildingTypeResponse.java
package com.raaj.building_calculation_backend.dto;

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
    private String code;
    private String name;
    private Boolean active;

    public static BuildingTypeResponse from(BuildingType entity) {
        return new BuildingTypeResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getActive());
    }
}