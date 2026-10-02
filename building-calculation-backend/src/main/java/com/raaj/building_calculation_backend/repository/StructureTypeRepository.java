package com.raaj.building_calculation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.StructureType;

public interface StructureTypeRepository extends JpaRepository<StructureType, Long> {

    boolean existsByCode(String code);

    boolean existsByName(String name);
}