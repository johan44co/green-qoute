# API Reference

Green Quote provides a RESTful API for managing solar panel installation quotes. All endpoints except `/api/health` require authentication.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via session cookie. Use the Better Auth endpoints to authenticate:

- Sign up: `POST /api/auth/sign-up`
- Sign in: `POST /api/auth/sign-in`
- Sign out: `POST /api/auth/sign-out`

See [Better Auth documentation](https://better-auth.com/docs) for complete auth API details.

## Endpoints

### Health Check

Check API and database health.

**Endpoint:** `GET /api/health`

**Authentication:** None required

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-13T10:30:00.000Z",
  "database": "connected",
  "migrations": "applied",
  "uptime": 1234567
}
```

**Status Codes:**

- `200` - Service healthy
- `503` - Service unavailable (database or migration issues)

---

### Create Quote

Create a new solar panel installation quote.

**Endpoint:** `POST /api/quotes`

**Authentication:** Required

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "Berlin",
  "region": "Berlin",
  "zip": "10115",
  "country": "DE",
  "monthlyConsumptionKwh": 450,
  "systemSizeKw": 5.5,
  "downPayment": 2000
}
```

**Fields:**

- `fullName` (string, required) - Customer full name (min 2 characters)
- `email` (string, required) - Valid email address
- `address1` (string, required) - Street address (min 3 characters)
- `address2` (string, optional) - Additional address line
- `city` (string, required) - City name (min 2 characters)
- `region` (string, optional) - State/province/region
- `zip` (string, required) - ZIP/postal code (min 3 characters)
- `country` (string, required) - Two-letter ISO country code (e.g., "DE", "US")
- `monthlyConsumptionKwh` (number, required) - Monthly electricity consumption in kWh (must be positive)
- `systemSizeKw` (number, required) - Solar system size in kilowatts (must be positive)
- `downPayment` (number, optional) - Down payment amount (must be non-negative, defaults to 0)

**Response:**

```json
{
  "id": "cm58pqr9s0000xyz...",
  "userId": "cm58abc...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "Berlin",
  "region": "Berlin",
  "zip": "10115",
  "country": "DE",
  "monthlyConsumptionKwh": 450,
  "systemSizeKw": 5.5,
  "downPayment": 2000,
  "systemPrice": 6600,
  "principalAmount": 4600,
  "riskBand": "A",
  "offers": [
    {
      "termYears": 5,
      "apr": 0.069,
      "principalUsed": 4600,
      "monthlyPayment": 89.85
    },
    {
      "termYears": 10,
      "apr": 0.069,
      "principalUsed": 4600,
      "monthlyPayment": 53.15
    },
    {
      "termYears": 15,
      "apr": 0.069,
      "principalUsed": 4600,
      "monthlyPayment": 41.17
    }
  ],
  "createdAt": "2026-02-13T10:30:00.000Z",
  "updatedAt": "2026-02-13T10:30:00.000Z"
}
```

**Status Codes:**

- `200` - Quote created successfully
- `400` - Validation error
- `401` - Not authenticated

**Error Response:**

```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Please enter a valid email address"],
    "systemSizeKw": ["System size must be a positive number"]
  }
}
```

---

### List Quotes

Retrieve paginated list of quotes. Regular users see only their quotes; admins can see all quotes with `all=true`.

**Endpoint:** `GET /api/quotes`

**Authentication:** Required

**Query Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `all` (boolean, optional) - Include all users' quotes (admin only, default: false)

**Request:**

```
GET /api/quotes?page=2&limit=5&all=true
```

**Response:**

```json
{
  "data": [
    {
      "id": "cm58pqr9s0000xyz...",
      "userId": "cm58abc...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "city": "Berlin",
      "systemSizeKw": 5.5,
      "systemPrice": 6600,
      "riskBand": "A",
      "createdAt": "2026-02-13T10:30:00.000Z",
      "...": "..."
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 42,
    "totalPages": 9
  }
}
```

**Status Codes:**

- `200` - Success
- `401` - Not authenticated

---

### Get Quote

Retrieve a single quote by ID. Users can only access their own quotes; admins can access any quote.

**Endpoint:** `GET /api/quotes/:id`

**Authentication:** Required

**Path Parameters:**

- `id` (string) - Quote ID

**Request:**

```
GET /api/quotes/cm58pqr9s0000xyz...
```

**Response:**

```json
{
  "id": "cm58pqr9s0000xyz...",
  "userId": "cm58abc...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "Berlin",
  "region": "Berlin",
  "zip": "10115",
  "country": "DE",
  "monthlyConsumptionKwh": 450,
  "systemSizeKw": 5.5,
  "downPayment": 2000,
  "systemPrice": 6600,
  "principalAmount": 4600,
  "riskBand": "A",
  "offers": [...],
  "createdAt": "2026-02-13T10:30:00.000Z",
  "updatedAt": "2026-02-13T10:30:00.000Z"
}
```

**Status Codes:**

- `200` - Success
- `401` - Not authenticated
- `403` - Forbidden (attempting to access another user's quote)
- `404` - Quote not found

---

### Download Quote PDF

Generate and download a PDF document for a quote. Users can only download their own quotes; admins can download any quote.

**Endpoint:** `GET /api/quotes/:id/pdf`

**Authentication:** Required

**Path Parameters:**

- `id` (string) - Quote ID

**Request:**

```
GET /api/quotes/cm58pqr9s0000xyz.../pdf
```

**Response:**

Binary PDF file with headers:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="Green-Quote-{id}.pdf"`

**PDF Contents:**

- Customer information (name, email, address)
- Installation details (system size, consumption, pricing)
- Financing options table (terms, APR, monthly payment, total cost)
- Risk band classification

**Status Codes:**

- `200` - Success (returns PDF binary)
- `401` - Not authenticated
- `403` - Forbidden (attempting to access another user's quote)
- `404` - Quote not found
- `500` - PDF generation failed

---

## Risk Band Classification

Quotes are automatically classified into risk bands based on consumption and system size:

- **Band A** (6.9% APR) - Monthly consumption ≥ 400 kWh AND system size ≤ 6 kW
- **Band B** (8.9% APR) - Monthly consumption ≥ 250 kWh
- **Band C** (11.9% APR) - All other cases

## Pricing Calculation

- **System Price** = System Size (kW) × €1,200/kW
- **Principal Amount** = System Price - Down Payment
- **Monthly Payment** = Standard amortization formula based on principal, APR, and term

Financing offers are generated for 5, 10, and 15-year terms with APR based on the risk band.

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting before production deployment.

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": {
    "field": ["Validation error message"]
  }
}
```

Common HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Request Correlation

All requests include a `x-request-id` header for tracking and debugging. Check server logs with the request ID for detailed information.

## Type Safety

The project includes TypeScript types for all API interactions. See:

- `src/lib/api-client.ts` - Type-safe API client
- `@prisma/client` - Generated Prisma types for database models
