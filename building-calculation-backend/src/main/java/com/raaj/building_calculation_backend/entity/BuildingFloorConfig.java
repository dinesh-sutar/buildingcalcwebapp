package com.raaj.building_calculation_backend.entity;

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
@Table(name = "building_floor_configs", uniqueConstraints = {
        @UniqueConstraint(name = "uk_building_type_floor_config", columnNames = { "building_type_id", "floor_type_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingFloorConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "building_type_id", nullable = false)
    private BuildingType buildingType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "floor_type_id", nullable = false)
    private FloorType floorType;

    @Column(nullable = false)
    private Boolean enabled = true;
}