package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.FloorTypeRequest;
import com.raaj.building_calculation_backend.entity.FloorType;
import com.raaj.building_calculation_backend.repository.FloorTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FloorTypeService {

    private final FloorTypeRepository repository;

    public List<FloorType> getAll() {
        return repository.findAll();
    }

    public FloorType getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor type not found: " + id));
    }

    public FloorType create(FloorTypeRequest request) {

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

        return repository.save(entity);
    }

    public FloorType update(Long id, FloorTypeRequest request) {

        FloorType entity = getById(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setDisplayOrder(request.getDisplayOrder());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return repository.save(entity);
    }

    public void delete(Long id) {
        FloorType entity = getById(id);
        repository.delete(entity);
    }
}