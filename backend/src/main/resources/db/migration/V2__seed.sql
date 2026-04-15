-- Password for both users: "password" (BCrypt)
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
