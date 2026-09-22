package com.raaj.building_calculation_backend.repository;

import com.raaj.building_calculation_backend.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {

    Optional<VisitorLog> findTopByVisitorOrderByVisitedAtDesc(
            com.raaj.building_calculation_backend.entity.Visitor visitor);

    boolean existsByVisitorAndVisitedAtAfter(
            com.raaj.building_calculation_backend.entity.Visitor visitor,
            LocalDateTime time);
}