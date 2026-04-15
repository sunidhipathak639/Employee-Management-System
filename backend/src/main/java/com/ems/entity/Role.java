package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String title;

    @Column(name = "pay_grade", nullable = false)
    private Integer payGrade;

    @OneToMany(mappedBy = "role")
    private List<EmployeeRole> employeeRoles = new ArrayList<>();

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

    public List<EmployeeRole> getEmployeeRoles() {
        return employeeRoles;
    }
}
