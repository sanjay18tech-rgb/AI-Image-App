# Modelia AI Studio - Frontend

A modern React-based frontend application for AI-powered fashion design generation, built with TypeScript, Material UI, and React Hook Form.

## Overview

Modelia AI Studio is a full-featured fashion design generation platform that allows users to create stunning fashion visuals using AI. The frontend provides an intuitive, polished interface with real-time validation, image upload and preview, generation history management, and seamless authentication flow.

## Features

### 🔐 Authentication
- **Secure JWT-based authentication** with bcrypt password hashing
- **Sign up / Log in** with email and password
- **Form validation** using React Hook Form + Zod with real-time error messages
- **Persistent sessions** using Zustand state management
- **Automatic token refresh** and session restoration

### 🎨 Fashion Design Generation
- **Image upload** with preview and validation (JPEG/PNG, max 10MB)
- **Prompt-based generation** with minimum 5 character requirement
- **Character counter** and validation feedback
- **Prompt suggestions** tailored to selected styles
- **Example prompts** for quick start
- **Automatic form clearing** after successful generation

### 📜 Generation History
- **Recent generations display** (last 5 items)
- **One-click restore** to reuse previous prompts and images
- **Generation cards** with preview images, styles, and timestamps
- **Image restoration** from previous generations

### 🎯 User Interface
- **Material UI components** with custom gradient themes
- **Responsive design** for desktop and mobile devices
- **Glass morphism effects** with backdrop blur
- **Smooth animations** and transitions
- **Loading states** and progress indicators
- **Error handling** with user-friendly messages

### 🔄 Advanced Features
- **Generation abort** capability via AbortController
- **Retry logic** for failed generations
- **Status notifications** for all operations
- **Real-time validation** feedback
- **Image preview** before upload

## Tech Stack

### Core
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Material UI (MUI) v7** - Component library
- **Emotion** - CSS-in-JS styling
- **Custom theme** with gradient color palette

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - Schema validation with TypeScript inference
- **@hookform/resolvers** - Zod resolver integration

### State Management
- **Zustand** - Lightweight state management
- **React Hooks** - Custom hooks for data fetching and retry logic

### HTTP Client
- **Axios** - Promise-based HTTP client
- **Request interceptors** for JWT token injection
- **Error handling** with proper status codes

### Testing
- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **Coverage reports** with v8 provider

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **TypeScript ESLint** - Type-aware lint rules
- **PostCSS** - CSS processing
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Sign up / Login form
│   │   ├── AuthIntro.tsx    # Authentication intro section
│   │   ├── Studio.tsx       # Main generation interface
│   │   ├── PromptSuggestions.tsx  # Style-based prompt suggestions
│   │   ├── Upload.tsx       # Image upload component
│   │   └── ChatMessage.tsx  # Message component
│   ├── hooks/               # Custom React hooks
│   │   ├── useGenerate.ts   # Generation logic with retry
│   │   └── useRetry.ts      # Exponential retry mechanism
│   ├── lib/                 # Utilities and clients
│   │   └── api.ts           # Axios client configuration
│   ├── stores/              # State management
│   │   └── authStore.ts     # Zustand auth store
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── theme.ts             # Material UI theme configuration
│   ├── App.css              # Global styles
│   └── index.css            # Base styles
├── tests/                   # Test files
│   ├── Generate.test.tsx    # Generation component tests
│   └── useGenerate.test.ts  # Hook tests
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- **Node.js** 18+ (comes with npm)
- **Backend API** running on `http://127.0.0.1:4000` (see main README)

### Installation

1. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Set up environment variables** (create `frontend/.env`):
   ```env
   VITE_API_URL=http://127.0.0.1:4000
   ```

3. **Start development server**:
   ```bash
   # From project root
   npm run dev:frontend

   # Or from frontend directory
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build
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

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://127.0.0.1:4000` |

### API Client

The API client (`src/lib/api.ts`) is configured with:
- Base URL from environment variable
- Request interceptors for JWT token injection
- Response interceptors for error handling
- Automatic token refresh on 401 errors

### Theme Configuration

The Material UI theme (`src/theme.ts`) includes:
- Custom gradient color palette (purple to pink)
- Glass morphism effects
- Responsive typography
- Custom component styles

## Component Documentation

### `<Studio />`

Main generation interface component with:
- Image upload and preview
- Prompt input with validation
- Generation history display
- Restore functionality
- Status notifications

**Props:** None (uses Zustand store for auth state)

**Key Features:**
- Real-time form validation
- Image file validation (type, size)
- Character counter for prompts
- Automatic form clearing after success

### `<AuthForm />`

Authentication form component with:
- Sign up / Log in toggle
- Email and password inputs
- Client-side validation
- Server error display
- Form state management

**Features:**
- Zod schema validation
- Real-time error messages
- Loading states
- Session persistence

### `useGenerate` Hook

Custom hook for generation logic:
- API integration
- Retry mechanism with exponential backoff
- Abort capability
- History management
- Error handling

