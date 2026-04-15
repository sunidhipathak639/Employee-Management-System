package com.ems.service;

import com.ems.dto.EmployeeRequest;
import com.ems.dto.EmployeeResponse;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAllWithDepartment().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        Employee e = employeeRepository
                .findByIdWithDepartment(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return toResponse(e);
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            throw new ConflictException("An employee with this email already exists");
        }
        Department dept = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Employee e = new Employee();
        e.setFirstName(request.getFirstName().trim());
        e.setLastName(request.getLastName().trim());
        e.setEmail(request.getEmail().trim().toLowerCase());
        e.setSalary(request.getSalary());
        e.setDepartment(dept);
        return toResponse(employeeRepository.save(e));
    }

    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee e = employeeRepository
                .findByIdWithDepartment(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        if (employeeRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail().trim().toLowerCase(), id)) {
            throw new ConflictException("An employee with this email already exists");
        }
        Department dept = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        e.setFirstName(request.getFirstName().trim());
        e.setLastName(request.getLastName().trim());
        e.setEmail(request.getEmail().trim().toLowerCase());
        e.setSalary(request.getSalary());
        e.setDepartment(dept);
        return toResponse(employeeRepository.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponse toResponse(Employee e) {
        EmployeeResponse r = new EmployeeResponse();
        r.setId(e.getId());
        r.setFirstName(e.getFirstName());
        r.setLastName(e.getLastName());
        r.setEmail(e.getEmail());
        r.setSalary(e.getSalary());
        r.setDepartment(new EmployeeResponse.DepartmentSummary(e.getDepartment().getId(), e.getDepartment().getName()));
        return r;
    }
}
