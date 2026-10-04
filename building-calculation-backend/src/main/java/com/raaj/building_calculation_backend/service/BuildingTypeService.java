// service/BuildingTypeService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.building_type.BuildingTypeRequest;
import com.raaj.building_calculation_backend.dto.building_type.BuildingTypeResponse;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.entity.StructureType;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;
import com.raaj.building_calculation_backend.repository.StructureTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuildingTypeService {

    private final BuildingTypeRepository repository;
    private final StructureTypeRepository structureTypeRepository;

    /**
     * All buildings, or only the buildings of one structure when structureTypeId is
     * given.
     */
    public List<BuildingTypeResponse> getAll(Long structureTypeId) {
        List<BuildingType> buildings = structureTypeId == null
                ? repository.findAll()
                : repository.findByStructureTypeId(structureTypeId);

        return buildings.stream()
                .map(BuildingTypeResponse::from)
                .toList();
    }

    public List<BuildingTypeResponse> getAllBuildingTypesByStructureTypeId(Long structureTypeId) {
        List<BuildingType> buildings = repository.findByStructureTypeId(structureTypeId);
        return buildings.stream()
                .map(BuildingTypeResponse::from)
                .toList();
    }

    public BuildingTypeResponse getById(Long id) {
        return BuildingTypeResponse.from(getEntity(id));
    }

    public BuildingTypeResponse create(BuildingTypeRequest request) {

        StructureType structureType = getStructureType(request.getStructureTypeId());

        if (repository.existsByStructureTypeIdAndCode(request.getStructureTypeId(), request.getCode())) {
            throw new RuntimeException(
                    "Building type code already exists for this structure: " + request.getCode());
        }

        if (repository.existsByStructureTypeIdAndName(request.getStructureTypeId(), request.getName())) {
            throw new RuntimeException(
                    "Building type name already exists for this structure: " + request.getName());
        }

        BuildingType entity = new BuildingType();
        entity.setStructureType(structureType);
        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return BuildingTypeResponse.from(repository.save(entity));
    }

    public BuildingTypeResponse update(Long id, BuildingTypeRequest request) {

        BuildingType entity = getEntity(id);
        StructureType structureType = getStructureType(request.getStructureTypeId());

        boolean sameStructure = entity.getStructureType().getId().equals(request.getStructureTypeId());

        if (repository.existsByStructureTypeIdAndCode(request.getStructureTypeId(), request.getCode())
                && !(sameStructure && entity.getCode().equals(request.getCode()))) {
            throw new RuntimeException(
                    "Building type code already exists for this structure: " + request.getCode());
        }

        if (repository.existsByStructureTypeIdAndName(request.getStructureTypeId(), request.getName())
                && !(sameStructure && entity.getName().equals(request.getName()))) {
            throw new RuntimeException(
                    "Building type name already exists for this structure: " + request.getName());
        }

        entity.setStructureType(structureType);
        entity.setCode(request.getCode());
        entity.setName(request.getName());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return BuildingTypeResponse.from(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    // internal helpers - keep entity lookups out of the public API surface
    private BuildingType getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building type not found: " + id));
    }

    private StructureType getStructureType(Long id) {
        return structureTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Structure type not found: " + id));
    }
}
