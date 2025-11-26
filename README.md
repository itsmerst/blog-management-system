# Blog Management System - Final Starter

This zip contains:

- backend/ (Spring Boot, MariaDB, JWT + refresh, categories/tags/comments, tests)
- frontend/ (Vite + React + Quill, full CRUD UI, silent refresh)
- JWT-based auth with roles: ROLE_ADMIN, ROLE_AUTHOR, ROLE_READER
- Swagger UI at http://localhost:8080/swagger-ui.html

Steps:

1. MariaDB:
   - CREATE DATABASE blogdb;
   - Update backend/src/main/resources/application.properties with your DB credentials and a strong jwt.secret.

2. Backend:
   - cd backend
   - mvn clean package
   - mvn spring-boot:run

3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
   - Open http://localhost:5173

4. Tests:
   - cd backend
   - mvn test
