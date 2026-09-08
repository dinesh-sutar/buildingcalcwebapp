// service/FlooringService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.FlooringRequest;
import com.raaj.building_calculation_backend.dto.FlooringResponse;
import com.raaj.building_calculation_backend.entity.Flooring;
import com.raaj.building_calculation_backend.repository.FlooringRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlooringService {

    private final FlooringRepository repository;

    public List<FlooringResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(FlooringResponse::from)
                .toList();
    }

    public FlooringResponse getById(Long id) {
        return FlooringResponse.from(getEntity(id));
    }

    public FlooringResponse create(FlooringRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "Flooring code already exists: " + request.getCode());
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "Flooring name already exists: " + request.getName());
        }

        Flooring entity = new Flooring();

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setRate(request.getRate());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return FlooringResponse.from(repository.save(entity));
    }

    public FlooringResponse update(Long id, FlooringRequest request) {

        Flooring entity = getEntity(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setRate(request.getRate());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return FlooringResponse.from(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    private Flooring getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flooring not found: " + id));
    }
}