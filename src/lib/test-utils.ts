/**
 * Test utilities for API route testing
 */
import { auth } from "@/lib/auth";
import type { Quote } from "@prisma/client";

// Derive types from better-auth
type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
type User = Session["user"];

export function createMockSession(userOverrides: Partial<User> = {}): Session {
  const user: User = {
    id: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "test@example.com",
    emailVerified: false,
    name: "Test User",
    role: "user",
    banned: false,
    ...userOverrides,
  };

  return {
    user,
    session: {
      id: `session-${user.id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      token: "mock-token",
    },
  };
}

export function createMockQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    id: "quote-123",
    userId: "user-123",
    fullName: "John Doe",
    email: "john@example.com",
    address1: "Hauptstraße 1",
    address2: null,
    city: "Berlin",
    region: "Berlin",
    zip: "10115",
    country: "DE",
    monthlyConsumptionKwh: 400,
    systemSizeKw: 5,
    downPayment: 1000,
    systemPrice: 6000,
    principalAmount: 5000,
    riskBand: "A",
    offers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
