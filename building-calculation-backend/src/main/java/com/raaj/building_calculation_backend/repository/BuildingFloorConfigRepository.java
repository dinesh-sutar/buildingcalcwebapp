package com.raaj.building_calculation_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;

public interface BuildingFloorConfigRepository extends JpaRepository<BuildingFloorConfig, Long> {

    boolean existsByBuildingTypeIdAndFloorTypeId(Long buildingTypeId, Long floorTypeId);

    Optional<BuildingFloorConfig> findByBuildingTypeIdAndFloorTypeId(Long buildingTypeId, Long floorTypeId);

}
