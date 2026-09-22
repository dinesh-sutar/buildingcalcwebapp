package com.raaj.building_calculation_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_logs", indexes = {
        @Index(name = "idx_visitor_log_visitor_id", columnList = "visitor_id"),
        @Index(name = "idx_visitor_log_visited_at", columnList = "visited_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visitor_id", nullable = false, foreignKey = @ForeignKey(name = "fk_visitor_log_visitor"))
    private Visitor visitor;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "device_type")
    private String deviceType;

    @Column(name = "operating_system")
    private String operatingSystem;

    @Column(name = "browser")
    private String browser;

    @Column(name = "country")
    private String country;

    @Column(name = "state")
    private String state;

    @Column(name = "city")
    private String city;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "page_url", columnDefinition = "TEXT")
    private String pageUrl;

    @Column(name = "referrer", columnDefinition = "TEXT")
    private String referrer;

    @Column(name = "visited_at", nullable = false)
    private LocalDateTime visitedAt;
}