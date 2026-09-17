package com.raaj.building_calculation_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raaj.building_calculation_backend.entity.BoundaryTypes;

public interface BoundaryTypesRepository extends JpaRepository<BoundaryTypes, Long> {

    Optional<BoundaryTypes> findByCode(String code);

    Optional<BoundaryTypes> findByName(String name);

    boolean existsByCode(String code);

    boolean existsByName(String name);

}
