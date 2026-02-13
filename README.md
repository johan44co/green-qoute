# Green Quote

A solar panel quote and financing calculator built with Next.js, PostgreSQL, and Better Auth.

## Live Demo

🚀 **[https://green-qoute.vercel.app/](https://green-qoute.vercel.app/)**

## Screenshots

### Homepage

![Homepage](screenshots/01-homepage.png)

### Sign Up

![Sign Up](screenshots/02-signup.png)

### Quotes Dashboard

![Quotes Dashboard](screenshots/03-quotes-empty.png)

### Quote Form

![Quote Form](screenshots/04-quote-form.png)

### Quote Results

![Quote Results](screenshots/05-quote-results.png)

### Sign In

![Sign In](screenshots/06-signin.png)

### Admin Quotes

![Admin Quotes](screenshots/07-admin-quotes.png)

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

### 6. Seed Database (Optional)

#### Seed Admin User

Create an admin user:

```bash
yarn seed:admin
```

This creates an admin user with credentials from your `.env` file:

- **Email:** `ADMIN_EMAIL` (required)
- **Password:** `ADMIN_PASSWORD` (required)
- **Name:** `ADMIN_NAME` (required)

**Note:** If the user already exists, the script will update their role to admin.

#### Seed Test Users with Quotes

Create test users with sample quotes for development:

```bash
yarn seed:users
```

This creates 3 test users with 18 total quotes:

- **Emma Schmidt** - 4 quotes (Berlin, Munich, Frankfurt, Stuttgart)
- **Max Müller** - 4 quotes (Hamburg, Berlin, Cologne, Dresden)
- **Sophie Weber** - 10 quotes (Düsseldorf, Leipzig, Nuremberg, Munich, Berlin)

Test data is defined in `scripts/fixtures/seed-users.ts` and can be customized for your needs.

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
- `yarn prisma:deploy` - Apply pending migrations in production
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

Configure credentials in `.env` (required):

- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password
- `ADMIN_NAME` - Admin display name

### Route Protection

Protected routes use a multi-layered approach:

1. **Proxy check** (`src/proxy.ts`) - Fast session cookie check for performance
2. **Layout validation** (`src/lib/auth-validation.ts`) - Database session validation with role checking
3. **Page access** - Optional session access for displaying user data

See Better Auth [documentation](https://better-auth.com/docs) and [admin plugin docs](https://www.better-auth.com/docs/plugins/admin) for API details.

## API Development

**📄 [Complete API Reference](API.md)** - Detailed documentation of all endpoints, request/response formats, and examples.

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

// Download quote as PDF
await apiClient.downloadQuotePdf("quote-id");
```

### PDF Export

Quotes can be exported as PDF documents using [@react-pdf/renderer](https://react-pdf.org/). The PDF includes:

- Customer information (name, email, address)
- Installation details (system size, consumption, pricing)
- Financing options table (terms, APR, monthly payment, total cost)

The PDF generation is server-side and only accessible to the quote owner or admin users. On the quote detail page, users can download the PDF using the "Download PDF" button.

## Logging

The project uses [Pino](https://getpino.io) for structured logging with JSON output in production and pretty-printed logs in development.

### Usage

```typescript
import { log } from "@/lib/logger";

// Info, error, warn, debug
log.info("Operation completed", { userId, duration: 123 });
log.error("Operation failed", error, { userId });
```

### Configuration

Set `LOG_LEVEL` environment variable to control verbosity: `debug`, `info`, `warn`, `error`. Defaults to `debug` in development and `info` in production.

All requests include `x-request-id` headers and `requestId` in logs for request correlation.

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

## Code Formatting

The project uses [Prettier](https://prettier.io) for consistent code formatting.

### Format Commands

```bash
yarn format          # Format all files
yarn format:check    # Check formatting without modifying files
```

### Configuration

Prettier is configured via `.prettierrc`:

- Uses semicolons
- Trailing commas (ES5 style)
- Double quotes
- 2-space indentation

### ESLint Integration

The project uses `eslint-config-prettier` to disable ESLint rules that conflict with Prettier. Run both:

- `yarn lint` - Check code quality
- `yarn format` - Format code style

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

**Coverage: 37 tests**

- 16 tests - Pricing calculations (`src/lib/__tests__/pricing.test.ts`)
- 10 tests - Quote API routes (`src/app/api/quotes/__tests__/route.test.ts`)
- 5 tests - Quote detail routes (`src/app/api/quotes/[id]/__tests__/route.test.ts`)
- 6 tests - Quote PDF generation (`src/app/api/quotes/[id]/pdf/__tests__/route.test.tsx`)

### E2E Tests (Playwright)

Install Playwright browsers (one-time setup):

```bash
yarn playwright:install
```

Run tests:

```bash
yarn test:e2e          # Headless
yarn test:e2e:ui       # UI Mode
yarn test:e2e:headed   # Headed mode
```

**Key Patterns:**

- Use `test.describe.serial()` for sequential execution (shared sessions)
- Create browser context in `beforeAll`, authenticate in first test
- Self-contained tests seed and cleanup their own data
- Support parallel execution across browsers with unique timestamps in emails
- Clean up with Prisma in `afterAll` (cascade deletes handle relations)

**Coverage: 13 tests** across 2 test suites:

**Happy Path** (`tests/happy-path.spec.ts` - 6 tests):

- should sign up and create account
- should navigate to add quote page
- should fill and submit quote form
- should display quote results correctly
- should display financing options
- should download quote as PDF

**Admin Journey** (`tests/admin-journey.spec.ts` - 7 tests):

- Admin sign-in and authentication
- View all users' quotes with pagination (12 test quotes)
- View any user's quote detail
- Download any user's quote as PDF
- Navigate back to admin view
- Pagination controls (Next/Previous buttons)

**Test Data:** Tests use fixture files (`tests/fixtures/test-users.ts`) and helper functions (`tests/helpers.ts`) for creating unique test data per browser/timestamp to avoid conflicts during parallel execution.

See [Playwright docs](https://playwright.dev/docs/intro) for details.

## TODO

- [ ] Add improved user feedback and loading states
- [ ] Implement quote editing functionality
- [ ] Add email verification
- [ ] Add more comprehensive input validation

## Production Readiness

This application is currently in development. The following items are required before production deployment:

### Critical for Production

- **Deployment**: Set up deployment on Vercel or configure custom Docker deployment for the Next.js application
- **Database**:
  - If deploying to Vercel, use [Neon](https://neon.tech) for PostgreSQL to enable database branching for staging environments
  - Otherwise, set up a production-grade PostgreSQL instance with backups and monitoring
  - Use `yarn prisma:deploy` to apply migrations in production (non-interactive)
- **CI/CD Pipeline**: Configure GitHub Actions to:
  - Run unit tests on all PRs
  - Run E2E tests in staging-like environment (or isolated)
  - Validate code formatting and linting
  - Run type checking

### Nice to Have

- **Multi-tenancy**: Add [Better Auth Organization plugin](https://www.better-auth.com/docs/plugins/organization) to enable multiple providers to manage their own quotes independently
- **Component Library**: Set up [Storybook](https://storybook.js.org) for component development and documentation
- **Internationalization**: Implement i18n support for multiple languages
- **UI Components**: Add missing components:
  - Error boundary component for better error handling
  - Dialog/Drawer component for admin to view quotes without leaving the admin view
  - Loading states and skeleton screens

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Yarn
