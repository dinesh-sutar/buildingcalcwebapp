package com.raaj.building_calculation_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "visitors", uniqueConstraints = {
        @UniqueConstraint(name = "uk_visitor_code", columnNames = "visitor_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visitor_code", nullable = false, unique = true, updatable = false)
    private UUID visitorCode;
}