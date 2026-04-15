# Postman collection — exported API requests

This folder contains the **Postman Collection v2.1** export for the Employee Management System REST API.

## File

| File | Description |
|------|-------------|
| [EMS.postman_collection.json](./EMS.postman_collection.json) | All public auth routes and JWT-protected CRUD routes for departments, employees, roles, and employee–role assignments |

## Import into Postman

1. Open **Postman** → **Import** → **File** → choose `EMS.postman_collection.json`.
2. Open the imported collection **Employee Management System API**.
3. Confirm collection variables:
   - **`baseUrl`**: `http://localhost:8080` (or your API host).
   - **`token`**: left empty until you log in.

## Auth workflow

1. Start the backend (`cd backend && mvn spring-boot:run` or Docker Compose).
2. Run **Auth → Login** (body uses seed user `admin` / `password`).
3. The request **Tests** script saves `data.token` from the JSON response into the collection variable **`token`**.
4. Run any folder under **Departments**, **Employees**, **Roles**, or **Employee roles**; they send `Authorization: Bearer {{token}}`.

If you prefer to set the token by hand, run Login once, copy `data.token` from the response, and paste it into the collection variable **`token`**.

## Request groups

- **Auth** — `POST` register, `POST` login  
- **Departments** — list, create, get by id, update, delete  
- **Employees** — list, create, get by id, update, delete  
- **Roles** — list, get by id, create, update, delete  
- **Employee roles** — list assignments for an employee, assign role, unassign role  

Sample JSON bodies match the API DTOs (`name` / `location` for departments, `payGrade` camelCase for roles, etc.).
