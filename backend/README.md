# Backend - Spring Boot + MariaDB + JWT + Refresh + CRUD

- JWT auth with access + refresh tokens
- Entities: User, Post, Category, Tag, Comment, RefreshToken
- Full CRUD for posts, categories, tags, comments
- Method-level RBAC via @PreAuthorize
- CORS for Vite (http://localhost:5173)
- Swagger UI at /swagger-ui.html

Tests:
- JwtUtilTest: simple token round-trip
- AuthIntegrationTest: register + login using H2 test DB (profile `test`)

To run tests:
  cd backend
  mvn test
