// service/GstOptionService.java
package com.raaj.building_calculation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raaj.building_calculation_backend.dto.GstOptionRequest;
import com.raaj.building_calculation_backend.dto.GstOptionResponse;
import com.raaj.building_calculation_backend.entity.GstOption;
import com.raaj.building_calculation_backend.repository.GstOptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstOptionService {

    private final GstOptionRepository repository;

    public List<GstOptionResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(GstOptionResponse::from)
                .toList();
    }

    public GstOptionResponse getById(Long id) {
        return GstOptionResponse.from(getEntity(id));
    }

    public GstOptionResponse create(GstOptionRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "GST option code already exists: " + request.getCode());
        }

        if (repository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "GST option name already exists: " + request.getName());
        }

        GstOption entity = new GstOption();

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setRate(request.getRate());
        entity.setActive(
                request.getActive() != null ? request.getActive() : true);

        return GstOptionResponse.from(repository.save(entity));
    }

    public GstOptionResponse update(Long id, GstOptionRequest request) {

        GstOption entity = getEntity(id);

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setRate(request.getRate());

        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }

        return GstOptionResponse.from(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    private GstOption getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("GST option not found: " + id));
    }
}