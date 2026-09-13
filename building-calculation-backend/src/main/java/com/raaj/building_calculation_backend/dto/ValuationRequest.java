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
public class ValuationRequest {

    private Long buildingTypeId;

    // the floor "selection" - Duplex / Triplex / Ground / First / ... (matches BuildingFloorConfig.floorType)
    private Long floorTypeId;

    private Long flooringId;

    private Long gstOptionId;

    private BigDecimal totalValue;   // a - declared/registered total value
    private BigDecimal area;         // b - total built-up area, used to derive the base value h
    private BigDecimal ratePerSqft;  // c - govt/circle rate per sqft

    private BigDecimal boundaryCost; // null/0 if the boundary checkbox is off
    private BigDecimal parkingCost;  // null/0 if the parking checkbox is off

    // one entry per actual floor (Ground/First/Second/...) that's part of the selection
    private List<FloorAreaInput> floorAreas;
}
