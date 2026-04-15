package com.ems.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.AssignRoleRequest;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.EmployeeRoleRepository;
import com.ems.repository.RoleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeRoleServiceTest {

    @Mock
    private EmployeeRoleRepository employeeRoleRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private EmployeeRoleService employeeRoleService;

    @Test
    void assign_throwsWhenAlreadyAssigned() {
        AssignRoleRequest req = new AssignRoleRequest();
        req.setRoleId(9L);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(new com.ems.entity.Employee()));
        when(roleRepository.findById(9L)).thenReturn(Optional.of(new com.ems.entity.Role()));
        when(employeeRoleRepository.existsByEmployee_IdAndRole_Id(1L, 9L)).thenReturn(true);
        assertThrows(ConflictException.class, () -> employeeRoleService.assign(1L, req));
        verify(employeeRoleRepository, never()).save(any());
    }

    @Test
    void listForEmployee_throwsWhenEmployeeMissing() {
        when(employeeRepository.existsById(7L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> employeeRoleService.listForEmployee(7L));
    }
}
