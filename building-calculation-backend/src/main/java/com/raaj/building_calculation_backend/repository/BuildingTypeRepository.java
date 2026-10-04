package com.raaj.building_calculation_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BuildingType;

public interface BuildingTypeRepository extends JpaRepository<BuildingType, Long> {

    List<BuildingType> findByStructureTypeId(Long structureTypeId);

    boolean existsByStructureTypeIdAndCode(Long structureTypeId, String code);

    boolean existsByStructureTypeIdAndName(Long structureTypeId, String name);
}
