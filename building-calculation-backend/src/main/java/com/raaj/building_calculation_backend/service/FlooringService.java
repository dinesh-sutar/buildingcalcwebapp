package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.FlooringRequest;
import com.raaj.building_calculation_backend.entity.Flooring;
import com.raaj.building_calculation_backend.repository.FlooringRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlooringService {

    private final FlooringRepository repository;

    public List<Flooring> getAll() {
        return repository.findAll();
    }

    public Flooring getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flooring not found: " + id));
    }

    public Flooring create(FlooringRequest request) {

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

        return repository.save(entity);
    }

    public Flooring update(Long id, FlooringRequest request) {

        Flooring entity = getById(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setRate(request.getRate());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return repository.save(entity);
    }

    public void delete(Long id) {
        Flooring entity = getById(id);
        repository.delete(entity);
    }
}