# Modelia AI Studio - Backend API

A robust Node.js/Express REST API for AI-powered fashion design generation, built with TypeScript, PostgreSQL, Prisma ORM, and JWT authentication.

## Overview

The backend API provides secure authentication, image upload handling, generation management, and database operations for the Modelia AI Studio platform. It follows RESTful principles with comprehensive error handling, validation, and testing.

## Features

### 🔐 Authentication & Security
- **JWT-based authentication** with configurable token expiration
- **Bcrypt password hashing** with salt rounds
- **Protected routes** with authentication middleware
- **Password validation** (minimum 8 characters)
- **Email validation** with Zod schemas
- **Secure error messages** to prevent information leakage

### 📸 Image Upload & Management
- **Multipart file upload** using Multer
- **Image validation** (JPEG/PNG only, max 10MB)
- **Upload directory management** with automatic creation
- **Static file serving** for generated images
- **File naming** with unique identifiers
- **Image URL generation** for client access

### 🎨 Generation Management
- **Generation creation** with prompt and style
- **Generation history** with pagination (limit support)
- **User-specific generations** with proper access control
- **Generation status tracking** (completed, pending, failed)
- **Simulated generation delay** for realistic behavior
- **Model overload simulation** with configurable chance

### 🗄️ Database
- **PostgreSQL database** with Prisma ORM
- **User management** with email uniqueness
- **Generation tracking** with timestamps
- **Cascade deletion** for user generations
- **Database migrations** with Prisma
- **Database seeding** support

### ✅ Validation & Error Handling
- **Zod schema validation** for all inputs
- **Type-safe validation** with TypeScript
- **User-friendly error messages** with field-level errors
- **Centralized error handling** middleware
- **HTTP status codes** for proper error responses
- **Validation error formatting** for frontend consumption

### 🧪 Testing
- **Jest** for unit and integration tests
- **Supertest** for HTTP endpoint testing
- **Test database** isolation with separate database
- **Test coverage** reporting with coverage thresholds
- **Global test setup** and teardown
- **Test data cleanup** between tests

## Tech Stack

### Core
- **Node.js** 18+ - JavaScript runtime
- **Express 5** - Web framework
- **TypeScript** - Type-safe development
- **tsx** - TypeScript execution for development

### Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit and ORM
- **Prisma Client** - Type-safe database client

### Authentication
- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie parsing middleware

### File Upload
- **Multer** - Multipart form data handling
- **File system** - Local file storage

### Validation
- **Zod** - Schema validation library
- **Type-safe schemas** - Runtime and compile-time validation

### Testing
- **Jest** - Testing framework
- **ts-jest** - TypeScript Jest preset
- **Supertest** - HTTP assertion library
- **Test database** - Isolated test environment

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - Type-aware linting
- **Prettier** - Code formatting
- **dotenv** - Environment variable management

