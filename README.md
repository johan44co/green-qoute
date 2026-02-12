# Green Quote

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the database credentials in `.env` if needed.

### 3. Start PostgreSQL Database

```bash
yarn db:start
```

This will start PostgreSQL in Docker on `localhost:5432`.

### 4. Generate Prisma Client

```bash
yarn prisma:generate
```

This generates the Prisma Client from your schema.

### 5. Run the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

The project uses PostgreSQL running in Docker.

### Available Commands

- `yarn db:start` - Start PostgreSQL
- `yarn db:stop` - Stop PostgreSQL
- `yarn db:logs` - View PostgreSQL logs
- `yarn db:reset` - Reset database (clears all data)
- `yarn db:psql` - Access PostgreSQL CLI

### Database Connection

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `green_quote`
- **Username:** `postgres`
- **Password:** Set in `.env` (default is `postgres`)

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/green_quote
```

## Prisma ORM

The project uses Prisma as the ORM for database operations.

### Prisma Commands

- `yarn prisma:generate` - Generate Prisma Client from schema
- `yarn prisma:migrate` - Create and apply database migrations
- `yarn prisma:studio` - Open Prisma Studio (database GUI)
- `yarn prisma:push` - Push schema changes to database (for development)

### Working with Prisma

1. **Define your models** in `prisma/schema.prisma`
2. **Generate the client** with `yarn prisma:generate`
3. **Create a migration** with `yarn prisma:migrate`
4. **Use Prisma Client** in your code:

```typescript
import prisma from "@/lib/prisma";

// Example: Fetch data
const users = await prisma.user.findMany();
```

The Prisma Client singleton is available at `src/lib/prisma.ts`.

## Better Auth

The project uses Better Auth for authentication.

### Authentication Features

- Email and password authentication
- Session management
- Built on top of Prisma ORM

### Using Better Auth

**Server-side (API routes, server components):**

```typescript
import { auth } from "@/lib/auth";

// Get session
const session = await auth.api.getSession({
  headers: request.headers,
});
```

**Client-side (React components):**

```typescript
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";

// In your component
const { data: session, isPending } = useSession();

// Sign up
await signUp.email({
  email: "user@example.com",
  password: "password",
  name: "John Doe",
});

// Sign in
await signIn.email({
  email: "user@example.com",
  password: "password",
});

// Sign out
await signOut();
```

### API Endpoints

Better Auth provides authentication endpoints at `/api/auth/*`. The main endpoints include:

- `POST /api/auth/sign-in/email` - Email/password sign in
- `POST /api/auth/sign-up/email` - Email/password sign up
- `POST /api/auth/sign-out` - Sign out current session
- `GET/POST /api/auth/get-session` - Get current session
- `POST /api/auth/update-user` - Update user information
- `GET /api/auth/list-sessions` - List all user sessions
- `POST /api/auth/revoke-session` - Revoke a specific session
- `POST /api/auth/revoke-sessions` - Revoke all sessions

See the [Better Auth API documentation](https://better-auth.com/docs/concepts/api) for all available endpoints.

### Admin Plugin

The project includes the Better Auth Admin plugin for user management capabilities.

#### Admin Features

- Create and manage users
- Assign user roles (admin/user)
- Ban/unban users
- Impersonate users
- Manage user sessions
- Update user information

#### Admin Usage

**Server-side:**

```typescript
import { auth } from "@/lib/auth";

// Check permissions
const hasPermission = await auth.api.userHasPermission({
  body: {
    userId: "user-id",
    permissions: { user: ["create"] },
  },
});
```

**Client-side:**

```typescript
import { authClient } from "@/lib/auth-client";

// Create a user (admin only)
await authClient.admin.createUser({
  email: "user@example.com",
  password: "secure-password",
  name: "John Doe",
  role: "user",
});

// List users
const users = await authClient.admin.listUsers({
  query: { limit: 10, offset: 0 },
});

// Ban a user
await authClient.admin.banUser({
  userId: "user-id",
  banReason: "Violation of terms",
  banExpiresIn: 60 * 60 * 24 * 7, // 7 days
});
```

#### Admin API Endpoints

- `POST /api/auth/admin/create-user` - Create a new user
- `GET /api/auth/admin/list-users` - List all users with filtering/pagination
- `POST /api/auth/admin/set-role` - Change user role
- `POST /api/auth/admin/set-user-password` - Change user password
- `POST /api/auth/admin/update-user` - Update user information
- `POST /api/auth/admin/ban-user` - Ban a user
- `POST /api/auth/admin/unban-user` - Unban a user
- `POST /api/auth/admin/impersonate-user` - Impersonate a user
- `POST /api/auth/admin/stop-impersonating` - Stop impersonation
- `POST /api/auth/admin/list-user-sessions` - List user sessions
- `POST /api/auth/admin/revoke-user-session` - Revoke a specific session
- `POST /api/auth/admin/revoke-user-sessions` - Revoke all user sessions
- `POST /api/auth/admin/remove-user` - Delete a user
- `POST /api/auth/admin/has-permission` - Check user permissions

See the [Better Auth Admin Plugin documentation](https://www.better-auth.com/docs/plugins/admin) for complete details.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn

