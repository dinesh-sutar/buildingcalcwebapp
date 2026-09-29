package com.raaj.building_calculation_backend.service;

import com.raaj.building_calculation_backend.constant.VisitorPeriod;
import com.raaj.building_calculation_backend.dto.VisitorResponse;
import com.raaj.building_calculation_backend.dto.VisitorStatsDTO;
import com.raaj.building_calculation_backend.entity.Visitor;
import com.raaj.building_calculation_backend.entity.VisitorLog;
import com.raaj.building_calculation_backend.repository.VisitorLogRepository;
import com.raaj.building_calculation_backend.repository.VisitorRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final VisitorLogRepository visitorLogRepository;

    private static final int LOG_DEDUPLICATION_SECONDS = 15;

    @Transactional
    public VisitorResponse trackVisitor(
            UUID visitorCode,
            HttpServletRequest request) {

        Visitor visitor;

        /*
         * Existing visitor
         */
        if (visitorCode != null) {

            visitor = visitorRepository
                    .findByVisitorCode(visitorCode)
                    .orElseGet(() -> createVisitor());
        }

        /*
         * New visitor
         */
        else {
            visitor = createVisitor();
        }

        /*
         * Check whether this visitor
         * already generated a log within
         * the last 15 seconds.
         */
        LocalDateTime threshold = LocalDateTime.now()
                .minusSeconds(LOG_DEDUPLICATION_SECONDS);

        boolean recentLog = visitorLogRepository.existsByVisitorAndVisitedAtAfter(
                visitor,
                threshold);

        if (!recentLog) {

            VisitorLog log = VisitorLog.builder()
                    .visitor(visitor)
                    .ipAddress(getClientIp(request))
                    .userAgent(request.getHeader("User-Agent"))
                    .pageUrl(request.getHeader("Referer"))
                    .referrer(request.getHeader("Referer"))
                    .visitedAt(LocalDateTime.now())
                    .build();

            visitorLogRepository.save(log);
        }

        return VisitorResponse.builder()
                .visitorId(visitor.getVisitorCode())
                .build();
    }

    private Visitor createVisitor() {

        Visitor visitor = Visitor.builder()
                .visitorCode(UUID.randomUUID())
                .build();

        return visitorRepository.save(visitor);
    }

    private String getClientIp(HttpServletRequest request) {

        String xForwardedFor = request.getHeader("X-Forwarded-For");

        if (xForwardedFor != null &&
                !xForwardedFor.isBlank()) {

            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");

        if (xRealIp != null &&
                !xRealIp.isBlank()) {

            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    public List<VisitorStatsDTO> getVisitorStats(
            VisitorPeriod period,
            LocalDate from,
            LocalDate to) {

        // Default = DAILY
        if (period == null) {
            period = VisitorPeriod.DAILY;
        }

        List<Object[]> results;

        switch (period) {

            case DAILY:
                results = visitorLogRepository.getDailyVisitorCount();
                break;

            case MONTHLY:
                results = visitorLogRepository.getMonthlyVisitorCount();
                break;

            case YEARLY:
                results = visitorLogRepository.getYearlyVisitorCount();
                break;

            case CUSTOM:

                if (from == null || to == null) {
                    throw new IllegalArgumentException(
                            "from and to dates are required for CUSTOM period");
                }

                if (from.isAfter(to)) {
                    throw new IllegalArgumentException(
                            "from date cannot be after to date");
                }

                results = visitorLogRepository.getCustomVisitorCount(
                        from,
                        to.plusDays(1));

                break;

            default:
                throw new IllegalArgumentException(
                        "Invalid visitor period");
        }

        return results.stream()
                .map(row -> new VisitorStatsDTO(
                        row[0].toString(),
                        ((Number) row[1]).longValue()))
                .toList();
    }
}