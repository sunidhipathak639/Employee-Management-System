package com.ems.dto;

public class RoleResponse {

    private Long id;
    private String title;
    private Integer payGrade;

    public RoleResponse() {}

    public RoleResponse(Long id, String title, Integer payGrade) {
        this.id = id;
        this.title = title;
        this.payGrade = payGrade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
