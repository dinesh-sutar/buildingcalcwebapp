package com.raaj.building_calculation_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FloorTypeRequest {

    private String code;

    private String name;

    private Integer displayOrder;

    private Boolean active;
}