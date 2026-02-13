/**
 * @jest-environment node
 */
import { POST, GET } from "../route";
import type { NextRequest } from "next/server";
import { createMockSession, createMockQuote } from "@/lib/test-utils";
import {
  mockGetSession,
  mockQuoteCreate,
  mockQuoteFindMany,
  mockQuoteCount,
} from "@/lib/test-mocks";

describe("POST /api/quotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a quote for authenticated user", async () => {
    const mockSession = createMockSession();

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      offers: [
        { termYears: 5, apr: 3.5, monthlyPayment: 91.07 },
        { termYears: 10, apr: 4.0, monthlyPayment: 50.58 },
        { termYears: 15, apr: 4.5, monthlyPayment: 38.24 },
      ],
    });

    mockQuoteCreate.mockResolvedValue(mockQuote);

    const request = {
      json: async () => ({
        fullName: "John Doe",
        email: "john@example.com",
        address1: "Hauptstraße 1",
        city: "Berlin",
        region: "Berlin",
        zip: "10115",
        country: "Germany",
        monthlyConsumptionKwh: 400,
        systemSizeKw: 5,
        downPayment: 1000,
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("userId", "user-123");
    expect(data.id).toBe("quote-123");
    expect(data.systemPrice).toBe(6000);
    expect(data.principalAmount).toBe(5000);
    expect(data.riskBand).toBe("A");
    expect(data.offers).toHaveLength(3);
    expect(mockQuoteCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-123",
        fullName: "John Doe",
        systemSizeKw: 5,
      }),
    });
  });

  it("should return validation error for invalid input", async () => {
    const mockSession = createMockSession();

    mockGetSession.mockResolvedValue(mockSession);

    const request = {
      json: async () => ({
        fullName: "J", // Too short
        email: "invalid-email", // Invalid email
        systemSizeKw: -5, // Negative number
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.fullName).toBeDefined();
    expect(data.details.email).toBeDefined();
    expect(mockQuoteCreate).not.toHaveBeenCalled();
  });

  it("should return 401 for unauthenticated request", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = {
      json: async () => ({
        fullName: "John Doe",
        email: "john@example.com",
        address1: "Hauptstraße 1",
        city: "Berlin",
        zip: "10115",
        country: "Germany",
        monthlyConsumptionKwh: 400,
        systemSizeKw: 5,
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockQuoteCreate).not.toHaveBeenCalled();
  });
});

describe("GET /api/quotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return paginated quotes for authenticated user", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuotes = [
      createMockQuote({
        id: "quote-1",
      }),
    ];

    mockQuoteFindMany.mockResolvedValue(mockQuotes);
    mockQuoteCount.mockResolvedValue(1);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ page: "1", limit: "10" }),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.data[0]).toHaveProperty("userId", "user-123");
    expect(data.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    expect(mockQuoteFindMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });

  it("should return only admin's own quotes by default", async () => {
    const mockSession = createMockSession({
      id: "admin-123",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuotes = [
      createMockQuote({
        id: "quote-1",
        fullName: "Admin User",
        email: "admin@example.com",
        address1: "Admin Street",
        region: null,
      }),
    ];

    mockQuoteFindMany.mockResolvedValue(mockQuotes);
    mockQuoteCount.mockResolvedValue(1);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
    expect(mockQuoteFindMany).toHaveBeenCalledWith({
      where: { userId: "admin-123" },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });

  it("should return all quotes for admin user with all=true", async () => {
    const mockSession = createMockSession({
      id: "admin-123",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuotes = [
      createMockQuote({
        id: "quote-1",
        fullName: "User One",
        email: "user1@example.com",
        address1: "Street 1",
        region: null,
      }),
      createMockQuote({
        id: "quote-2",
        userId: "user-456",
        fullName: "User Two",
        email: "user2@example.com",
        address1: "Street 2",
        city: "Munich",
        region: null,
        zip: "80331",
        monthlyConsumptionKwh: 500,
        systemSizeKw: 6,
        downPayment: 1500,
        systemPrice: 7200,
        principalAmount: 5700,
        riskBand: "B",
      }),
    ];

    mockQuoteFindMany.mockResolvedValue(mockQuotes);
    mockQuoteCount.mockResolvedValue(2);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ all: "true" }),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
    expect(mockQuoteFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });

  it("should ignore all=true for non-admin users", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuotes = [
      createMockQuote({
        id: "quote-1",
      }),
    ];

    mockQuoteFindMany.mockResolvedValue(mockQuotes);
    mockQuoteCount.mockResolvedValue(1);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ all: "true" }),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    // Should still filter by userId even though all=true was passed
    expect(mockQuoteFindMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });

  it("should handle pagination parameters correctly", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);
    mockQuoteFindMany.mockResolvedValue([]);
    mockQuoteCount.mockResolvedValue(25);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ page: "2", limit: "5" }),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 25,
      totalPages: 5,
    });
    expect(mockQuoteFindMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      orderBy: { createdAt: "desc" },
      skip: 5,
      take: 5,
    });
  });

  it("should return 401 for unauthenticated request", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockQuoteFindMany).not.toHaveBeenCalled();
  });
});
