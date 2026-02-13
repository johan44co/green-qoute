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

### 5. Apply Database Migrations

```bash
yarn prisma:migrate
```

This applies the database schema to PostgreSQL.

### 6. Seed Admin User (Optional)

Create an admin user for testing:

```bash
yarn seed:admin
```

This creates an admin user with credentials from your `.env` file:
- **Email:** `ADMIN_EMAIL` (default: admin@test.com)
- **Password:** `ADMIN_PASSWORD` (default: TestPassword123!)
- **Name:** `ADMIN_NAME` (default: Admin User)

**Note:** If the user already exists, the script will update their role to admin.

### 7. Run the Development Server

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

## Authentication

The project uses [Better Auth](https://better-auth.com) for authentication with email/password sign-in, session management, and admin role support.

### Seed Admin User

Create an admin user for testing:

```bash
yarn seed:admin
```

Configure credentials in `.env`:
- `ADMIN_EMAIL` - Default: admin@test.com
- `ADMIN_PASSWORD` - Default: TestPassword123!
- `ADMIN_NAME` - Default: Admin User

### Route Protection

Protected routes use a multi-layered approach:

1. **Proxy check** (`src/proxy.ts`) - Fast session cookie check for performance
2. **Layout validation** (`src/lib/auth-validation.ts`) - Database session validation with role checking
3. **Page access** - Optional session access for displaying user data

See Better Auth [documentation](https://better-auth.com/docs) and [admin plugin docs](https://www.better-auth.com/docs/plugins/admin) for API details.

## API Development

### Authenticated API Routes

Use `withAuth` (`src/lib/with-auth.ts`) to create protected API routes with automatic session validation:

```typescript
import { withAuth } from "@/lib/with-auth";

// Simple authenticated route
export const GET = withAuth(async ({ session }) => {
  return NextResponse.json({ userId: session.user.id });
});

// Admin-only route
export const DELETE = withAuth(
  async ({ params, session }) => {
    await prisma.user.delete({ where: { id: await params.id } });
    return NextResponse.json({ success: true });
  },
  { requireAdmin: true }
);
```

### API Client

Use the type-safe API client (`src/lib/api-client.ts`) for making requests:

```typescript
import { apiClient } from "@/lib/api-client";

// Create quote
const quote = await apiClient.createQuote({ fullName: "John", ... });

// List quotes with pagination
const { data, pagination } = await apiClient.listQuotes({ page: 1, limit: 10 });

// Get single quote
const quote = await apiClient.getQuote("quote-id");
```

## UI Components

The project uses [Base UI](https://base-ui.com) with Tailwind CSS for accessible, customizable components in `src/components/ui/`:

- **Button** - Variants: `default`, `outline`, `ghost`, `destructive` / Sizes: `sm`, `default`, `lg`
- **Card** - Container with header, content, and footer sections
- **Combobox** - Searchable select dropdown with autocomplete
- **Field** - Compound component with Label, Control, Description, Error
- **Form** - Zod schema validation with error handling
- **Input** - Form validation states and error styling
- **Menu** - Dropdown menu with items and submenus
- **Pagination** - Page navigation with prev/next controls
- **Table** - Data table with header, body, row, and cell components

See Base UI [documentation](https://base-ui.com/react/components) for usage.

## Testing

### Unit Tests (Jest)

Run tests:
```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test --coverage   # With coverage
```

**Test Utilities** (`src/lib/test-utils.ts`, `src/lib/test-mocks.ts`):
- `createMockSession()` - Mock Better Auth sessions
- `createMockQuote()` - Mock quote objects
- Pre-configured mocks for Prisma and auth (in `jest.mocks.ts`)

**Coverage: 31 tests**
- 16 tests - Pricing calculations (`src/lib/__tests__/pricing.test.ts`)
- 10 tests - Quote API routes (`src/app/api/quotes/__tests__/route.test.ts`)
- 5 tests - Quote detail routes (`src/app/api/quotes/[id]/__tests__/route.test.ts`)

### E2E Tests (Playwright)

Run tests:
```bash
yarn test:e2e          # Headless
yarn test:e2e:ui       # UI Mode  
yarn test:e2e:headed   # Headed mode
```

**Key Patterns:**
- Use `test.describe.serial()` for sequential execution (shared sessions)
- Create browser context in `beforeAll`, authenticate in first test
- Clean up with Prisma in `afterAll` (cascade deletes handle relations)
- Use dynamic test data (`test-${Date.now()}@example.com`)

**Coverage: 5 tests** covering complete user journey (sign-up → create quote → view results)

See [Playwright docs](https://playwright.dev/docs/intro) for details.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn