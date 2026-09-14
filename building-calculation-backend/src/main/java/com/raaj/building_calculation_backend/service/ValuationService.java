package com.raaj.building_calculation_backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.FloorAreaInput;
import com.raaj.building_calculation_backend.dto.FloorCostOutput;
import com.raaj.building_calculation_backend.dto.ValuationRequest;
import com.raaj.building_calculation_backend.dto.ValuationResponse;
import com.raaj.building_calculation_backend.entity.BuildingFloorRate;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.entity.Flooring;
import com.raaj.building_calculation_backend.entity.GstOption;
import com.raaj.building_calculation_backend.repository.BuildingFloorConfigRepository;
import com.raaj.building_calculation_backend.repository.BuildingFloorRateRepository;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;
import com.raaj.building_calculation_backend.repository.FlooringRepository;
import com.raaj.building_calculation_backend.repository.GstOptionRepository;

import lombok.RequiredArgsConstructor;

/**
 * DB-backed replacement for the Android app's MainActivity button handler
 * (GST/boundary/parking back-calculation) and calculation.java's calcu()
 * (floor-cost split). Rates come from building_floor_rates / floorings /
 * gst_options instead of hardcoded arrays.
 */
@Service
@RequiredArgsConstructor
public class ValuationService {

    private final BuildingTypeRepository buildingTypeRepository;
    private final BuildingFloorConfigRepository buildingFloorConfigRepository;
    private final BuildingFloorRateRepository buildingFloorRateRepository;
    private final FlooringRepository flooringRepository;
    private final GstOptionRepository gstOptionRepository;

    // Not backed by a table yet - the app has always used a flat 40% markup for
    // "extra items" on top of the raw construction cost. Override with
    // building.calculation.extra-items-rate if that ever needs to change.
    @Value("${building.calculation.extra-items-rate:0.40}")
    private BigDecimal extraItemsRate;

    private static final int OUTPUT_SCALE = 2;

    public ValuationResponse calculate(ValuationRequest request) {

        buildingTypeRepository.findById(request.getBuildingTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "Building type not found: " + request.getBuildingTypeId()));

        buildingFloorConfigRepository
                .findByBuildingTypeIdAndFloorTypeId(request.getBuildingTypeId(), request.getFloorTypeId())
                .filter(config -> Boolean.TRUE.equals(config.getEnabled()))
                .orElseThrow(() -> new RuntimeException(
                        "Building type / floor selection combination is not enabled"));

        Flooring flooring = flooringRepository.findById(request.getFlooringId())
                .orElseThrow(() -> new RuntimeException("Flooring not found: " + request.getFlooringId()));

        GstOption gstOption = gstOptionRepository.findById(request.getGstOptionId())
                .orElseThrow(() -> new RuntimeException("GST option not found: " + request.getGstOptionId()));

        List<BuildingFloorRate> floorRates = buildingFloorRateRepository
                .findByBuildingTypeIdAndFloorTypeIdAndActiveTrue(
                        request.getBuildingTypeId(), request.getFloorTypeId());

        if (floorRates.isEmpty()) {
            throw new RuntimeException(
                    "No floor rates configured for building type " + request.getBuildingTypeId()
                            + " and floor selection " + request.getFloorTypeId());
        }

        Map<Long, BigDecimal> rateByComponentFloor = new HashMap<>();
        Map<Long, FloorType> componentFloorById = new HashMap<>();
        for (BuildingFloorRate rate : floorRates) {
            Long componentId = rate.getComponentFloorType().getId();
            rateByComponentFloor.put(componentId, rate.getBaseRate());
            componentFloorById.put(componentId, rate.getComponentFloorType());
        }

        BigDecimal boundaryCost = nvl(request.getBoundaryCost());
        BigDecimal parkingCost = nvl(request.getParkingCost());

        // --- Stage 1: base value h, rounded up to the next multiple of 10 ---
        BigDecimal h = request.getArea().multiply(request.getRatePerSqft()).setScale(0, RoundingMode.HALF_UP);

        BigDecimal totalValue = request.getTotalValue();
        boolean gstApplicable = gstOption.getRate() != null
                && gstOption.getRate().compareTo(BigDecimal.ZERO) > 0;
        // See note above: distinguishing "with land" from "without land" from
        // GstOption alone is fragile - adjust this to match your real seed codes,
        // or add a dedicated boolean column to GstOption.
        boolean withLand = gstApplicable && gstOption.getCode() != null
                && gstOption.getCode().toUpperCase().contains("WITH_LAND");

        System.out.println("GST Applicable: " + gstApplicable + ", withLand: " + withLand);

        BigDecimal buildingCost;
        BigDecimal extraItems;
        BigDecimal gstAmount;

