package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.DepartmentRequest;
import com.ems.dto.DepartmentResponse;
import com.ems.service.DepartmentService;
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
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponse>> create(@RequestBody @Valid DepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(departmentService.create(request), "Department created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> update(
            @PathVariable Long id, @RequestBody @Valid DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.update(id, request), "Department updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Department deleted"));
    }
}
