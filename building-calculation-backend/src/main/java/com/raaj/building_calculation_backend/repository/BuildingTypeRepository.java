package com.raaj.building_calculation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BuildingType;

public interface BuildingTypeRepository extends JpaRepository<BuildingType, Long> {

    boolean existsByCode(String code);

    boolean existsByName(String name);
}