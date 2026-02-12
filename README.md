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

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn

