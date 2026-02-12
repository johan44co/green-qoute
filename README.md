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

### 5. Seed Admin User (Optional)

Create an admin user for testing:

```bash
yarn seed:admin
```

This creates an admin user with credentials from your `.env` file:
- **Email:** `ADMIN_EMAIL` (default: admin@test.com)
- **Password:** `ADMIN_PASSWORD` (default: admin123)
- **Name:** `ADMIN_NAME` (default: Admin User)

**Note:** If the user already exists, the script will update their role to admin.

### 6. Run the Development Server

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

## Authentication Scripts

### Seed Admin User

- `yarn seed:admin` - Create or update an admin user

The admin credentials are configurable via environment variables in `.env`:
- `ADMIN_EMAIL` - Admin email address (default: admin@test.com)
- `ADMIN_PASSWORD` - Admin password (default: admin123)
- `ADMIN_NAME` - Admin display name (default: Admin User)

If the user already exists, running the script will update their role to admin.

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

### Route Protection

The project uses a multi-layered approach to route protection with Better Auth.

#### Route Groups

The app is organized using Next.js 15+ route groups for better code organization:

- `(auth)` - Authentication pages (sign-in, sign-up)
- `(user)` - User-accessible pages (quotes)
- `(admin)` - Admin-only pages (admin/quotes)

Route groups don't affect URLs - they're purely organizational. All routes keep their original paths:
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/quotes` - User quotes page
- `/admin/quotes` - Admin quotes management

#### How It Works

**1. Proxy-level Check (src/proxy.ts)**

The proxy performs a fast, optimistic check for a session cookie and redirects unauthenticated users:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/quotes/:path*", "/admin/:path*"],
};
```

**2. Layout-level Validation (src/lib/auth-validation.ts)**

Each route group has a layout that validates sessions using a reusable utility:

```typescript
// src/lib/auth-validation.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function validateSession(options: {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectIfAuthenticated?: boolean;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (options.redirectIfAuthenticated && session) {
    const isAdmin = session.user.role?.includes("admin");
    redirect(isAdmin ? "/admin/quotes" : "/quotes");
  }

  if (options.requireAuth && !session) {
    redirect("/sign-in");
  }

  if (options.requireAdmin && !session?.user.role?.includes("admin")) {
    redirect("/quotes");
  }

  return session;
}
```

**Usage in layouts:**

```typescript
// (auth)/layout.tsx - Redirect authenticated users
await validateSession({ redirectIfAuthenticated: true });

// (user)/layout.tsx - Require authentication
await validateSession({ requireAuth: true });

// (admin)/layout.tsx - Require authentication + admin role
await validateSession({ requireAuth: true, requireAdmin: true });
```

**3. Page-level Access (optional)**

Pages can access the session for displaying user data without additional validation (already handled by layout):

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function QuotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <div>Welcome, {session?.user.name}!</div>;
}
```

**Security Notes:**
- The proxy check is for performance only - it prevents unnecessary page loads
- Layout validation provides the actual security with database checks
- Pages can optionally access session data without repeating validation logic
- The `validateSession` utility can be used in both layouts and individual pages if needed

See the [Better Auth Next.js Integration](https://www.better-auth.com/docs/integrations/next#nextjs-16-proxy) for more details.

## UI Components

The project uses Base UI as the foundation for building accessible, primitive UI components styled with Tailwind CSS.

### Component Library

Base UI provides unstyled, accessible primitives that we wrap with Tailwind styles in `src/components/ui/`. This approach gives us:
- **Full design control** - Style components to match your design system
- **Accessibility by default** - ARIA compliant and keyboard navigable
- **Type safety** - Full TypeScript support
- **Consistency** - Reusable components across the application

### Available Components

**Button** (`src/components/ui/button.tsx`)
- Based on [Base UI Button](https://base-ui.com/react/components/button)
- Variants: `default`, `outline`, `ghost`, `destructive`
- Sizes: `default`, `sm`, `lg`
- Uses class-variance-authority for type-safe variants

**Input** (`src/components/ui/input.tsx`)
- Based on [Base UI Input](https://base-ui.com/react/components/input)
- Form validation states
- Error styling support

**Form** (`src/components/ui/form.tsx`)
- Based on [Base UI Form](https://base-ui.com/react/components/form)
- Consolidated error handling
- Integrates with Zod for schema validation

**Field** (`src/components/ui/field.tsx`)
- Based on [Base UI Field](https://base-ui.com/react/components/field)
- Compound component with Root, Label, Control, Description, Error, Validity
- Automatic label association
- Built-in validation states

### Usage Example

```tsx
'use client';
import { Button, Form, Field } from "@/components/ui";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.coerce.number("Age must be a number").min(18, "You must be at least 18 years old"),
});

async function submitForm(formValues: { name: string; email: string; age: number }) {
  const result = schema.safeParse(formValues);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  // Form is valid, handle submission
  console.log(result.data);
  
  return {
    errors: {},
  };
}

export function MyForm() {
  const [errors, setErrors] = useState({});

  return (
    <Form
      errors={errors}
      onFormSubmit={async (formValues) => {
        const response = await submitForm(formValues);
        setErrors(response.errors);
      }}
    >
      <Field.Root name="name">
        <Field.Label>Name</Field.Label>
        <Field.Control placeholder="Enter your name" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" placeholder="Enter your email" />
        <Field.Description>
          We'll never share your email with anyone else.
        </Field.Description>
        <Field.Error />
      </Field.Root>

      <Field.Root name="age">
        <Field.Label>Age</Field.Label>
        <Field.Control type="number" placeholder="Enter your age" />
        <Field.Error />
      </Field.Root>

      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button variant="outline" type="button">Cancel</Button>
      </div>
    </Form>
  );
}
```

## Testing

The project uses Jest and React Testing Library for unit and integration testing.

### Test Setup

Jest is configured with Next.js integration using `next/jest`, which automatically:
- Configures the Next.js Compiler for transforming code
- Handles CSS and image imports
- Loads environment variables
- Sets up module path aliases (`@/...`)

Configuration files:
- `jest.config.ts` - Jest configuration
- `jest.setup.ts` - Test environment setup (imports `@testing-library/jest-dom`)

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode (re-runs on file changes)
yarn test:watch
```

### Writing Tests

Tests are located next to the code they test in `__tests__` directories.

**Example:** `src/lib/__tests__/pricing.test.ts`

```typescript
import { calculateQuote } from "@/lib/pricing";

describe("Pricing Calculations", () => {
  it("should calculate quote correctly", () => {
    const input = {
      systemSizeKw: 5,
      monthlyConsumptionKwh: 400,
      downPayment: 1000,
    };

    const result = calculateQuote(input);

    expect(result.systemPrice).toBe(6000); // 5 * 1200
    expect(result.principalAmount).toBe(5000); // 6000 - 1000
    expect(result.riskBand).toBe("A");
    expect(result.offers).toHaveLength(3);
  });
});
```

### Test Coverage

Current test suites:
- **Pricing Module** (`src/lib/__tests__/pricing.test.ts`) - 16 tests
  - System price calculations
  - Risk band classification (A/B/C)
  - APR rates and amortization formulas
  - Offer generation with different terms
  - Complete quote calculations

### Best Practices

- Write tests for business logic and utilities
- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- Mock external dependencies (API calls, database queries)
- Test edge cases and error scenarios

See the [Jest documentation](https://jestjs.io/docs/getting-started) and [Testing Library docs](https://testing-library.com/docs/react-testing-library/intro/) for more information.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn

