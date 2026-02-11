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

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn

