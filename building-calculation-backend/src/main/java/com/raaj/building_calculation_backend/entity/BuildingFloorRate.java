package com.raaj.building_calculation_backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "building_floor_rates", uniqueConstraints = {
        @UniqueConstraint(name = "uk_building_floor_component", columnNames = {
                "building_type_id",
                "floor_type_id",
                "component_floor_type_id"
        })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "building_type_id", nullable = false)
    private BuildingType buildingType;

    /*
     * Selected configuration:
     * DUPLEX, TRIPLEX, GROUND, FIRST, SECOND, etc.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "floor_type_id", nullable = false)
    private FloorType floorType;

    /*
     * Actual floor whose construction rate is being stored:
     * GROUND, FIRST, SECOND, etc.
     *
     * Example:
     * TRIPLEX + GROUND = 1527
     * TRIPLEX + FIRST = 1242
     * TRIPLEX + SECOND = 1427
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "component_floor_type_id", nullable = false)
    private FloorType componentFloorType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal baseRate;

    @Column(nullable = false)
    private Boolean active = true;
}