# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

City Inventory Management System - A full-stack web application for managing institutional inventory with role-based access control, requisition workflows, and comprehensive reporting capabilities.

**Tech Stack:**
- Backend: Node.js, Express.js, Prisma ORM, PostgreSQL
- Frontend: React 19, Vite, Material-UI, TanStack Query, Tailwind CSS
- Authentication: JWT with bcryptjs
- Database: PostgreSQL (hosted on Supabase)

## Development Commands

### Backend (Node.js/Express API)
```bash
cd backend

# Development
npm run dev                 # Start development server with nodemon
npm start                  # Start production server

# Database operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open Prisma Studio database UI
npm run seed               # Seed database with initial data

# Install dependencies
npm install
```

### Frontend (React/Vite)
```bash
cd frontend

# Development
npm run dev                # Start development server (localhost:3000)
npm run build              # Build for production
npm run preview            # Preview production build locally
npm run lint               # Run ESLint

# Install dependencies
npm install
```

### Full Stack Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## Architecture Overview

### Backend Architecture
- **Express Server** (`src/index.js`): Main server with middleware stack including CORS, helmet, rate limiting
- **Controllers**: Business logic organized by domain (auth, items, requisitions, etc.)
- **Routes**: RESTful API endpoints with role-based authorization
- **Middleware**: Authentication (`auth.js`) and validation (`validation.js`)
- **Prisma ORM**: Database layer with schema-first approach
- **Services**: External integrations (email, notifications, scheduling)

### Frontend Architecture
- **React Router**: Client-side routing with protected routes
- **Context Providers**: Authentication and theme management
- **TanStack Query**: Server state management with caching
- **Material-UI**: Component library with custom theming
- **Page Structure**: Organized by feature domains (Dashboard, Inventory, Requisitions, etc.)
- **Custom Hooks**: Reusable logic for API calls and UI interactions

### Database Schema (Prisma)
Key entities and relationships:
- **User**: 5 roles with department associations
- **Department**: Organizational units for requisition workflows
- **Item**: Inventory items with categories and stock tracking
- **Requisition**: Request workflow with approval states
- **Transaction**: Stock movements (RECEIVE, ISSUE, ADJUST)
- **ServiceRequest**: Non-inventory service requests

### Role-Based Access Control
- **ADMIN**: Full system access, user management
- **STOREKEEPER**: Inventory management, fulfillment
- **DEPARTMENT_HEAD**: Department requisitions, approvals  
- **PROCUREMENT_OFFICER**: Purchase approvals, vendor management
- **AUDITOR**: Read-only access for compliance

## Key Development Patterns

### API Structure
- RESTful endpoints under `/api/` prefix
- JWT authentication required (except `/api/auth`)
- Role-based authorization middleware
- Consistent error handling and response format
- Rate limiting and security headers

### Frontend State Management
- **Server State**: TanStack Query for API data with 5-minute stale time
- **Client State**: React Context for auth and theme
- **Local State**: React hooks for component state
- **Form State**: Controlled components with validation

### Database Patterns
- **Prisma Relations**: Proper foreign keys and cascading
- **Audit Trail**: Created/updated timestamps on all entities
- **Soft Deletes**: Avoided in favor of status fields
- **Indexing**: Strategic indexes on frequently queried fields

## Environment Setup

### Required Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=City Inventory Management System
VITE_APP_VERSION=1.0.0
```

### Database Setup
1. Set up PostgreSQL database (Supabase recommended)
2. Configure `DATABASE_URL` and `DIRECT_URL` in backend `.env`
3. Run `npm run prisma:push` to create tables
4. Run `npm run seed` to populate initial data

## Common Development Tasks

### Adding New Features
1. **Backend**: Create controller → route → middleware (if needed)
2. **Database**: Update Prisma schema → `prisma:push` → update types
3. **Frontend**: Create page component → add route → implement API calls

### Testing API Endpoints
- Use Prisma Studio: `npm run prisma:studio`
- Backend runs on `http://localhost:5000`
- Health check endpoint: `/api/health`

### Adding New User Roles
1. Update `UserRole` enum in `prisma/schema.prisma`
2. Update authorization middleware in `backend/src/middleware/auth.js`
3. Update frontend role checks in `AuthContext.jsx` and protected routes

### Database Migrations
- Schema changes: Update `schema.prisma` → `prisma:push`
- For production: Use `prisma migrate` instead of `prisma:push`
- Seed data: Modify `prisma/seed.js` and run `npm run seed`

## API Integration Patterns

### Frontend API Calls
- Use `@tanstack/react-query` for server state
- Custom hooks in `src/hooks/` for reusable API logic
- Centralized API configuration in `src/services/api.js`
- Automatic token refresh and error handling

### Error Handling
- Backend: Consistent error responses with HTTP status codes
- Frontend: Global error boundary and per-component error states
- Authentication: Automatic redirect on 401 responses

### Data Fetching
- **Queries**: Use TanStack Query with appropriate cache keys
- **Mutations**: Optimistic updates where appropriate
- **Real-time**: WebSockets not implemented (consider for notifications)