package com.raaj.building_calculation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;

public interface BuildingFloorConfigRepository extends JpaRepository<BuildingFloorConfig, Long> {

    boolean existsByBuildingTypeIdAndFloorTypeId(Long buildingTypeId, Long floorTypeId);

}
