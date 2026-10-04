package com.raaj.building_calculation_backend.dto.structure_type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StructureTypeRequest {

    private String code;

    private String name;

    private Boolean active;
}