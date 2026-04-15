package com.ems.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class EmployeeRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 80, message = "First name must be between 1 and 80 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 80, message = "Last name must be between 1 and 80 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 180, message = "Email is too long")
    private String email;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Salary must be zero or positive")
    private BigDecimal salary;

    @NotNull(message = "Department is required")
    private Long departmentId;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
