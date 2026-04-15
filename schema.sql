-- Employee Management System — PostgreSQL 15+
-- Deliverable: schema + seed (mirrors Flyway migrations V1 + V2)

CREATE TABLE app_user (
    user_id     BIGSERIAL PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE department (
    dept_id     BIGSERIAL PRIMARY KEY,
    dept_name   VARCHAR(120) NOT NULL,
    location    VARCHAR(200) NOT NULL,
    CONSTRAINT chk_dept_name_len CHECK (char_length(trim(dept_name)) >= 2)
);

CREATE TABLE role (
    role_id     BIGSERIAL PRIMARY KEY,
    title       VARCHAR(120) NOT NULL UNIQUE,
    pay_grade   INT NOT NULL,
    CONSTRAINT chk_pay_grade CHECK (pay_grade BETWEEN 1 AND 20)
);

CREATE TABLE employee (
    emp_id      BIGSERIAL PRIMARY KEY,
    first_name  VARCHAR(80) NOT NULL,
    last_name   VARCHAR(80) NOT NULL,
    email       VARCHAR(180) NOT NULL UNIQUE,
    salary      NUMERIC(12, 2) NOT NULL,
    dept_id     BIGINT NOT NULL REFERENCES department (dept_id),
    CONSTRAINT chk_salary_nonneg CHECK (salary >= 0),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE employee_role (
    id             BIGSERIAL PRIMARY KEY,
    emp_id         BIGINT NOT NULL REFERENCES employee (emp_id) ON DELETE CASCADE,
    role_id        BIGINT NOT NULL REFERENCES role (role_id) ON DELETE CASCADE,
    assigned_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uq_employee_role UNIQUE (emp_id, role_id)
);

CREATE INDEX idx_employee_dept ON employee (dept_id);
CREATE INDEX idx_employee_role_emp ON employee_role (emp_id);

-- Seed data (password for admin/demo: "password")
INSERT INTO app_user (username, password)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
       ('demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

INSERT INTO department (dept_name, location)
VALUES ('Engineering', 'Building A'),
       ('Human Resources', 'Building B'),
       ('Finance', 'Building C');

INSERT INTO role (title, pay_grade)
VALUES ('Software Engineer', 8),
       ('Engineering Manager', 12),
       ('HR Specialist', 6),
       ('Payroll Analyst', 7);

INSERT INTO employee (first_name, last_name, email, salary, dept_id)
VALUES ('Ada', 'Lovelace', 'ada.lovelace@example.com', 125000.00, 1),
       ('Alan', 'Turing', 'alan.turing@example.com', 118000.00, 1),
       ('Grace', 'Hopper', 'grace.hopper@example.com', 98000.00, 2);

INSERT INTO employee_role (emp_id, role_id, assigned_date)
VALUES (1, 1, '2024-01-15'),
       (1, 2, '2024-06-01'),
       (2, 1, '2023-11-01'),
       (3, 3, '2022-05-20');
