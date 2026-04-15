package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.RoleRequest;
import com.ems.dto.RoleResponse;
import com.ems.service.RoleService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(roleService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roleService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> create(@RequestBody @Valid RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(roleService.create(request), "Role created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> update(@PathVariable Long id, @RequestBody @Valid RoleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(roleService.update(id, request), "Role updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Role deleted"));
    }
}
