// dto/FloorTypeResponse.java
package com.raaj.building_calculation_backend.dto;

import com.raaj.building_calculation_backend.entity.FloorType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FloorTypeResponse {

    private Long id;
    private String code;
    private String name;
    private Integer displayOrder;
    private Boolean active;

    public static FloorTypeResponse from(FloorType entity) {
        return new FloorTypeResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getDisplayOrder(),
                entity.getActive());
    }
}