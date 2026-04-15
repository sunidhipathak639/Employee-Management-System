package com.ems.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.EmployeeRequest;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void create_throwsWhenEmailExists() {
        EmployeeRequest req = buildRequest();
        when(employeeRepository.existsByEmailIgnoreCase("a@b.com")).thenReturn(true);
        assertThrows(ConflictException.class, () -> employeeService.create(req));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void create_throwsWhenDepartmentMissing() {
        EmployeeRequest req = buildRequest();
        when(employeeRepository.existsByEmailIgnoreCase("a@b.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> employeeService.create(req));
    }

    @Test
    void update_throwsWhenEmployeeMissing() {
        EmployeeRequest req = buildRequest();
        when(employeeRepository.findByIdWithDepartment(2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> employeeService.update(2L, req));
    }

    private static EmployeeRequest buildRequest() {
        EmployeeRequest r = new EmployeeRequest();
        r.setFirstName("A");
        r.setLastName("B");
        r.setEmail("a@b.com");
        r.setSalary(BigDecimal.TEN);
        r.setDepartmentId(1L);
        return r;
    }
}
