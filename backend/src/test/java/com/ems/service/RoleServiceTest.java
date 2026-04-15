package com.ems.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.ems.dto.RoleRequest;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.RoleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    @Test
    void findById_throwsWhenMissing() {
        when(roleRepository.findById(42L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> roleService.findById(42L));
    }

    @Test
    void update_throwsWhenMissing() {
        RoleRequest req = new RoleRequest();
        req.setTitle("Lead");
        req.setPayGrade(10);
        when(roleRepository.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> roleService.update(3L, req));
    }
}
