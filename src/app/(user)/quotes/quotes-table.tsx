"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Pagination,
  Button,
} from "@/components/ui";
import { type PaginatedResponse, type QuoteResponse } from "@/lib/api-client";
import { formatDate, formatCurrency } from "@/lib/utils";

interface QuotesTableProps {
  initialData: PaginatedResponse<QuoteResponse>;
  showAdminColumns?: boolean;
}

export function QuotesTable({
  initialData,
  showAdminColumns = false,
}: QuotesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quotes, setQuotes] =
    useState<PaginatedResponse<QuoteResponse>>(initialData);

  // Update quotes when initialData changes (from server-side navigation)
  useEffect(() => {
    setQuotes(initialData);
  }, [initialData]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function viewQuote(id: string) {
    router.push(`/quotes/${id}`);
  }

  return (
    <>
      <div className="border border-foreground/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {showAdminColumns && (
                <>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                </>
              )}
              <TableHead className="text-right">System Size</TableHead>
              <TableHead className="text-right">System Price</TableHead>
              <TableHead className="text-center">Risk Band</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.data.map((quote) => (
              <TableRow key={quote.id}>
                {showAdminColumns && (
                  <>
                    <TableCell className="font-medium">
                      {quote.fullName}
                    </TableCell>
                    <TableCell>{quote.email}</TableCell>
                    <TableCell>{quote.city}</TableCell>
                  </>
                )}
                <TableCell className="text-right">
                  {quote.systemSizeKw} kW
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(quote.systemPrice)}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={
                      quote.riskBand === "A"
                        ? "text-green-600 dark:text-green-400"
                        : quote.riskBand === "B"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-orange-600 dark:text-orange-400"
                    }
                  >
                    {quote.riskBand}
                  </span>
                </TableCell>
                <TableCell>{formatDate(quote.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewQuote(quote.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {quotes.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={quotes.pagination.page}
            totalPages={quotes.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
