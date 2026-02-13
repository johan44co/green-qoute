import { Quote } from "@prisma/client";

interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export type QuoteResponse = Quote;

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || "";
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const fullUrl = this.baseUrl + url;
    const response = await fetch(fullUrl, options);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      };
    }

    return data;
  }

  // Quote endpoints
  async createQuote(
    input: {
      fullName: string;
      email: string;
      address1: string;
      address2?: string;
      city: string;
      region?: string;
      zip: string;
      country: string;
      monthlyConsumptionKwh: number;
      systemSizeKw: number;
      downPayment?: number;
    },
    options?: RequestInit
  ): Promise<QuoteResponse> {
    return this.request<QuoteResponse>("/api/quotes", {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(input),
    });
  }

  async getQuote(id: string, options?: RequestInit): Promise<QuoteResponse> {
    return this.request<QuoteResponse>(`/api/quotes/${id}`, options);
  }

  async listQuotes(
    params?: {
      page?: number;
      limit?: number;
      all?: boolean;
    },
    options?: RequestInit
  ): Promise<PaginatedResponse<QuoteResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.all) searchParams.set("all", "true");

    const queryString = searchParams.toString();
    const url = `/api/quotes${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<QuoteResponse>>(url, options);
  }

  async downloadQuotePdf(id: string, options?: RequestInit): Promise<Blob> {
    const fullUrl = this.baseUrl + `/api/quotes/${id}/pdf`;
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const data = await response.json();
      throw {
        status: response.status,
        ...data,
      };
    }

    // Return the blob data
    return await response.blob();
  }
}

export const apiClient = new ApiClient();

// Server-side API client with base URL for server components
export const serverApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
);

export type { ApiError };
