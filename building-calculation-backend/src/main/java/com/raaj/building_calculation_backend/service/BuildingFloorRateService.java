// service/BuildingFloorRateService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.BuildingFloorRateRequest;
import com.raaj.building_calculation_backend.dto.BuildingFloorRateResponse;
import com.raaj.building_calculation_backend.entity.BuildingFloorRate;
import com.raaj.building_calculation_backend.entity.BuildingType;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.repository.BuildingFloorRateRepository;
import com.raaj.building_calculation_backend.repository.BuildingTypeRepository;
import com.raaj.building_calculation_backend.repository.FloorTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuildingFloorRateService {

        private final BuildingFloorRateRepository repository;
        private final BuildingTypeRepository buildingTypeRepository;
        private final FloorTypeRepository floorTypeRepository;

        public List<BuildingFloorRateResponse> getAll() {
                return repository.findAll()
                                .stream()
                                .map(BuildingFloorRateResponse::from)
                                .toList();
        }

        public BuildingFloorRateResponse getById(Long id) {
                return BuildingFloorRateResponse.from(getEntity(id));
        }

        public BuildingFloorRateResponse create(BuildingFloorRateRequest request) {

                BuildingType buildingType = buildingTypeRepository
                                .findById(request.getBuildingTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Building type not found: " + request.getBuildingTypeId()));

                FloorType floorType = floorTypeRepository
                                .findById(request.getFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Floor type not found: " + request.getFloorTypeId()));

                FloorType componentFloorType = floorTypeRepository
                                .findById(request.getComponentFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Component floor type not found: "
                                                                + request.getComponentFloorTypeId()));

                boolean exists = repository
                                .existsByBuildingTypeIdAndFloorTypeIdAndComponentFloorTypeId(
                                                request.getBuildingTypeId(),
                                                request.getFloorTypeId(),
                                                request.getComponentFloorTypeId());

                if (exists) {
                        throw new RuntimeException(
                                        "Building floor rate already exists for building type "
                                                        + request.getBuildingTypeId()
                                                        + ", floor type "
                                                        + request.getFloorTypeId()
                                                        + ", component floor type "
                                                        + request.getComponentFloorTypeId());
                }

                BuildingFloorRate entity = new BuildingFloorRate();

                entity.setBuildingType(buildingType);
                entity.setFloorType(floorType);
                entity.setComponentFloorType(componentFloorType);
                entity.setBaseRate(request.getBaseRate());
                entity.setActive(
                                request.getActive() != null ? request.getActive() : true);

                return BuildingFloorRateResponse.from(repository.save(entity));
        }

        public BuildingFloorRateResponse update(Long id, BuildingFloorRateRequest request) {

                BuildingFloorRate entity = getEntity(id);

                BuildingType buildingType = buildingTypeRepository
                                .findById(request.getBuildingTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Building type not found: " + request.getBuildingTypeId()));

                FloorType floorType = floorTypeRepository
                                .findById(request.getFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Floor type not found: " + request.getFloorTypeId()));

                FloorType componentFloorType = floorTypeRepository
                                .findById(request.getComponentFloorTypeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Component floor type not found: "
                                                                + request.getComponentFloorTypeId()));

                boolean exists = repository
                                .existsByBuildingTypeIdAndFloorTypeIdAndComponentFloorTypeId(
                                                request.getBuildingTypeId(),
                                                request.getFloorTypeId(),
                                                request.getComponentFloorTypeId());

                boolean isSameRecord = entity.getBuildingType().getId().equals(request.getBuildingTypeId())
                                && entity.getFloorType().getId().equals(request.getFloorTypeId())
                                && entity.getComponentFloorType().getId().equals(request.getComponentFloorTypeId());

                if (exists && !isSameRecord) {
                        throw new RuntimeException(
                                        "Building floor rate already exists for the specified "
                                                        + "building/floor/component combination");
                }

                entity.setBuildingType(buildingType);
                entity.setFloorType(floorType);
                entity.setComponentFloorType(componentFloorType);
                entity.setBaseRate(request.getBaseRate());

                if (request.getActive() != null) {
                        entity.setActive(request.getActive());
                }

                return BuildingFloorRateResponse.from(repository.save(entity));
        }

        public void delete(Long id) {
                repository.delete(getEntity(id));
        }

        private BuildingFloorRate getEntity(Long id) {
                return repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Building floor rate not found: " + id));
        }
}