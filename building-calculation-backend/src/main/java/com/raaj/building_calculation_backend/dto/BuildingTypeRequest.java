package com.raaj.building_calculation_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingTypeRequest {

    private String code;

    private String name;

    private Boolean active;
}