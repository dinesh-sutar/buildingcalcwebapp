// service/BuildingTypeService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeRequest;
import com.raaj.building_calculation_backend.dto.structure_type.StructureTypeResponse;
import com.raaj.building_calculation_backend.entity.StructureType;
import com.raaj.building_calculation_backend.repository.StructureTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StructureTypeService {

    private final StructureTypeRepository repository;

    public List<StructureTypeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(StructureTypeResponse::from)
                .toList();
    }

    public StructureTypeResponse getById(Long id) {
        return StructureTypeResponse.from(getEntity(id));
    }

    public StructureTypeResponse create(StructureTypeRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "Building type code already exists: " + request.getCode());
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "Building type name already exists: " + request.getName());
        }

        StructureType entity = new StructureType();

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return StructureTypeResponse.from(repository.save(entity));
    }

    public StructureTypeResponse update(Long id, StructureTypeRequest request) {

        StructureType entity = getEntity(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return StructureTypeResponse.from(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    // internal helper - keeps entity lookups out of the public API surface
    private StructureType getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building type not found: " + id));
    }
}