        if (!gstApplicable) {
            BigDecimal g = totalValue.subtract(h).subtract(boundaryCost);
            BigDecimal d = divideFloor(g, extrasDivisor());
            BigDecimal f = d.subtract(parkingCost);
            BigDecimal ei = f.add(parkingCost).multiply(extraItemsRate);

            buildingCost = f;
            extraItems = ei.setScale(0, RoundingMode.CEILING);

            BigDecimal remainder = totalValue.subtract(
                    buildingCost.add(h).add(extraItems).add(boundaryCost).add(parkingCost));
            if (remainder.compareTo(BigDecimal.ZERO) != 0) {
                extraItems = extraItems.add(remainder);
            }
            gstAmount = BigDecimal.ZERO;

        } else {
            BigDecimal gstRateFraction = gstOption.getRate()
                    .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

            BigDecimal g = withLand ? totalValue : totalValue.subtract(h);
            BigDecimal d = divideFloor(g, BigDecimal.ONE.add(gstRateFraction)); // back out GST%

            BigDecimal subtractBeforeDivide = (withLand ? h : BigDecimal.ZERO).add(boundaryCost);
            BigDecimal i = divideFloor(d.subtract(subtractBeforeDivide), extrasDivisor()); // back out extras%
            BigDecimal j = i.subtract(parkingCost);

            BigDecimal ei = j.add(parkingCost).multiply(extraItemsRate);
            BigDecimal pw = ei.setScale(0, RoundingMode.CEILING);

            BigDecimal taxBase = j.add(pw).add(boundaryCost).add(parkingCost)
                    .add(withLand ? h : BigDecimal.ZERO);
            BigDecimal gst = taxBase.multiply(gstRateFraction).setScale(0, RoundingMode.CEILING);

            BigDecimal remainder = totalValue.subtract(
                    j.add(pw).add(gst).add(h).add(boundaryCost).add(parkingCost));
            gst = gst.add(remainder);

            buildingCost = j;
            extraItems = pw;
            gstAmount = gst;
        }

        // --- Stage 2: split buildingCost across floors, weighted by area x (baseRate +
        // flooringRate) ---
        Map<Long, BigDecimal> weights = new HashMap<>();
        BigDecimal totalWeight = BigDecimal.ZERO;
        for (FloorAreaInput input : request.getFloorAreas()) {
            BigDecimal baseRate = rateByComponentFloor.get(input.getComponentFloorTypeId());
            if (baseRate == null) {
                throw new RuntimeException(
                        "No configured rate for component floor type " + input.getComponentFloorTypeId()
                                + " under this building type / floor selection");
            }
            BigDecimal rate = baseRate.add(flooring.getRate());
            BigDecimal weight = input.getArea().multiply(rate);
            weights.put(input.getComponentFloorTypeId(), weight);
            totalWeight = totalWeight.add(weight);
        }

        BigDecimal ratio = totalWeight.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : buildingCost.divide(totalWeight, 10, RoundingMode.HALF_UP);

        List<FloorCostOutput> floorCosts = new ArrayList<>();
        BigDecimal allocated = BigDecimal.ZERO;
        Long lastKey = null;
        for (Map.Entry<Long, BigDecimal> entry : weights.entrySet()) {
            BigDecimal cost = entry.getValue().multiply(ratio).setScale(0, RoundingMode.HALF_UP);
            floorCosts.add(new FloorCostOutput(
                    entry.getKey(),
                    componentFloorById.get(entry.getKey()).getName(),
                    cost.setScale(OUTPUT_SCALE)));
            allocated = allocated.add(cost);
            lastKey = entry.getKey();
        }

        // fold any rounding drift into the last floor, same as the original app did
        BigDecimal drift = buildingCost.subtract(allocated);
        if (drift.compareTo(BigDecimal.ZERO) != 0 && lastKey != null) {
            for (FloorCostOutput output : floorCosts) {
                if (output.getComponentFloorTypeId().equals(lastKey)) {
                    output.setCost(output.getCost().add(drift).setScale(OUTPUT_SCALE));
                }
            }
        }

        ValuationResponse response = new ValuationResponse();
        response.setBuildingBaseValue(h.setScale(OUTPUT_SCALE));
        response.setBuildingCost(buildingCost.setScale(OUTPUT_SCALE));
        response.setExtraItemsCost(extraItems.setScale(OUTPUT_SCALE));
        response.setGstAmount(gstAmount.setScale(OUTPUT_SCALE));
        response.setBoundaryCost(boundaryCost.setScale(OUTPUT_SCALE));
        response.setParkingCost(parkingCost.setScale(OUTPUT_SCALE));
        response.setFloorCosts(floorCosts);
        response.setUndervalued(ratio.compareTo(BigDecimal.ONE) < 0);
        return response;
    }

    private BigDecimal extrasDivisor() {
        return BigDecimal.ONE.add(extraItemsRate);
    }

    private BigDecimal divideFloor(BigDecimal numerator, BigDecimal divisor) {
        return numerator.divide(divisor, 0, RoundingMode.FLOOR);
    }

    private BigDecimal roundUpToTen(BigDecimal value) {
        BigDecimal ten = BigDecimal.TEN;
        BigDecimal remainder = value.remainder(ten);
        return remainder.compareTo(BigDecimal.ZERO) == 0 ? value : value.add(ten.subtract(remainder));
    }

    private BigDecimal nvl(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
