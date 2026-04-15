# Employee Management System

**Author:** Sunidhi Pathak  
**License:** [MIT](./LICENSE) (Copyright (c) 2026 Sunidhi Pathak)

Full-stack **Employee Management System** with a **React** SPA, **Spring Boot 3** REST API, and **PostgreSQL 15**. It covers departments, employees, roles, and employee–role assignments (many-to-many), with JWT auth, Flyway migrations, and assignment-aligned documentation in [EMPLOYEE_MANAGEMENT_SYSTEM.md](./EMPLOYEE_MANAGEMENT_SYSTEM.md).

## Features (course + bonus)

- **CRUD** for departments, employees, and roles; assign/unassign roles per employee.
- **JWT** login and register; protected API and UI routes.
- **Docker Compose** for PostgreSQL, backend, and frontend (Nginx).
- **JUnit** service tests (`backend`, `mvn test`) and **Jest + React Testing Library** (`frontend`, `npm test`).
- **Dark mode** toggle (persisted with Zustand).
- **Employees** table: client-side **search** and **pagination**; loading and error states.
- **Postman** collection: [postman/EMS.postman_collection.json](./postman/EMS.postman_collection.json).
- **SQL deliverable**: [schema.sql](./schema.sql) (same structure as Flyway).

## Specification coverage and checklist

This project is built against [EMPLOYEE_MANAGEMENT_SYSTEM.md](./EMPLOYEE_MANAGEMENT_SYSTEM.md). Below is what is **implemented in the repository** versus what **you still provide** for course submission (video link, screenshot files).

### Domain & database (§2, §3.3)

| Item | Status |
|------|--------|
| Entities: **Department**, **Employee**, **Role** | Completed |
| Employee → department (**many-to-one**) | Completed |
| Employee ↔ roles (**many-to-many**) via junction `employee_role` with **assigned_date** | Completed |
| Full **CRUD** for departments, employees, roles + role **assign / unassign** | Completed |
| Normalized schema, FKs, **NOT NULL** / **UNIQUE** / **CHECK**, auto-increment PKs | Completed in Flyway + [schema.sql](./schema.sql) |
| **Seed data** (users, departments, roles, employees, assignments) | Completed (`V2__seed.sql` + `schema.sql`) |

### Frontend (§3.1)

| Item | Status |
|------|--------|
| **React** 18+ (project uses React 19) | Completed |
| **React Router v6** with many routes + **404** (`NotFoundPage`) | Completed |
| **Navbar** with **active** route styling | Completed |
| **Axios** + centralized base URL in [`frontend/src/api.js`](./frontend/src/api.js) | Completed |
| **React Hook Form** + client validation (required, min length, **email** pattern on employee form) | Completed |
| **Zustand** for shared state (auth, theme, etc.) across multiple components | Completed |
| **Material UI**, responsive layout | Completed |
| **Loading** states and user-facing **errors** (toasts / messages) | Completed |
| **Data table** with **pagination** + **search** (employees list) | Completed |
| Submit disabled while pending; **server-side** field errors shown inline where applicable | Completed |

### Backend (§3.2)

| Item | Status |
|------|--------|
| **Java 17**, **Spring Boot 3**, Web + Data JPA + Validation | Completed |
| **Controller → Service → Repository** (no ad-hoc SQL in services) | Completed |
| JPA **@Entity** / **@Table** / **@ManyToOne**; junction modeled explicitly (`EmployeeRole`) | Completed |
| **DTO** request/response layer | Completed |
| **Flyway** migrations | Completed |
| **CORS** allowing `http://localhost:3000` (configurable via `CORS_ORIGINS`) | Completed |

### REST API & errors (§4)

| Item | Status |
|------|--------|
| CRUD-style **GET / POST / PUT / DELETE** for employees, departments, roles; employee–role endpoints | Completed |
| Consistent JSON **envelope** (`data`, `message`, `status`) via `ApiResponse` | Completed |
| **Bean Validation** on DTOs (`@Valid`, `@NotBlank`, `@Email`, etc.) | Completed |
| **400** validation errors, **404** not found, **409** conflict handling | Completed (`GlobalExceptionHandler`) |

### Repository layout (§5)

| Item | Status |
|------|--------|
| `backend/`, `frontend/`, `postman/`, `schema.sql`, `README.md`, spec markdown | Completed |

### Course deliverables (spec section 6)

