package com.raaj.building_calculation_backend.service;

import com.raaj.building_calculation_backend.dto.BoundaryTypesRequest;
import com.raaj.building_calculation_backend.entity.BoundaryTypes;
import com.raaj.building_calculation_backend.repository.BoundaryTypesRepository;
import com.raaj.building_calculation_backend.service.BoundaryTypesService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class  BoundaryTypesService {

    private final BoundaryTypesRepository repository;

    public BoundaryTypes create(BoundaryTypesRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException("Code already exists");
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException("Name already exists");
        }

        BoundaryTypes boundaryType = new BoundaryTypes();

        boundaryType.setCode(request.getCode());
        boundaryType.setName(request.getName());
        boundaryType.setRate(request.getRate());
        boundaryType.setActive(
                request.getActive() != null ? request.getActive() : true
        );

        return repository.save(boundaryType);
    }

    @Transactional(readOnly = true)
    public List<BoundaryTypes> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public BoundaryTypes getById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Boundary type not found with id: " + id
                        )
                );
    }

    public BoundaryTypes update(Long id, BoundaryTypesRequest request) {

        BoundaryTypes existing = getById(id);

        if (repository.existsByCode(request.getCode())
                && !existing.getCode().equals(request.getCode())) {
            throw new RuntimeException("Code already exists");
        }

        if (repository.existsByName(request.getName())
                && !existing.getName().equals(request.getName())) {
            throw new RuntimeException("Name already exists");
        }

        existing.setCode(request.getCode());
        existing.setName(request.getName());
        existing.setRate(request.getRate());

        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        return repository.save(existing);
    }

    public void delete(Long id) {

        BoundaryTypes existing = getById(id);

        repository.delete(existing);
    }
}