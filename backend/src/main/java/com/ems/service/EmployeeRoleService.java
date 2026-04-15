package com.ems.service;

import com.ems.dto.AssignRoleRequest;
import com.ems.dto.EmployeeRoleResponse;
import com.ems.dto.RoleResponse;
import com.ems.entity.Employee;
import com.ems.entity.EmployeeRole;
import com.ems.entity.Role;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.EmployeeRoleRepository;
import com.ems.repository.RoleRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeRoleService {

    private final EmployeeRoleRepository employeeRoleRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;

    public EmployeeRoleService(
            EmployeeRoleRepository employeeRoleRepository,
            EmployeeRepository employeeRepository,
            RoleRepository roleRepository) {
        this.employeeRoleRepository = employeeRoleRepository;
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeRoleResponse> listForEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found");
        }
        return employeeRoleRepository.findByEmployeeIdWithRole(employeeId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public EmployeeRoleResponse assign(Long employeeId, AssignRoleRequest request) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        Role role = roleRepository.findById(request.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        if (employeeRoleRepository.existsByEmployee_IdAndRole_Id(employeeId, request.getRoleId())) {
            throw new ConflictException("This role is already assigned to the employee");
        }
        EmployeeRole link = new EmployeeRole();
        link.setEmployee(employee);
        link.setRole(role);
        link.setAssignedDate(request.getAssignedDate() != null ? request.getAssignedDate() : LocalDate.now());
        EmployeeRole saved = employeeRoleRepository.save(link);
        return toResponse(saved, employeeId);
    }

    @Transactional
    public void unassign(Long employeeId, Long roleId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found");
        }
        if (!employeeRoleRepository.existsByEmployee_IdAndRole_Id(employeeId, roleId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        employeeRoleRepository.deleteByEmployeeAndRole(employeeId, roleId);
    }

    private EmployeeRoleResponse toResponse(EmployeeRole er) {
        return toResponse(er, er.getEmployee().getId());
    }

    private EmployeeRoleResponse toResponse(EmployeeRole er, Long employeeId) {
        RoleResponse rr = toRoleResponse(er.getRole());
        return new EmployeeRoleResponse(er.getId(), employeeId, rr, er.getAssignedDate());
    }

    private static RoleResponse toRoleResponse(Role role) {
        return new RoleResponse(role.getId(), role.getTitle(), role.getPayGrade());
    }
}
