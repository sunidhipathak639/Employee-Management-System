package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.AssignRoleRequest;
import com.ems.dto.EmployeeRoleResponse;
import com.ems.service.EmployeeRoleService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees/{employeeId}/roles")
public class EmployeeRoleController {

    private final EmployeeRoleService employeeRoleService;

    public EmployeeRoleController(EmployeeRoleService employeeRoleService) {
        this.employeeRoleService = employeeRoleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeRoleResponse>>> list(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(employeeRoleService.listForEmployee(employeeId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeRoleResponse>> assign(
            @PathVariable Long employeeId, @RequestBody @Valid AssignRoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(employeeRoleService.assign(employeeId, request), "Role assigned"));
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<ApiResponse<Void>> unassign(@PathVariable Long employeeId, @PathVariable Long roleId) {
        employeeRoleService.unassign(employeeId, roleId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Role unassigned"));
    }
}
