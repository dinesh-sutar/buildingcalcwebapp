package com.raaj.building_calculation_backend.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValuationResponse {

    private BigDecimal buildingBaseValue; // h
    private BigDecimal buildingCost;      // x
    private BigDecimal extraItemsCost;    // pw
    private BigDecimal gstAmount;         // gst (0 when the GST option's rate is 0/null)
    private BigDecimal boundaryCost;
    private BigDecimal parkingCost;
    private List<FloorCostOutput> floorCosts;
    private boolean undervalued;          // declared value can't cover the configured floor rates
}
