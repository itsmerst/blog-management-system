# Frontend - Vite + React + Quill + Silent Refresh

- Auth flow (login/register)
- Role-based dashboards: Admin, Author, Reader
- Admin: manage users, categories, tags, comments (edit/delete)
- Author: full CRUD UI for posts with Quill rich-text editor
- Reader: browse posts, view rich-text content, add comments
- apiFetch wrapper does silent refresh using refresh tokens on 401

Run:
  cd frontend
  npm install
  npm run dev
