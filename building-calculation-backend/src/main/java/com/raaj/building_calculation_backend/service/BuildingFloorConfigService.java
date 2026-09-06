package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.BuildingFloorConfigRequest;
import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.repository.BuildingFloorConfigRepository;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;
import com.raaj.building_calculation_backend.repository.FloorTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuildingFloorConfigService {

    private final BuildingFloorConfigRepository repository;
    private final BuildingTypeRepository buildingTypeRepository;
    private final FloorTypeRepository floorTypeRepository;

    public List<BuildingFloorConfig> getAll() {
        return repository.findAll();
    }

    public BuildingFloorConfig getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Building floor config not found: " + id));
    }

    public BuildingFloorConfig create(BuildingFloorConfigRequest request) {

        BuildingType buildingType = buildingTypeRepository
                .findById(request.getBuildingTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "Building type not found: "
                                + request.getBuildingTypeId()));

        FloorType floorType = floorTypeRepository
                .findById(request.getFloorTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "Floor type not found: "
                                + request.getFloorTypeId()));

        if (repository.existsByBuildingTypeIdAndFloorTypeId(
                request.getBuildingTypeId(),
                request.getFloorTypeId())) {

            throw new RuntimeException(
                    "Configuration already exists for building type "
                            + request.getBuildingTypeId()
                            + " and floor type "
                            + request.getFloorTypeId());
        }

        BuildingFloorConfig entity = new BuildingFloorConfig();

        entity.setBuildingType(buildingType);
        entity.setFloorType(floorType);
        entity.setEnabled(
                request.getEnabled() != null
                        ? request.getEnabled()
                        : true);

        return repository.save(entity);
    }

    public BuildingFloorConfig update(
            Long id,
            BuildingFloorConfigRequest request) {

        BuildingFloorConfig entity = getById(id);

        BuildingType buildingType = buildingTypeRepository
                .findById(request.getBuildingTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "Building type not found: "
                                + request.getBuildingTypeId()));

        FloorType floorType = floorTypeRepository
                .findById(request.getFloorTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "Floor type not found: "
                                + request.getFloorTypeId()));

        boolean duplicate = repository.existsByBuildingTypeIdAndFloorTypeId(
                request.getBuildingTypeId(),
                request.getFloorTypeId());

        if (duplicate
                && !(entity.getBuildingType().getId()
                        .equals(request.getBuildingTypeId())
                        && entity.getFloorType().getId()
                                .equals(request.getFloorTypeId()))) {

            throw new RuntimeException(
                    "Configuration already exists for building type "
                            + request.getBuildingTypeId()
                            + " and floor type "
                            + request.getFloorTypeId());
        }

        entity.setBuildingType(buildingType);
        entity.setFloorType(floorType);

        if (request.getEnabled() != null) {
            entity.setEnabled(request.getEnabled());
        }

        return repository.save(entity);
    }

    public void delete(Long id) {
        BuildingFloorConfig entity = getById(id);
        repository.delete(entity);
    }
}