package com.ems.service;

import com.ems.dto.RoleRequest;
import com.ems.dto.RoleResponse;
import com.ems.entity.Role;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.RoleRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> findAll() {
        return roleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RoleResponse findById(Long id) {
        return roleRepository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }

    @Transactional
    public RoleResponse create(RoleRequest request) {
        if (roleRepository.existsByTitleIgnoreCase(request.getTitle().trim())) {
            throw new ConflictException("A role with this title already exists");
        }
        Role r = new Role();
        r.setTitle(request.getTitle().trim());
        r.setPayGrade(request.getPayGrade());
        return toResponse(roleRepository.save(r));
    }

    @Transactional
    public RoleResponse update(Long id, RoleRequest request) {
        Role r = roleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        if (roleRepository.existsByTitleIgnoreCaseAndIdNot(request.getTitle().trim(), id)) {
            throw new ConflictException("A role with this title already exists");
        }
        r.setTitle(request.getTitle().trim());
        r.setPayGrade(request.getPayGrade());
        return toResponse(roleRepository.save(r));
    }

    @Transactional
    public void delete(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found");
        }
        roleRepository.deleteById(id);
    }

    public RoleResponse toResponse(Role r) {
        return new RoleResponse(r.getId(), r.getTitle(), r.getPayGrade());
    }
}
