/**
 * @jest-environment node
 */
import { GET } from "../route";
import type { NextRequest } from "next/server";
import { createMockSession, createMockQuote } from "@/lib/test-utils";
import {
  mockGetSession,
  mockQuoteFindUnique,
} from "@/lib/test-mocks";

describe("GET /api/quotes/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return quote for owner", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-123",
      userId: "user-123",
      offers: [
        { termYears: 5, apr: 3.5, monthlyPayment: 91.07 },
      ],
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("userId", "user-123");
    expect(data.id).toBe("quote-123");
    expect(data.fullName).toBe("John Doe");
    expect(mockQuoteFindUnique).toHaveBeenCalledWith({
      where: { id: "quote-123" },
    });
  });

  it("should return quote for admin accessing another user's quote", async () => {
    const mockSession = createMockSession({
      id: "admin-123",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-456",
      userId: "user-789",
      fullName: "Jane Doe",
      email: "jane@example.com",
      address1: "Berliner Straße 2",
      city: "Munich",
      region: null,
      zip: "80331",
      monthlyConsumptionKwh: 500,
      systemSizeKw: 6,
      downPayment: 1500,
      systemPrice: 7200,
      principalAmount: 5700,
      riskBand: "B",
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-456" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("userId", "user-789");
    expect(data.id).toBe("quote-456");
    expect(data.fullName).toBe("Jane Doe");
  });

  it("should return 404 when quote not found", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);
    mockQuoteFindUnique.mockResolvedValue(null);
    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Quote not found");
  });

  it("should return 403 when non-admin user tries to access another user's quote", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-456",
      userId: "user-789",
      fullName: "Jane Doe",
      email: "jane@example.com",
      address1: "Berliner Straße 2",
      city: "Munich",
      region: null,
      zip: "80331",
      monthlyConsumptionKwh: 500,
      systemSizeKw: 6,
      downPayment: 1500,
      systemPrice: 7200,
      principalAmount: 5700,
      riskBand: "B",
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-456" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden");
  });

  it("should return 401 for unauthenticated request", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockQuoteFindUnique).not.toHaveBeenCalled();
  });
});
