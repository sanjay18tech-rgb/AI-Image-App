# Modelia AI Studio

A full-stack AI fashion generation platform built with React, TypeScript, Express, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with bcrypt password hashing
- 🎨 Polished Material UI studio interface with live validations
- 📸 Image upload with preview and restoration of past generations
- 🔄 Exponential retry logic with graceful overload handling
- ⏹️ Abort generation capability via `AbortController`
- 📜 Generation history (last 5) with one-click restore
- 🎯 Style and colour theme selection
- 💡 Prompt suggestions tailored to the selected style

## Tech Stack

### Frontend
- React 19 + Vite + TypeScript
- Material UI + Emotion
- React Hook Form + Zod for validation
- Axios + Zustand state management
- Vitest + React Testing Library for unit tests
- Playwright for end-to-end coverage

### Backend
- Node.js + Express + TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication and bcrypt hashing
- Multer for uploads and Zod validation
- Jest + Supertest for integration tests
- Docker multi-stage builds for production

## Getting Started

### Prerequisites
- Node.js 18+
- npm (comes with Node.js)

> **Database:** The project uses PostgreSQL. Ensure `DATABASE_URL` points at a running PostgreSQL instance before starting the backend.

### Installation

1. Clone the repository
   ```bash
   git clone 'https://github.com/sanjay18tech-rgb/AI-Image-App.git'
   cd ai-image-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables

   Backend (`backend/.env`):
   env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/modelia"
   JWT_SECRET="super-secret-key"
   TOKEN_EXPIRES_IN="1d"
   UPLOAD_DIR="uploads"
   CLIENT_URL="http://127.0.0.1:5173"
   

  > Update `DATABASE_URL` with the credentials for your PostgreSQL instance.

   Frontend (`frontend/.env`):
   ```env
   VITE_API_URL="http://127.0.0.1:4000"
   ```

4. Synchronise the database schema and generate the Prisma client
   ```bash
   npm run prisma:push --workspace backend
   npm run prepare --workspace backend
   ```

5. Start the full stack in development mode
   ```bash
   npm run dev
   ```

   Frontend: http://127.0.0.1:5173  
   Backend:  http://127.0.0.1:4000

### Docker (Optional)

Run the entire stack (API + DB + FE) using Docker Compose:

```bash
docker-compose up
```

This will:
- Start a PostgreSQL 16 database container with health checks
- Build and start the backend API container (multi-stage build with Prisma)
- Build and start the frontend container (served via nginx)
- Automatically run database migrations on backend startup
- Set up a dedicated Docker network for service communication

The application will be available at:
- Frontend: http://localhost:80 (nginx)
- Backend API: http://localhost:4000
- Database: localhost:5432

**Docker Services:**

1. **Database (`db`)**:
   - PostgreSQL 16 Alpine image
   - Persistent volume for data (`postgres_data`)
   - Health check configured
   - Exposed on port 5432

2. **Backend API (`api`)**:
   - Multi-stage Dockerfile (optimized for production)
   - Runs as non-root user (nodejs)
   - Automatic Prisma client generation
   - Database migrations run on startup
   - Health check endpoint configured
   - Uploads directory mounted as volume
   - Exposed on port 4000

3. **Frontend (`fe`)**:
   - Multi-stage Dockerfile (build with Node, serve with nginx)
   - Nginx Alpine image for serving static files
   - Build-time API URL configuration
   - Gzip compression enabled
   - Security headers configured
   - Exposed on port 80

**Docker Commands:**

To run in detached mode:
```bash
docker-compose up -d
```

To view logs:
```bash
docker-compose logs -f
```

To stop all services:
```bash
docker-compose down
```

To stop and remove volumes (including database data):
```bash
docker-compose down -v
```

To rebuild containers after code changes:
```bash
docker-compose up --build
```

**Environment Variables for Docker:**

You can customize the Docker setup by creating a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key-here
TOKEN_EXPIRES_IN=1d
```

If not provided, default values will be used (see `docker-compose.yml`).

**Docker Network:**

All services communicate through a dedicated bridge network (`modelia-network`), ensuring secure service-to-service communication.

**Volume Mounts:**

- `./backend/uploads` → `/app/uploads` (backend container) - Persistent image storage
- `postgres_data` → `/var/lib/postgresql/data` (database container) - Persistent database storage

## Available Scripts

```bash
# Backend only	npm run dev:backend
# Frontend only	npm run dev:frontend
# Build		npm run build
# Lint		npm run lint
# Unit tests + coverage	npm run coverage
# End-to-end tests (Playwright)	npm run test:e2e
```

Coverage reports are written to `backend/coverage` and `frontend/coverage` and uploaded as CI artefacts.

## Project Structure

```
ai-image-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling, upload
│   │   ├── routes/         # API surface
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers & Prisma client
│   ├── tests/              # Jest + Supertest integration tests
│   └── prisma/             # Prisma schema
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks (retry, generate)
│   │   ├── lib/            # Axios client
│   │   └── stores/         # Zustand auth store
│   └── tests/              # Vitest + Testing Library specs
├── tests/e2e/              # Playwright workflow
└── playwright.config.ts    # E2E configuration
```

## API Overview

A detailed specification is available in [`OPENAPI.yaml`](./OPENAPI.yaml).

### Summary

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/auth/signup` | Create a new user account |
| POST | `/auth/login` | Obtain a JWT token |
| POST | `/generations` | Create a generation (multipart upload, protected) |
| GET  | `/generations?limit=5` | Fetch the most recent 5 generations |

## Continuous Integration

GitHub Actions (`.github/workflows/ci.yml`) runs linting, unit tests with coverage, installs Playwright browsers, executes the end-to-end suite, and uploads coverage artefacts on every push and pull request.

## License

ISC

