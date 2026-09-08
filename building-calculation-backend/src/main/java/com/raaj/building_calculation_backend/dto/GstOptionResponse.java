// dto/GstOptionResponse.java
package com.raaj.building_calculation_backend.dto;

import java.math.BigDecimal;

import com.raaj.building_calculation_backend.entity.GstOption;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GstOptionResponse {

    private Long id;
    private String code;
    private String name;
    private BigDecimal rate;
    private Boolean active;

    public static GstOptionResponse from(GstOption entity) {
        return new GstOptionResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getRate(),
                entity.getActive());
    }
}