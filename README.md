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

## API Development

### Authenticated API Routes

The project provides a `withAuth` higher-order function for creating authenticated API routes with automatic session validation and optional admin role checking.

#### Location

`src/lib/with-auth.ts`

#### Features

- **Automatic session validation** - Validates session before handler execution
- **Type-safe session injection** - Session is guaranteed and typed in your handler
- **Object-based parameters** - Destructure only what you need (`request`, `session`, `params`)
- **Role-based access control** - Optional `requireAdmin` flag
- **Automatic error handling** - 401/403 responses handled automatically
- **Supports dynamic routes** - Type-safe route parameters with generics
- **Zero code duplication** - Single function for all authenticated routes

#### Basic Usage

**Simple route (no params):**

```typescript
import { withAuth } from "@/lib/with-auth";
import { NextResponse } from "next/server";

export const GET = withAuth(async ({ session }) => {
  // session is guaranteed to exist and is fully typed
  return NextResponse.json({ 
    userId: session.user.id,
    email: session.user.email 
  });
});
```

**Route using request:**

```typescript
export const POST = withAuth(async ({ request, session }) => {
  const body = await request.json();
  
  // Process data with authenticated user context
  const data = await createResource({
    ...body,
    userId: session.user.id,
  });
  
  return NextResponse.json(data);
});
```

**Dynamic route with params:**

```typescript
// app/api/quotes/[id]/route.ts
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth<{ id: string }>(
  async ({ params, session }) => {
    const { id } = await params; // id is typed as string
    
    const quote = await prisma.quote.findUnique({
      where: { id },
    });
    
    if (!quote) {
      return NextResponse.json(
        { error: "Not found" }, 
        { status: 404 }
      );
    }
    
    // Verify ownership (admins can access all)
    const isAdmin = session.user.role?.includes("admin");
    if (!isAdmin && quote.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json(quote);
  }
);
```

**Admin-only route:**

```typescript
export const DELETE = withAuth(
  async ({ params, session }) => {
    const { id } = await params;
    
    await prisma.user.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  },
  { requireAdmin: true } // 403 if not admin
);
```

**Pagination with query params:**

```typescript
export const GET = withAuth(async ({ request, session }) => {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  
  const data = await prisma.quote.findMany({
    where: { userId: session.user.id },
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return NextResponse.json({
    data,
    pagination: { page, limit },
  });
});
```

#### Error Responses

The `withAuth` function automatically handles common authentication errors:

- **401 Unauthorized** - No valid session found
- **403 Forbidden** - Valid session but user is not an admin (when `requireAdmin: true`)
- **500 Internal Server Error** - Unexpected error during authentication or handler execution

## API Client

The project includes a type-safe API client for making API requests from both client and server components.

### Location

`src/lib/api-client.ts`

### Features

- **Type-safe methods** - Full TypeScript support with typed responses
- **Automatic error handling** - Throws structured errors with status codes
- **Client and server support** - Separate instances for different contexts
- **Request customization** - Accept standard `RequestInit` options for headers, cache, etc.
- **Automatic JSON handling** - Request/response bodies handled automatically

### Available Clients

**`apiClient`** - For client-side usage (browser)
```typescript
import { apiClient } from "@/lib/api-client";
```

**`serverApiClient`** - For server components (requires base URL)
```typescript
import { serverApiClient } from "@/lib/api-client";
```

### API Methods

#### Create Quote

```typescript
const quote = await apiClient.createQuote(
  {
    fullName: "John Doe",
    email: "john@example.com",
    address1: "123 Main St",
    city: "Berlin",
    zip: "10115",
    country: "DE",
    monthlyConsumptionKwh: 400,
    systemSizeKw: 5.0,
    downPayment: 1000, // optional
  },
  { 
    // Optional RequestInit options
    cache: "no-store" 
  }
);
```

#### Get Quote by ID

```typescript
const quote = await apiClient.getQuote("quote-id", {
  // Optional RequestInit options
  cache: "no-store",
});
```

#### List Quotes with Pagination

```typescript
const response = await apiClient.listQuotes(
  {
    page: 1,
    limit: 10,
  },
  {
    // Optional RequestInit options
    cache: "no-store",
  }
);

console.log(response.data); // Array of quotes
console.log(response.pagination); // { page, limit, total, totalPages }
```

### Usage Examples

**Client-side (in a React component):**

```typescript
"use client";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";

export function QuotesList() {
  const [quotes, setQuotes] = useState([]);

  async function loadQuotes() {
    try {
      const response = await apiClient.listQuotes();
      setQuotes(response.data);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    }
  }

  return (
    <button onClick={loadQuotes}>Load Quotes</button>
  );
}
```

**Server-side (in a server component):**

```typescript
import { serverApiClient } from "@/lib/api-client";
import { headers } from "next/headers";

export default async function QuotePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const requestHeaders = await headers();

  try {
    const quote = await serverApiClient.getQuote(id, {
      headers: requestHeaders, // Pass auth cookies
      cache: "no-store",
    });

    return <div>{quote.fullName}</div>;
  } catch (error) {
    return <div>Quote not found</div>;
  }
}
```

