# Employee Management System — Project Specification

This document captures the **Project 3 — Full-Stack CRUD Application** requirements for the **Employee Management System** theme (Option A). Use it as the single source of truth while implementing `frontend/` and `backend/`.

---

## 1. Objective

Build a full-stack web application with:

- A **React** frontend  
- A **Spring Boot 3** (Java 17+) REST API  
- A **relational SQL** database (MySQL 8 or PostgreSQL 15)  

The application must demonstrate **complete CRUD** for the core domain, with clear separation of concerns.

---

## 2. Domain & Features (Theme: Employee Management)

The system manages **three entities**:

| Entity      | Responsibility |
|------------|----------------|
| **Department** | Organizational unit (e.g. name, location). |
| **Employee**   | People linked to departments; profile and employment fields as per schema. |
| **Role**       | Job roles (e.g. title, pay grade). |

**Relationships**

- Employees belong to a **department** (many-to-one).  
- Employees and roles are **many-to-many**, modeled with a **junction table** (e.g. assignment date on the link).

**CRUD**

- Full **Create, Read, Update, Delete** for **departments**, **employees**, and **roles** (assignment management via the junction entity as required by the API design).

---

## 3. Technology Stack

### 3.1 Frontend

| Area | Requirement |
|------|-------------|
| Framework | **React 18+** |
| Routing | **React Router v6** — at least **4 routes** + a **404 / Not Found** fallback |
| Navigation | **Navbar** with **active link** highlighting |
| HTTP | **Axios** (or Fetch); **centralize base URL** in an `api.js` (or equivalent) module |
| Forms | **React Hook Form** or **Formik** + client-side validation (required, min length, valid email) |
| State | `useState` / `useReducer`; **`useContext` or Zustand** if shared across **3+** components; avoid prop drilling beyond **2** levels |
| UI | **Material UI**, **Ant Design**, or **Tailwind CSS**; **responsive** (usable from **≥ 375px** width) |
| UX | **Loading** indicators during requests; **user-friendly errors** on network failure |
| Tables | **Data table** with **pagination** and **search/filter** for **at least one** resource |
| Forms UX | Disable submit while pending; show **server-side validation errors** inline per field |

### 3.2 Backend

| Area | Requirement |
|------|-------------|
| Runtime | **Java 17+** |
| Framework | **Spring Boot 3** |
| Libraries | Spring **Web**, Spring Data **JPA**, Spring **Validation** |
| Architecture | **Controller → Service → Repository**; **no raw SQL in the service layer** (use JPA repositories) |
| Mapping | JPA: `@Entity`, `@Table`, `@ManyToOne`, `@ManyToMany` (and other annotations as needed) |
| API surface | **DTO layer** to decouple API from persistence |
| Migrations | **Flyway** for schema evolution |
| CORS | Allow **`http://localhost:3000`** (React dev server) |

### 3.3 Database

| Requirement | Detail |
|-------------|--------|
| Design | **Normalized** schema (target **3NF** minimum) |
| Tables | **≥ 3 related tables** with proper **foreign keys** |
| Many-to-many | **Junction / associative table** (e.g. `employee_role`) |
| Constraints | **`NOT NULL`**, **`UNIQUE`**, **`CHECK`** where appropriate |
| Keys | **Auto-increment primary key** on every table |
| Seeds | **Migration(s)** or SQL to **create and seed** the schema |

**Reference schema (starting point; adjust names/types to match implementation)**

- `department(dept_id PK, dept_name, location)`  
- `employee(emp_id PK, first_name, last_name, email UNIQUE, salary, dept_id FK)`  
- `role(role_id PK, title, pay_grade)`  
- `employee_role(emp_id FK, role_id FK, assigned_date)` — junction table  

### 3.4 Tooling

- **Backend build:** Maven **or** Gradle  
- **Frontend build:** npm  
- **Version control:** Git  
- **API testing:** Postman (export collection JSON into the repo)  
- **Optional:** Docker / Docker Compose  

---

## 4. REST API Conventions

### 4.1 CRUD Scope

