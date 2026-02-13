"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { apiClient, type PaginatedResponse, type QuoteResponse } from "@/lib/api-client";

interface UseQuotesTableProps {
  initialData: PaginatedResponse<QuoteResponse>;
}

export function useQuotesTable({ initialData }: UseQuotesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState<PaginatedResponse<QuoteResponse>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    // Fetch data whenever page changes
    if (currentPage !== quotes.pagination.page) {
      loadQuotes(currentPage);
    }
    // We intentionally don't include quotes.pagination.page in dependencies
    // to avoid infinite loop: effect runs, loadQuotes updates quotes, effect runs again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  async function loadQuotes(page: number) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.listQuotes({ page, limit: 10 });
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes. Please try again.");
      console.error("Error loading quotes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function retry() {
    loadQuotes(currentPage);
  }

  return {
    quotes,
    isLoading,
    error,
    handlePageChange,
    retry,
  };
}
