package com.raaj.building_calculation_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BuildingFloorRate;

public interface BuildingFloorRateRepository
        extends JpaRepository<BuildingFloorRate, Long> {

    boolean existsByBuildingTypeIdAndFloorTypeIdAndComponentFloorTypeId(
            Long buildingTypeId,
            Long floorTypeId,
            Long componentFloorTypeId);

            List<BuildingFloorRate> findByBuildingTypeIdAndFloorTypeIdAndActiveTrue(
            Long buildingTypeId,
            Long floorTypeId);
}