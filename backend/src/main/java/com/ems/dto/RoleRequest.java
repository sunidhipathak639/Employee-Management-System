package com.ems.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RoleRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 120, message = "Title must be between 2 and 120 characters")
    private String title;

    @NotNull(message = "Pay grade is required")
    @Min(value = 1, message = "Pay grade must be at least 1")
    @Max(value = 20, message = "Pay grade must be at most 20")
    private Integer payGrade;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPayGrade() {
        return payGrade;
    }

    public void setPayGrade(Integer payGrade) {
        this.payGrade = payGrade;
    }
}