### Utilities
- **CORS** - Cross-origin resource sharing
- **Express JSON** - JSON body parsing
- **Express URL-encoded** - Form data parsing

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── env.ts           # Environment variable validation
│   ├── controllers/         # Route handlers
│   │   ├── authController.ts      # Authentication endpoints
│   │   └── generationController.ts # Generation endpoints
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication middleware
│   │   ├── errorHandler.ts  # Error handling middleware
│   │   └── upload.ts        # File upload middleware
│   ├── routes/              # API routes
│   │   ├── auth.ts          # Authentication routes
│   │   └── generations.ts   # Generation routes
│   ├── schemas/             # Zod validation schemas
│   │   ├── auth.ts          # Authentication schemas
│   │   └── generation.ts    # Generation schemas
│   ├── services/            # Business logic
│   │   ├── authService.ts   # Authentication service
│   │   └── generationService.ts # Generation service
│   ├── utils/               # Utility functions
│   │   ├── asyncHandler.ts  # Async error handler wrapper
│   │   ├── ensureUploadDir.ts # Upload directory creation
│   │   └── token.ts         # JWT token utilities
│   ├── lib/                 # External libraries
│   │   └── prisma.ts        # Prisma client instance
│   ├── types/               # TypeScript type definitions
│   │   └── express.d.ts     # Express type extensions
│   ├── app.ts               # Express app configuration
│   └── index.ts             # Application entry point
├── prisma/
│   ├── schema.prisma        # Prisma schema definition
│   ├── dev.db               # Development database (SQLite, optional)
│   ├── test.db              # Test database (SQLite, optional)
│   └── playwright.db        # Playwright test database (SQLite, optional)
├── tests/                   # Test files
│   ├── auth.test.ts         # Authentication tests
│   └── generation.test.ts   # Generation tests
├── uploads/                 # Uploaded files directory
├── dist/                    # Compiled JavaScript output
├── coverage/                # Test coverage reports
├── jest.config.cjs          # Jest configuration
├── jest.setup.ts            # Jest setup file
├── jest.globalSetup.ts      # Global test setup
├── jest.globalTeardown.ts   # Global test teardown
├── tsconfig.json            # TypeScript configuration
├── prisma.config.ts         # Prisma configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- **Node.js** 18+ (comes with npm)
- **PostgreSQL** database instance
- **npm** package manager

### Installation

1. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Set up environment variables** (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/modelia
   JWT_SECRET=your-super-secret-key-change-in-production
   TOKEN_EXPIRES_IN=1d
   UPLOAD_DIR=uploads
   CLIENT_URL=http://127.0.0.1:5173
   ```

3. **Set up database**:
   ```bash
   # Push schema to database
   npm run prisma:push --workspace backend

   # Generate Prisma client
   npm run prepare --workspace backend
   ```

4. **Start development server**:
   ```bash
   # From project root
   npm run dev:backend

   # Or from backend directory
   npm run dev
   ```

5. **Verify server is running**:
   ```bash
   curl http://localhost:4000/health
   # Should return: {"status":"ok"}
   ```

## Available Scripts

### Development
```bash
npm run dev              # Start dev server with hot reload (tsx watch)
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
```

### Database
```bash
npm run prisma:format    # Format Prisma schema
npm run prisma:migrate   # Create and run migrations
npm run prisma:deploy    # Deploy migrations to production
npm run prisma:push      # Push schema changes to database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prepare          # Generate Prisma client
```

### Testing
```bash
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Code Quality
```bash
npm run lint             # Lint code with ESLint
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `TOKEN_EXPIRES_IN` | JWT token expiration time | No | `1d` |
| `UPLOAD_DIR` | Upload directory path | No | `uploads` |
| `CLIENT_URL` | Frontend URL for CORS | No | - |
| `MODEL_OVERLOAD_CHANCE` | Chance of model overload (0-1) | No | `0.2` |

### Database Configuration

The API uses **PostgreSQL** as the primary database. The connection string format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://postgres:postgres@localhost:5432/modelia
```

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`:

- **User** model: User accounts with email and password hash
- **Generation** model: Fashion design generations with prompt, style, and image URL

### JWT Configuration

- **Token expiration**: Configurable via `TOKEN_EXPIRES_IN` (default: 1 day)
- **Token secret**: Must be set via `JWT_SECRET` environment variable
- **Token payload**: Contains user ID and email (`sub`, `email`)

## API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

#### Authentication

##### Sign Up

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

**Errors:**
- `400`: Validation failed
- `409`: Email already registered

##### Log In

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

**Errors:**
- `400`: Validation failed
- `401`: Invalid credentials

#### Generations

##### Create Generation

```http
POST /generations
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "prompt": "A modern fashion design",
  "style": "Editorial",
  "image": <file>
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "prompt": "A modern fashion design",
  "style": "Editorial",
  "imageUrl": "/uploads/filename.png",
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400`: Validation failed or image missing
- `401`: Unauthorized
- `503`: Model overloaded

##### List Generations

```http
GET /generations?limit=5
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "prompt": "A modern fashion design",
      "style": "Editorial",
      "imageUrl": "/uploads/filename.png",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Query Parameters:**
- `limit`: Number of generations to return (1-20, default: 5)

**Errors:**
- `400`: Invalid query parameters
- `401`: Unauthorized

### Authentication

All generation endpoints require authentication via JWT token:

```http
Authorization: Bearer <token>
```

The token should be included in the `Authorization` header of each request.

### Error Responses

#### Validation Error (400)

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address",
    "password": "Password must be at least 8 characters long"
  }
}
```

#### Unauthorized (401)

```json
{
  "message": "Unauthorized"
}
```

#### Conflict (409)

```json
{
  "message": "Email already registered"
}
```

#### Service Unavailable (503)

```json
{
  "message": "Model overloaded"
}
```

#### Internal Server Error (500)

```json
{
  "message": "Internal server error"
}
```

## Services

### Auth Service

Handles user authentication and account creation:

- `createUser(input)`: Create new user account
- `authenticateUser(input)`: Authenticate user and return user data

**Features:**
- Email uniqueness validation
- Password hashing with bcrypt
- Safe user data (excludes password hash)
- Error handling with proper status codes

### Generation Service

Handles generation creation and retrieval:

- `createGeneration(userId, input, filename)`: Create new generation
- `listGenerations(userId, limit)`: List user's generations

**Features:**
- Simulated generation delay (1-2 seconds)
- Model overload simulation (configurable chance)
- User-specific generation access
- Generation status tracking
- Timestamp management

## Middleware

### Authentication Middleware

`requireAuth` middleware validates JWT tokens:

- Extracts token from `Authorization` header
- Verifies token signature and expiration
- Attaches user information to request object
- Returns 401 if token is invalid or missing

### Error Handler Middleware

Centralized error handling:

- Formats Zod validation errors
- Handles custom error status codes
- Logs server errors (500)
- Returns consistent error responses
- Prevents error information leakage

### Upload Middleware

File upload handling with Multer:

- Accepts single file uploads
- Validates file type (JPEG/PNG only)
- Validates file size (max 10MB)
- Generates unique filenames
- Saves files to upload directory

## Validation

### Zod Schemas

All input validation uses Zod schemas:

#### Auth Schema

```typescript
{
  email: string (valid email, required)
  password: string (min 8 characters, required)
}
```

#### Generation Schema

```typescript
{
  prompt: string (min 5 characters, max 500 characters, required)
  style: enum ["Editorial", "Streetwear", "Runway", "Minimalist"]
}
```

#### Query Schema

```typescript
{
  limit: number (min 1, max 20, default: 5)
}
```

### Validation Features

- **Type-safe validation** with TypeScript
- **User-friendly error messages** with field-level errors
- **Runtime validation** for all inputs
- **Automatic error formatting** for frontend consumption

## Database

### Prisma ORM

The API uses Prisma ORM for database operations:

- **Type-safe queries** with Prisma Client
- **Database migrations** with Prisma Migrate
- **Schema management** with Prisma Schema
- **Database introspection** for existing databases

### Models

#### User

```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  generations  Generation[]
}
```

#### Generation

```prisma
model Generation {
  id        String   @id @default(uuid())
  prompt    String
  style     String
  imageUrl  String
  status    String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Database Operations

- **User creation**: Create new user accounts
- **User lookup**: Find users by email
- **Generation creation**: Create new generations
- **Generation listing**: List user's generations
- **Cascade deletion**: Delete user's generations on user deletion

## Testing

### Test Setup

Tests use Jest with Supertest for HTTP testing:

- **Test database**: Isolated test database (SQLite for tests, PostgreSQL for production)
- **Global setup**: Database initialization before tests
- **Global teardown**: Database cleanup after tests
- **Test isolation**: Each test runs in isolation
- **Coverage reporting**: Comprehensive coverage reports

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Authentication tests**: Sign up, login, validation
- **Generation tests**: Create, list, authentication
- **Integration tests**: Full API endpoint testing
- **Error handling tests**: Error response validation

### Test Coverage

Coverage reports are generated in `coverage/` directory:

- **Line coverage**: Percentage of lines executed
- **Function coverage**: Percentage of functions called
- **Branch coverage**: Percentage of branches executed
- **Statement coverage**: Percentage of statements executed

## Building for Production

### Build Process

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate source maps
3. Output to `dist/` directory

### Production Start

```bash
npm run start
```

This will:
1. Start the Node.js server
2. Serve from `dist/` directory
3. Use production environment variables

### Production Considerations

- **Environment variables**: Set all required variables
- **Database migrations**: Run migrations before start
- **Upload directory**: Ensure upload directory exists
- **CORS configuration**: Configure allowed origins
- **JWT secret**: Use strong, unique secret key
- **Error logging**: Set up proper logging
- **Process management**: Use PM2 or similar
- **Reverse proxy**: Use Nginx or similar

## Security

### Best Practices

- **Password hashing**: Bcrypt with salt rounds
- **JWT tokens**: Secure token generation and verification
- **Input validation**: Zod schema validation for all inputs
- **Error messages**: Prevent information leakage
- **CORS configuration**: Restrict allowed origins
- **File upload validation**: Type and size validation
- **SQL injection prevention**: Prisma ORM parameterized queries
- **XSS prevention**: Input sanitization

### Security Headers

Consider adding security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## Deployment

### Environment Setup

1. **Set environment variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Strong secret key
   - `NODE_ENV`: `production`
   - `PORT`: Server port
   - `CLIENT_URL`: Frontend URL

2. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start the server**:
   ```bash
   npm run start
   ```

### Docker Deployment

The backend uses a multi-stage Dockerfile optimized for production:

**Dockerfile Stages:**

1. **Base**: Node.js 18 Alpine base image
2. **Deps**: Install dependencies and copy Prisma schema
3. **Prisma Generate**: Generate Prisma client
4. **Builder**: Build TypeScript application
5. **Runner**: Production runtime with minimal dependencies

**Key Features:**

- **Multi-stage build** for smaller image size
- **Non-root user** (nodejs:nodejs) for security
- **Production-only dependencies** in final image
- **Prisma client generation** in build and runtime stages
- **Health check** configured for container orchestration
- **Automatic migrations** via docker-compose command

**Dockerfile Structure:**
```dockerfile
# Multi-stage build process
FROM node:18-alpine AS base
FROM base AS deps        # Install dependencies
FROM deps AS prisma-generate  # Generate Prisma client
FROM base AS builder     # Build TypeScript
FROM base AS runner      # Production runtime
```

**Running with Docker Compose:**

The backend is configured to run with Docker Compose (see main `README.md`). The compose file:
- Sets up PostgreSQL database with health checks
- Runs migrations automatically on startup (`npx prisma migrate deploy`)
- Mounts uploads directory as volume
- Configures environment variables
- Sets up service dependencies

**Manual Docker Build:**

```bash
# Build the image
docker build -t modelia-api ./backend

# Run the container
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/modelia \
  -e JWT_SECRET=your-secret-key \
  -v $(pwd)/backend/uploads:/app/uploads \
  modelia-api
```

### Process Management

Use PM2 or similar for process management:
```bash
pm2 start dist/index.js --name "modelia-api"
```

## Troubleshooting

### Common Issues

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials
- Verify network connectivity

**JWT token errors:**
- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure token format is correct
- Verify token signature

**File upload errors:**
- Check upload directory permissions
- Verify file size limits
- Ensure file type is supported
- Check disk space

**Validation errors:**
- Check request body format
- Verify required fields are present
- Check field types and formats
- Review error messages

### Debugging

Enable debug logging:
```bash
DEBUG=* npm run dev
```

Check logs:
```bash
# Application logs
npm run dev

# Test logs
npm run test
```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Run linter before committing
5. Ensure all tests pass
6. Update API documentation

## License

ISC

