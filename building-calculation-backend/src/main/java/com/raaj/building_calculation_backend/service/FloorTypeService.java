// service/FloorTypeService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.FloorTypeRequest;
import com.raaj.building_calculation_backend.dto.FloorTypeResponse;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.repository.FloorTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FloorTypeService {

    private final FloorTypeRepository repository;

    public List<FloorTypeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(FloorTypeResponse::from)
                .toList();
    }

    public FloorTypeResponse getById(Long id) {
        return FloorTypeResponse.from(getEntity(id));
    }

    public FloorTypeResponse create(FloorTypeRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "Floor type code already exists: " + request.getCode());
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "Floor type name already exists: " + request.getName());
        }

        FloorType entity = new FloorType();

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setDisplayOrder(request.getDisplayOrder());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return FloorTypeResponse.from(repository.save(entity));
    }

    public FloorTypeResponse update(Long id, FloorTypeRequest request) {

        FloorType entity = getEntity(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setDisplayOrder(request.getDisplayOrder());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return FloorTypeResponse.from(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    private FloorType getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor type not found: " + id));
    }
}