### Error Handling

The API client throws structured errors that include the HTTP status code and error details:

```typescript
try {
  const quote = await apiClient.createQuote(data);
} catch (error) {
  const apiError = error as ApiError;
  
  console.log(apiError.status); // HTTP status code (e.g., 400, 401, 500)
  console.log(apiError.error); // Error message
  console.log(apiError.details); // Validation errors (if any)
  
  // Handle specific status codes
  if (apiError.status === 401) {
    // Redirect to login
  } else if (apiError.status === 400 && apiError.details) {
    // Show validation errors
    setFormErrors(apiError.details);
  }
}
```

### Types

The API client exports the following types:

- **`QuoteResponse`** - Quote object returned from API (includes all quote fields including `userId`)
- **`PaginatedResponse<T>`** - Paginated list response with data and metadata
- **`PaginationMetadata`** - Pagination information (page, limit, total, totalPages)
- **`ApiError`** - Error object with status, error message, and optional details

```typescript
import type { 
  QuoteResponse, 
  PaginatedResponse, 
  PaginationMetadata,
  ApiError 
} from "@/lib/api-client";
```

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
import { Button, Form, Field, Input } from "@/components/ui";
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
        <Input placeholder="Enter your name" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Input type="email" placeholder="Enter your email" />
        <Field.Description>
          We'll never share your email with anyone else.
        </Field.Description>
        <Field.Error />
      </Field.Root>

      <Field.Root name="age">
        <Field.Label>Age</Field.Label>
        <Input type="number" placeholder="Enter your age" />
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

The project uses Jest for unit and integration testing with comprehensive coverage for both business logic and API routes.

### Test Setup

Jest is configured with Next.js integration using `next/jest`, which automatically:
- Configures the Next.js Compiler for transforming code
- Handles CSS and image imports
- Loads environment variables
- Sets up module path aliases (`@/...`)

Configuration files:
- `jest.config.ts` - Jest configuration with coverage settings and `setupFiles`
- `jest.mocks.ts` - Global mock setup for all tests (loaded via `setupFiles`)
- `jest.setup.ts` - Test environment setup (imports `@testing-library/jest-dom`)

**Global Mock Configuration:**

The `jest.mocks.ts` file is loaded before all tests via the `setupFiles` option in `jest.config.ts`:

```typescript
// jest.config.ts
const config: Config = {
  setupFiles: ["<rootDir>/jest.mocks.ts"], // Mocks loaded first
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Environment setup
  // ... other config
};
```

This ensures all mocks are configured globally before any test file runs, eliminating the need for repetitive `jest.mock()` calls in individual test files.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode (re-runs on file changes)
yarn test:watch

# Run tests with coverage
yarn test --coverage
```

### Test Structure

Tests are located next to the code they test in `__tests__` directories:
- `src/lib/__tests__/` - Unit tests for utilities and business logic
- `src/app/api/*/__tests__/` - Integration tests for API routes

### Test Utilities

The project provides shared test utilities to reduce code duplication and ensure consistency across test files.

#### Mock Data Utilities (`src/lib/test-utils.ts`)

Create type-safe mock objects for testing.

**`createMockSession(userOverrides?: Partial<User>): Session`**

Creates a mock Better Auth session with sensible defaults. Accepts `Partial<User>` to override any user properties.

```typescript
import { createMockSession } from "@/lib/test-utils";

// Default user session
const session = createMockSession();
// Returns: { user: { id: "user-123", email: "test@example.com", role: "user", ... }, session: { ... } }

// Admin session
const adminSession = createMockSession({ role: "admin" });

// Custom user data
const customSession = createMockSession({
  id: "custom-id",
  email: "custom@example.com",
  name: "Custom User",
});
```

**`createMockQuote(overrides?: Partial<Quote>): Quote`**

Creates a mock Quote object with complete default data. Accepts `Partial<Quote>` to override any properties.

```typescript
import { createMockQuote } from "@/lib/test-utils";

// Default quote
const quote = createMockQuote();
// Returns: { id: "quote-123", systemSizeKw: 5, systemPrice: 6000, ... }

// Custom quote data
const customQuote = createMockQuote({
  id: "custom-id",
  systemPrice: 10000,
  offers: [/* custom offers */],
});
```

#### Mock Functions Utilities (`src/lib/test-mocks.ts`)

Provides direct exports of type-safe mock functions. Mock setup is configured globally in `jest.mocks.ts` via Jest's `setupFiles` configuration.

**Global Mock Setup (`jest.mocks.ts`):**

All mocks are configured centrally in `jest.mocks.ts`, which is loaded before all tests via `jest.config.ts`:

```typescript
// jest.mocks.ts
jest.mock("@/lib/auth", () => ({
  auth: { api: { getSession: jest.fn() } }
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    quote: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));
```

**Available mock functions:**
- `mockGetSession` - Auth session retrieval
- `mockQuoteCreate`, `mockQuoteFindMany`, `mockQuoteFindUnique`, `mockQuoteUpdate`, `mockQuoteDelete`, `mockQuoteCount` - Prisma quote operations

**Usage:**

```typescript
// Simply import typed mock functions - no jest.mock() needed!
import {
  mockGetSession,
  mockQuoteCreate,
} from "@/lib/test-mocks";

// Use them in tests with full type safety
describe("My test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should work", async () => {
    mockGetSession.mockResolvedValue(createMockSession());
    mockQuoteCreate.mockResolvedValue(createMockQuote());
    // ... test code
  });
});
```

#### Type Safety

All test utilities use proper types derived from the application:
- `Session` and `User` types come from Better Auth
- `Quote` type comes from `@prisma/client`
- Mock functions are typed with `jest.MockedFunction<typeof fn>`
- Full TypeScript IntelliSense support in tests

### Writing Tests

#### Unit Tests (Business Logic)

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

#### API Route Tests

API route tests use `@jest-environment node` and import typed mock functions from `@/lib/test-mocks`.

**Example:** `src/app/api/quotes/__tests__/route.test.ts`

```typescript
/**
 * @jest-environment node
 */
