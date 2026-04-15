package com.ems.service;

import com.ems.dto.DepartmentRequest;
import com.ems.dto.DepartmentResponse;
import com.ems.entity.Department;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> findAll() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse findById(Long id) {
        return departmentRepository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ConflictException("A department with this name already exists");
        }
        Department d = new Department();
        d.setName(request.getName().trim());
        d.setLocation(request.getLocation().trim());
        return toResponse(departmentRepository.save(d));
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department d = departmentRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        if (departmentRepository.existsByNameIgnoreCaseAndIdNot(request.getName().trim(), id)) {
            throw new ConflictException("A department with this name already exists");
        }
        d.setName(request.getName().trim());
        d.setLocation(request.getLocation().trim());
        return toResponse(departmentRepository.save(d));
    }

    @Transactional
    public void delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found");
        }
        if (employeeRepository.countByDepartment_Id(id) > 0) {
            throw new ConflictException("Cannot delete a department that still has employees assigned");
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse toResponse(Department d) {
        return new DepartmentResponse(d.getId(), d.getName(), d.getLocation());
    }
}
