/**
 * @jest-environment node
 */
import { GET } from "../route";
import type { NextRequest } from "next/server";
import { createMockSession, createMockQuote } from "@/lib/test-utils";
import { mockGetSession, mockQuoteFindUnique } from "@/lib/test-mocks";
import { Readable } from "stream";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  renderToStream: jest.fn(),
  Document: "Document",
  Page: "Page",
  Text: "Text",
  View: "View",
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
}));

const mockRenderToStream = jest.requireMock("@react-pdf/renderer")
  .renderToStream as jest.Mock;

describe("GET /api/quotes/[id]/pdf", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock: successful PDF generation
    const mockBuffer = Buffer.from("mock-pdf-content");
    const mockStream = Readable.from([mockBuffer]);
    mockRenderToStream.mockResolvedValue(mockStream);
  });

  it("should generate PDF for quote owner", async () => {
    const mockSession = createMockSession({ role: "user" });
    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-123",
      userId: "user-123",
      offers: [
        {
          termYears: 5,
          apr: 0.035,
          principalUsed: 4800,
          monthlyPayment: 91.07,
        },
        {
          termYears: 10,
          apr: 0.045,
          principalUsed: 4800,
          monthlyPayment: 49.75,
        },
      ],
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-123" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="Green-Quote-quote-123.pdf"'
    );
    expect(mockQuoteFindUnique).toHaveBeenCalledWith({
      where: { id: "quote-123" },
    });
    expect(mockRenderToStream).toHaveBeenCalled();

    // Verify response body is a buffer
    const body = await response.arrayBuffer();
    expect(body.byteLength).toBeGreaterThan(0);
  });

  it("should generate PDF for admin accessing another user's quote", async () => {
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
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-456" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(mockRenderToStream).toHaveBeenCalled();
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
    expect(mockRenderToStream).not.toHaveBeenCalled();
  });

  it("should return 403 when non-admin user tries to access another user's quote", async () => {
    const mockSession = createMockSession({ role: "user" });

    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-456",
      userId: "user-789",
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-456" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden");
    expect(mockRenderToStream).not.toHaveBeenCalled();
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
    expect(mockRenderToStream).not.toHaveBeenCalled();
  });

  it("should return 500 when PDF generation fails", async () => {
    const mockSession = createMockSession({ role: "user" });
    mockGetSession.mockResolvedValue(mockSession);

    const mockQuote = createMockQuote({
      id: "quote-123",
      userId: "user-123",
    });

    mockQuoteFindUnique.mockResolvedValue(mockQuote);

    // Mock PDF generation failure
    mockRenderToStream.mockRejectedValue(new Error("PDF generation failed"));

    const request = {} as NextRequest;

    const response = await GET(request, {
      params: Promise.resolve({ id: "quote-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to generate PDF");
    expect(mockRenderToStream).toHaveBeenCalled();
  });
});