import { POST, GET } from "../route";
import type { NextRequest } from "next/server";
import { createMockSession, createMockQuote } from "@/lib/test-utils";
import {
  mockGetSession,
  mockQuoteCreate,
} from "@/lib/test-mocks";

describe("POST /api/quotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a quote for authenticated user", async () => {
    // Use test utilities for mocking
    const mockSession = createMockSession();
    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      systemPrice: 7500,
      offers: [{ termYears: 5, apr: 0.05, monthlyPayment: 141.34 }],
    });
    mockQuoteCreate.mockResolvedValue(mockQuote);

    // Create mock request
    const request = {
      json: async () => ({
        fullName: "John Doe",
        email: "john@example.com",
        systemSizeKw: 5,
        monthlyConsumptionKwh: 400,
        downPayment: 500,
      }),
    } as NextRequest;

    // Call route handler
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.systemPrice).toBe(7500);
    expect(mockQuoteCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: mockSession.user.id,
        fullName: "John Doe",
      }),
    });
  });

  it("should return 401 for unauthenticated request", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = {
      json: async () => ({}),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
```

**Key Testing Patterns:**

1. **Global mock setup** - All mocks configured in `jest.mocks.ts` via Jest's `setupFiles`
2. **Import mock functions** - Import typed mock functions directly from `@/lib/test-mocks`
3. **Use test utilities** - Leverage `createMockSession()` and `createMockQuote()` for consistent mock data
4. **Clear mocks** - Use `jest.clearAllMocks()` in `beforeEach` to reset state between tests
5. **Test authentication** - Always test both authenticated and unauthenticated scenarios
6. **Test authorization** - Verify role-based access control (user vs admin)
7. **Test validation** - Check request validation and error responses

### Test Coverage

**Total: 31 passing tests across 3 test suites**

#### Pricing Module (`src/lib/__tests__/pricing.test.ts`) - 16 tests
- System price calculations (per kW pricing)
- Risk band classification (A/B/C) based on system size and consumption
- APR rate calculation by risk band
- Monthly payment amortization formulas
- Offer generation for multiple terms (5, 10, 15 years)
- Complete quote calculations with all fields
- Edge cases (zero down payment, high consumption ratios)

#### Quote API Routes (`src/app/api/quotes/__tests__/route.test.ts`) - 10 tests
- **POST /api/quotes**
  - ✅ Create quote for authenticated user
  - ✅ Validate required fields
  - ✅ Validate country code is a valid ISO code
  - ✅ Return 401 for unauthenticated requests
- **GET /api/quotes**
  - ✅ List paginated quotes for user (filtered by userId)
  - ✅ List only admin's own quotes by default
  - ✅ List all quotes for admin with all=true parameter
  - ✅ Ignore all=true parameter for non-admin users
  - ✅ Support pagination query params (page, limit)
  - ✅ Return 401 for unauthenticated requests

#### Quote Detail API Routes (`src/app/api/quotes/[id]/__tests__/route.test.ts`) - 5 tests
- **GET /api/quotes/:id**
  - ✅ Get own quote for authenticated user
  - ✅ Allow admin to access any quote
  - ✅ Return 404 for non-existent quotes
  - ✅ Return 403 when user tries to access another user's quote
  - ✅ Return 401 for unauthenticated requests

### Best Practices

- **Write tests for business logic** - Cover all utility functions and calculations
- **Test API routes thoroughly** - Authentication, authorization, validation, edge cases
- **Use global mock setup** - All mocks configured in `jest.mocks.ts` for consistency
- **Use descriptive test names** - Clearly explain what is being tested
- **Group related tests** - Use `describe` blocks for organization
- **Mock external dependencies** - Database, authentication, external APIs (already done globally)
- **Test error scenarios** - Not just happy paths
- **Leverage test utilities** - Use `createMockSession()` and `createMockQuote()` for consistent data
- **Keep tests maintainable** - As business logic changes, tests should be easy to update
- **Clear mocks between tests** - Always use `jest.clearAllMocks()` in `beforeEach`

See the [Jest documentation](https://jestjs.io/docs/getting-started) for more information.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn

