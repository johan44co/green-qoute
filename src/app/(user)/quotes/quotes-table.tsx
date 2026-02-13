"use client";
import { useRouter } from "next/navigation";
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
import { useQuotesTable } from "./use-quotes-table";

interface QuotesTableProps {
  initialData: PaginatedResponse<QuoteResponse>;
  showAdminColumns?: boolean;
}

export function QuotesTable({
  initialData,
  showAdminColumns = false,
}: QuotesTableProps) {
  const router = useRouter();
  const { quotes, isLoading, error, handlePageChange, retry } = useQuotesTable({
    initialData,
  });

  function viewQuote(id: string) {
    router.push(`/quotes/${id}`);
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" size="sm" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="mb-6 p-4 rounded-lg bg-foreground/5 border border-foreground/20">
          <p className="text-foreground/70">Loading quotes...</p>
        </div>
      )}

      <div className="border border-foreground/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {showAdminColumns && (
                <>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </>
              )}
              <TableHead>System Size</TableHead>
              <TableHead>System Price</TableHead>
              <TableHead className="text-center">Risk Band</TableHead>
              <TableHead className="text-center">Date</TableHead>
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
                  </>
                )}
                <TableCell>{quote.systemSizeKw} kW</TableCell>
                <TableCell>{formatCurrency(quote.systemPrice)}</TableCell>
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
                <TableCell className="text-center">
                  {formatDate(quote.createdAt)}
                </TableCell>
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
