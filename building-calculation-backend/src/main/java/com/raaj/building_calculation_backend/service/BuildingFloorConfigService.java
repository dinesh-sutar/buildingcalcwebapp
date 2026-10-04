package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.building_floor_config.BuildingFloorConfigRequest;
import com.raaj.building_calculation_backend.dto.building_floor_config.BuildingFloorConfigResponse;
import com.raaj.building_calculation_backend.entity.BuildingFloorConfig;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.entity.StructureType;
import com.raaj.building_calculation_backend.repository.BuildingFloorConfigRepository;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;
import com.raaj.building_calculation_backend.repository.FloorTypeRepository;
import com.raaj.building_calculation_backend.repository.StructureTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuildingFloorConfigService {

        private final BuildingFloorConfigRepository repository;
        private final StructureTypeRepository structureTypeRepository;
        private final BuildingTypeRepository buildingTypeRepository;
        private final FloorTypeRepository floorTypeRepository;

        public List<BuildingFloorConfigResponse> getAll() {

                return repository.findAll()
                                .stream()
                                .map(BuildingFloorConfigResponse::from)
                                .toList();
        }

        public BuildingFloorConfigResponse getById(Long id) {

                return BuildingFloorConfigResponse.from(getEntity(id));
        }

        public BuildingFloorConfigResponse create(BuildingFloorConfigRequest request) {

                StructureType structureType = structureTypeRepository
                                .findById(request.getStructureTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Structure type not found: " + request.getStructureTypeId()));

                BuildingType buildingType = buildingTypeRepository
                                .findById(request.getBuildingTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Building type not found: " + request.getBuildingTypeId()));

                FloorType floorType = floorTypeRepository
                                .findById(request.getFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Floor type not found: " + request.getFloorTypeId()));

                boolean exists = repository
                                .existsByStructureTypeIdAndBuildingTypeIdAndFloorTypeId(
                                                request.getStructureTypeId(),
                                                request.getBuildingTypeId(),
                                                request.getFloorTypeId());

                if (exists) {
                        throw new RuntimeException(
                                        "Configuration already exists for structure type "
                                                        + request.getStructureTypeId()
                                                        + ", building type "
                                                        + request.getBuildingTypeId()
                                                        + ", and floor type "
                                                        + request.getFloorTypeId());
                }

                BuildingFloorConfig entity = new BuildingFloorConfig();

                entity.setStructureType(structureType);
                entity.setBuildingType(buildingType);
                entity.setFloorType(floorType);

                entity.setEnabled(
                                request.getEnabled() != null
                                                ? request.getEnabled()
                                                : true);

                return BuildingFloorConfigResponse.from(
                                repository.save(entity));
        }

        public BuildingFloorConfigResponse update(
                        Long id,
                        BuildingFloorConfigRequest request) {

                BuildingFloorConfig entity = getEntity(id);

                StructureType structureType = structureTypeRepository
                                .findById(request.getStructureTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Structure type not found: " + request.getStructureTypeId()));

                BuildingType buildingType = buildingTypeRepository
                                .findById(request.getBuildingTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Building type not found: " + request.getBuildingTypeId()));

                FloorType floorType = floorTypeRepository
                                .findById(request.getFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Floor type not found: " + request.getFloorTypeId()));

                boolean exists = repository
                                .existsByStructureTypeIdAndBuildingTypeIdAndFloorTypeId(
                                                request.getStructureTypeId(),
                                                request.getBuildingTypeId(),
                                                request.getFloorTypeId());

                boolean isSameRecord = entity.getStructureType().getId().equals(request.getStructureTypeId())
                                && entity.getBuildingType().getId().equals(request.getBuildingTypeId())
                                && entity.getFloorType().getId().equals(request.getFloorTypeId());

                if (exists && !isSameRecord) {

                        throw new RuntimeException(
                                        "Configuration already exists for the specified "
                                                        + "structure/building/floor combination");
                }

                entity.setStructureType(structureType);
                entity.setBuildingType(buildingType);
                entity.setFloorType(floorType);

                if (request.getEnabled() != null) {
                        entity.setEnabled(request.getEnabled());
                }

                return BuildingFloorConfigResponse.from(
                                repository.save(entity));
        }

        public void delete(Long id) {

                repository.delete(getEntity(id));
        }

        private BuildingFloorConfig getEntity(Long id) {

                return repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Building floor config not found: " + id));
        }
}