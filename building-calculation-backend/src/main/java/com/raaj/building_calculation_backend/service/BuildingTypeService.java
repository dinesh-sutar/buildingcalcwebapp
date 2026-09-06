package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.BuildingTypeRequest;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuildingTypeService {

    private final BuildingTypeRepository repository;

    public List<BuildingType> getAll() {
        return repository.findAll();
    }

    public BuildingType getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building type not found: " + id));
    }

    public BuildingType create(BuildingTypeRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "Building type code already exists: " + request.getCode());
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "Building type name already exists: " + request.getName());
        }

        BuildingType entity = new BuildingType();

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return repository.save(entity);
    }

    public BuildingType update(Long id, BuildingTypeRequest request) {

        BuildingType entity = getById(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return repository.save(entity);
    }

    public void delete(Long id) {
        BuildingType entity = getById(id);
        repository.delete(entity);
    }
}