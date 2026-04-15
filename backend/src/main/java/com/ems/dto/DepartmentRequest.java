package com.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 120, message = "Department name must be between 2 and 120 characters")
    private String name;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be at most 200 characters")
    private String location;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
