package com.ems.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.DepartmentRequest;
import com.ems.dto.DepartmentResponse;
import com.ems.entity.Department;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private DepartmentService departmentService;

    @Test
    void create_throwsWhenDuplicateName() {
        DepartmentRequest req = new DepartmentRequest();
        req.setName("Engineering");
        req.setLocation("A");
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(true);
        assertThrows(ConflictException.class, () -> departmentService.create(req));
        verify(departmentRepository, never()).save(any());
    }

    @Test
    void delete_throwsWhenDepartmentHasEmployees() {
        when(departmentRepository.existsById(1L)).thenReturn(true);
        when(employeeRepository.countByDepartment_Id(1L)).thenReturn(2L);
        assertThrows(ConflictException.class, () -> departmentService.delete(1L));
        verify(departmentRepository, never()).deleteById(1L);
    }

    @Test
    void findById_throwsWhenMissing() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> departmentService.findById(99L));
    }

    @Test
    void create_persistsAndReturnsResponse() {
        DepartmentRequest req = new DepartmentRequest();
        req.setName(" Legal ");
        req.setLocation(" HQ ");
        when(departmentRepository.existsByNameIgnoreCase("Legal")).thenReturn(false);
        Department saved = new Department();
        saved.setId(5L);
        saved.setName("Legal");
        saved.setLocation("HQ");
        when(departmentRepository.save(any(Department.class))).thenAnswer(inv -> {
            Department d = inv.getArgument(0);
            d.setId(5L);
            return d;
        });
        DepartmentResponse out = departmentService.create(req);
        assertEquals(5L, out.getId());
        assertEquals("Legal", out.getName());
        assertEquals("HQ", out.getLocation());
    }
}