**Returns:**
```typescript
{
  generate: (payload: GeneratePayload) => Promise<GenerationRecord>;
  abort: () => void;
  resetError: () => void;
  isGenerating: boolean;
  error: string | null;
  history: GenerationRecord[];
  attemptNumber: number;
  attemptsRemaining: number;
  maxAttempts: number;
  buildAssetUrl: (url: string) => string;
}
```

### `useRetry` Hook

Exponential retry mechanism:
- Configurable max attempts
- Base delay with exponential backoff
- Custom retry conditions
- Attempt callbacks

## Form Validation

### Validation Rules

**Email:**
- Required field
- Valid email format
- User-friendly error messages

**Password:**
- Required field
- Minimum 8 characters
- Clear validation feedback

**Prompt:**
- Required field
- Minimum 5 characters (after trimming)
- Maximum 500 characters
- Real-time character counter

**Image:**
- Required for generation
- File type: JPEG or PNG only
- Maximum size: 10MB
- Preview before upload

### Error Messages

All validation errors use user-friendly messages:
- Clear, actionable feedback
- Field-specific error display
- Server error handling
- Consistent message format

## State Management

### Zustand Store (`authStore`)

Manages authentication state:
- User information
- JWT token
- Session persistence (localStorage)
- Hydration on app load
- Sign out functionality

### Local Component State

Components use React hooks for:
- Form state (React Hook Form)
- UI state (loading, errors, modals)
- Component-specific data

## API Integration

### Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Authenticate user |
| POST | `/generations` | Create new generation |
| GET | `/generations?limit=5` | Fetch generation history |

### Request Format

**Authentication:**
```typescript
POST /auth/signup | /auth/login
Body: { email: string, password: string }
```

**Generation:**
```typescript
POST /generations
Content-Type: multipart/form-data
Body: {
  prompt: string,
  style: string,
  image: File
}
Headers: {
  Authorization: Bearer <token>
}
```

### Response Format

**Authentication:**
```typescript
{
  user: { id: string, email: string, createdAt: string },
  token: string
}
```

**Generation:**
```typescript
{
  id: string,
  prompt: string,
  style: string,
  imageUrl: string,
  status: string,
  createdAt: string
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Structure

- **Component tests**: Test UI components and user interactions
- **Hook tests**: Test custom hooks and logic
- **Integration tests**: Test component integration

### Coverage

Coverage reports are generated in `coverage/` directory and include:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## Building for Production

### Build Process

```bash
npm run build
```

This will:
1. Type-check the codebase
2. Build optimized production bundle
3. Generate assets in `dist/` directory

### Build Output

- `dist/index.html` - Entry HTML file
- `dist/assets/` - Optimized JS and CSS bundles
- `dist/` - Static assets

### Preview Production Build

```bash
npm run preview
```

## Docker Deployment

The frontend uses a multi-stage Dockerfile optimized for production:

**Dockerfile Stages:**

1. **Base**: Node.js 18 Alpine base image
2. **Deps**: Install dependencies
3. **Builder**: Build React application with Vite
4. **Runner**: Serve static files with nginx Alpine

**Key Features:**

- **Multi-stage build** for minimal production image size
- **Nginx Alpine** for efficient static file serving
- **Build-time API URL** configuration via `VITE_API_URL` build arg
- **Gzip compression** enabled for better performance
- **Security headers** configured (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- **Cache headers** for static assets (1 year expiration)
- **SPA routing** support (all routes serve index.html)

**Dockerfile Structure:**
```dockerfile
# Multi-stage build process
FROM node:18-alpine AS base
FROM base AS deps        # Install dependencies
FROM base AS builder     # Build with Vite (uses VITE_API_URL arg)
FROM nginx:alpine AS runner  # Serve with nginx
```

**Running with Docker Compose:**

The frontend is configured to run with Docker Compose (see main `README.md`). The compose file:
- Builds the frontend with build-time `VITE_API_URL` argument
- Serves the application via nginx on port 80
- Depends on the backend API service
- Uses the same Docker network for service communication

**Manual Docker Build:**

```bash
# Build the image with API URL
docker build \
  --build-arg VITE_API_URL=http://localhost:4000 \
  -t modelia-fe ./frontend

# Run the container
docker run -p 80:80 modelia-fe
```

**Nginx Configuration:**

The frontend includes a custom `nginx.conf` with:
- Gzip compression for text-based assets
- Security headers
- SPA routing (try_files fallback to index.html)
- Long-term caching for static assets
- Optimized MIME types

**Environment Variables:**

The API URL must be set at **build time** using the `VITE_API_URL` build argument. This is because Vite replaces environment variables during the build process, not at runtime.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code splitting** with Vite
- **Tree shaking** for minimal bundle size
- **Lazy loading** for routes (if implemented)
- **Optimized images** and assets
- **Fast refresh** in development

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Run linter before committing
5. Ensure all tests pass

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

**API connection errors:**
- Verify backend is running
- Check `VITE_API_URL` environment variable
- Ensure CORS is configured on backend

**Build errors:**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify all dependencies are installed

## License

ISC
