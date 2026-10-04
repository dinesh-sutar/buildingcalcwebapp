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

/**
 * A building that belongs to a structure type.
 * Floor selections (BuildingFloorConfig) and their rates (BuildingFloorRate)
 * hang off this entity.
 */
@Entity
@Table(name = "building_types", uniqueConstraints = {
        @UniqueConstraint(name = "uk_building_type_structure_code", columnNames = { "structure_type_id", "code" }),
        @UniqueConstraint(name = "uk_building_type_structure_name", columnNames = { "structure_type_id", "name" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "structure_type_id", nullable = false)
    private StructureType structureType;

    @Column(nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false)
    private Boolean active = true;
}
