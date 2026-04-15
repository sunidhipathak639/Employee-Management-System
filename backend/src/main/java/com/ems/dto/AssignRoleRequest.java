package com.ems.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AssignRoleRequest {

    @NotNull(message = "Role is required")
    private Long roleId;

    private LocalDate assignedDate;

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }
}
