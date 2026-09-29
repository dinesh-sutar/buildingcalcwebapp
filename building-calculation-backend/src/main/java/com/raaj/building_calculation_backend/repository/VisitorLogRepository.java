package com.raaj.building_calculation_backend.repository;

import com.raaj.building_calculation_backend.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {

        Optional<VisitorLog> findTopByVisitorOrderByVisitedAtDesc(
                        com.raaj.building_calculation_backend.entity.Visitor visitor);

        boolean existsByVisitorAndVisitedAtAfter(
                        com.raaj.building_calculation_backend.entity.Visitor visitor,
                        LocalDateTime time);

        // DAILY
        @Query(value = """
                        SELECT
                            DATE(v.visited_at) AS period,
                            COUNT(DISTINCT v.visitor_id) AS visitor_count
                        FROM visitor_logs v
                        GROUP BY DATE(v.visited_at)
                        ORDER BY DATE(v.visited_at)
                        """, nativeQuery = true)
        List<Object[]> getDailyVisitorCount();

        // MONTHLY
        @Query(value = """
                        SELECT
                            TO_CHAR(DATE_TRUNC('month', v.visited_at), 'YYYY-MM') AS period,
                            COUNT(DISTINCT v.visitor_id) AS visitor_count
                        FROM visitor_logs v
                        GROUP BY DATE_TRUNC('month', v.visited_at)
                        ORDER BY DATE_TRUNC('month', v.visited_at)
                        """, nativeQuery = true)
        List<Object[]> getMonthlyVisitorCount();

        // YEARLY
        @Query(value = """
                        SELECT
                            TO_CHAR(DATE_TRUNC('year', v.visited_at), 'YYYY') AS period,
                            COUNT(DISTINCT v.visitor_id) AS visitor_count
                        FROM visitor_logs v
                        GROUP BY DATE_TRUNC('year', v.visited_at)
                        ORDER BY DATE_TRUNC('year', v.visited_at)
                        """, nativeQuery = true)
        List<Object[]> getYearlyVisitorCount();

        // CUSTOM RANGE
        @Query(value = """
                        SELECT
                            DATE(v.visited_at) AS period,
                            COUNT(DISTINCT v.visitor_id) AS visitor_count
                        FROM visitor_logs v
                        WHERE v.visited_at >= :fromDate
                          AND v.visited_at < :toDate
                        GROUP BY DATE(v.visited_at)
                        ORDER BY DATE(v.visited_at)
                        """, nativeQuery = true)
        List<Object[]> getCustomVisitorCount(
                        @Param("fromDate") LocalDate fromDate,
                        @Param("toDate") LocalDate toDate);
}