- **Full CRUD** for **at least two main resources** (employees and departments are typical primary resources; roles and assignments should align with course expectations and your README).  
- Use **`GET`**, **`POST`**, **`PUT`/`PATCH`**, **`DELETE`** with correct **HTTP status codes**.  
- Responses in **JSON** using a **consistent envelope**, for example:  
  - `data`  
  - `message`  
  - `status`  

### 4.2 Validation & Errors

- **Bean Validation** (`@Valid`, `@NotBlank`, `@Size`, etc.) on request DTOs.  
- Return **400** for invalid input.  
- **Global exception handler** (`@ControllerAdvice`) with clear messages for cases such as **404 Not Found** and **409 Conflict**.  

### 4.3 Example Route Pattern (Employees)

Illustrative structure (adapt to your envelope and DTOs):

- `GET /api/employees` — list  
- `GET /api/employees/{id}` — by id  
- `POST /api/employees` — create (`@RequestBody` + `@Valid`)  
- `PUT /api/employees/{id}` or `PATCH` — update  
- `DELETE /api/employees/{id}` — delete  

Mirror similar patterns for departments, roles, and employee–role assignments as designed.

---

## 5. Repository Layout (Target)

```
Employee-Management-System/
├── backend/                 # Spring Boot project
├── frontend/                # React project
├── postman/                 # Exported Postman collection JSON (recommended)
├── schema.sql               # CREATE + seed INSERT (deliverable; can mirror Flyway)
├── README.md                # Setup, env vars, how to run, screenshots, AI note
└── EMPLOYEE_MANAGEMENT_SYSTEM.md   # This specification
```

---

## 6. Deliverables Checklist

| # | Item | Notes |
|---|------|--------|
| 1 | **GitHub repository** | Public; `frontend/` and `backend/`; clear **README.md** |
| 2 | **README.md** | Setup, **`.env`** variables, local run steps, **screenshots** |
| 3 | **`schema.sql`** | `CREATE TABLE` + **seed** `INSERT`s |
| 4 | **Demo video** | **3–5 minutes** (e.g. Loom / YouTube) showing **all CRUD** flows |
| 5 | **Postman collection** | JSON export covering endpoints + sample requests |

---

## 7. Grading Rubric (Summary)

| Area | Focus |
|------|--------|
| **Database (20)** | Normalization, constraints, migrations, seed data |
| **Backend API (30)** | Endpoints, validation, error handling, structure |
| **Frontend — Functionality (25)** | CRUD, routing, state, API integration |
| **Frontend — UI/UX (10)** | Responsive layout, loading/error handling |
| **Code quality (10)** | Readability, naming, no dead code |
| **Documentation & demo (5)** | README + video |

---

## 8. Bonus Features (Optional, +15)

| Bonus | Points | Description |
|-------|--------|-------------|
| **JWT authentication** | +5 | Login/register (or equivalent), protected routes |
| **Docker Compose** | +5 | Frontend + backend + database containerized |
| **Unit tests** | +3 | **≥ 5** JUnit tests (service layer); **≥ 3** React tests (Jest + RTL) |
| **Dark mode** | +2 | Toggle in the UI |

---

## 9. Academic Integrity & AI Use

- Use of AI tools is allowed where permitted; add a **short section in README.md** describing **how** and **where** AI was used.  
- Avoid submitting code you do not understand.

---

## 10. Implementation Order (Suggested)

1. Finalize **ERD** and Flyway **V1** migration + **seed** data.  
2. Implement **entities**, **repositories**, **DTOs**, **services**, **controllers** with envelope + validation.  
3. Add **global exception handling** and **CORS**.  
4. Scaffold React app: **router**, **layout/navbar**, **`api` module**, pages per resource.  
5. Build **forms** (create/edit), **list views** with table **pagination** and **search/filter** for one resource.  
6. Export **Postman** collection; record **demo**; complete **README** with screenshots and env documentation.

---

*Document version: 1.0 — aligned with Full-Stack Web Development Project 3 (Employee Management System).*