| # | Deliverable | In repo | Your action (if any) |
|---|-------------|---------|----------------------|
| 1 | GitHub repo with `frontend/` + `backend/` + README | Structure + README present | Confirm repo is **public** and meets instructor rules. |
| 2 | README: setup, **env**, run steps, **screenshots** | Setup, env, run, tests, Postman documented | Add **PNG screenshots** under `docs/screenshots/` and link or embed them here or in your report. |
| 3 | **`schema.sql`** with CREATE + seed | Completed | — |
| 4 | **Demo video** (3–5 min, all CRUD flows) | Section below describes content | **Record** walkthrough; **paste URL** (Loom/YouTube) in [Demo video](#demo-video). |
| 5 | **Postman** collection JSON | [postman/EMS.postman_collection.json](./postman/EMS.postman_collection.json) | — |

### Bonus features (§8, optional +15)

| Bonus | Status |
|-------|--------|
| **JWT** login/register + protected API/UI | Completed |
| **Docker Compose** (database + backend + frontend) | Completed |
| **JUnit**: ≥5 service-layer tests | Completed (multiple `@Test` methods across service test classes) |
| **Jest + RTL**: ≥3 frontend tests | Completed (`frontend/__tests__/`) |
| **Dark mode** UI toggle (persisted) | Completed |

### Academic integrity & AI (§9)

| Item | Status |
|------|--------|
| Short README note on **how AI was used** | Completed — [AI tooling disclosure](#ai-tooling-disclosure) |

## Tech stack

| Layer    | Stack |
|----------|--------|
| Frontend | React 19, Vite 8, MUI 9, React Router 6, Axios, React Hook Form, Zustand, Recharts, Jest, RTL |
| Backend  | Java 17, Spring Boot 3.2, Spring Web / Data JPA / Validation / Security, Flyway, jjwt |
| Database | PostgreSQL 15 |

## Frontend UI / UX

Layout, theming, breakpoints, and accessibility notes are documented in [docs/FRONTEND_UI_UX.md](docs/FRONTEND_UI_UX.md).

## Prerequisites

- **Java 17+** and **Maven 3.9+** (or use Docker only).
- **Node.js 20+** and npm.
- **PostgreSQL 15** (local or Docker).

## Environment variables

### Backend (`backend/`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | Port |
| `DB_NAME` | `ems` | Database name |
| `DB_USER` | `ems` | User |
| `DB_PASSWORD` | `ems` | Password |
| `SERVER_PORT` | `8080` | HTTP port |
| `JWT_SECRET` | (see `application.yml`) | HS256 key, **min 32 bytes**; override in production |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

### Frontend (`frontend/`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | REST API base URL |

Copy [frontend/.env.example](./frontend/.env.example) to `frontend/.env.local` if you need overrides.

## Run locally

### 1. Database

Create DB and user (example):

```sql
CREATE USER ems WITH PASSWORD 'ems';
CREATE DATABASE ems OWNER ems;
```

Or start only Postgres with Docker:

```bash
docker run --name ems-pg -e POSTGRES_USER=ems -e POSTGRES_PASSWORD=ems -e POSTGRES_DB=ems -p 5432:5432 -d postgres:15-alpine
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Flyway applies migrations under `src/main/resources/db/migration/`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Vite is configured for port **3000** to match backend CORS.

**Demo accounts** (from seed data): `admin` / `password`, `demo` / `password`.

## Docker Compose (full stack)

From the repository root:

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000) (Nginx serving the built SPA; API URL baked as `http://localhost:8080` for the browser).
- Backend: [http://localhost:8080](http://localhost:8080).
- Postgres: `localhost:5432` (`ems` / `ems`).

## Tests

```bash
cd backend && mvn test
cd frontend && npm test -- --watchAll=false
```

## Postman

Import [postman/EMS.postman_collection.json](./postman/EMS.postman_collection.json). Run **Login**, copy `data.token` from the JSON body into the collection variable **`token`** for secured requests.

## Screenshots (submission)

Create `docs/screenshots/` if needed, add PNGs (for example: login, employees table, department dialog, roles, dark mode), and reference them here or in your course report. See the **Course deliverables** table in [Specification coverage and checklist](#specification-coverage-and-checklist) above.

## Demo video

Record a **3–5 minute** walkthrough (Loom/YouTube) showing register/login, CRUD for each resource, role assignment, and optional Docker run. **Paste your video URL below when you upload it.**

- **Video link:** _(add Loom / YouTube URL here)_

## AI tooling disclosure

This repository was bootstrapped and implemented with assistance from **AI coding tools** (architecture, Spring/React code, tests, Docker, and README). You should review every file, run the app locally, and adjust secrets, copy, and visuals to match your course’s submission rules.

## Project layout

```
backend/          Spring Boot API
frontend/         React (Vite) SPA
postman/          Postman collection
docs/screenshots/ Add submission PNGs here (create folder if missing)
schema.sql        Standalone schema + seed
docker-compose.yml
LICENSE            MIT license
EMPLOYEE_MANAGEMENT_SYSTEM.md
```
