package com.ems.repository;

import com.ems.entity.EmployeeRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRoleRepository extends JpaRepository<EmployeeRole, Long> {

    @Query("SELECT er FROM EmployeeRole er JOIN FETCH er.role WHERE er.employee.id = :employeeId")
    List<EmployeeRole> findByEmployeeIdWithRole(@Param("employeeId") Long employeeId);

    boolean existsByEmployee_IdAndRole_Id(Long employeeId, Long roleId);

    Optional<EmployeeRole> findByEmployee_IdAndRole_Id(Long employeeId, Long roleId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM EmployeeRole er WHERE er.employee.id = :eid AND er.role.id = :rid")
    void deleteByEmployeeAndRole(@Param("eid") Long employeeId, @Param("rid") Long roleId);
}
