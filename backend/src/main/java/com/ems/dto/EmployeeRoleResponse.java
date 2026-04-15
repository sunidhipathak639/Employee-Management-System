package com.ems.dto;

import java.time.LocalDate;

public class EmployeeRoleResponse {

    private Long id;
    private Long employeeId;
    private RoleResponse role;
    private LocalDate assignedDate;

    public EmployeeRoleResponse() {}

    public EmployeeRoleResponse(Long id, Long employeeId, RoleResponse role, LocalDate assignedDate) {
        this.id = id;
        this.employeeId = employeeId;
        this.role = role;
        this.assignedDate = assignedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public RoleResponse getRole() {
        return role;
    }

    public void setRole(RoleResponse role) {
        this.role = role;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }
}
