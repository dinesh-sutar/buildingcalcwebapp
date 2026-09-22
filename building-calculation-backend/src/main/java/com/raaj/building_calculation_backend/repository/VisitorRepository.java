package com.raaj.building_calculation_backend.repository;

import com.raaj.building_calculation_backend.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findByVisitorCode(UUID visitorCode);
}