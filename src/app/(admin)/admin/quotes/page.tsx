import { headers } from "next/headers";
import { serverApiClient } from "@/lib/api-client";
import { QuotesTable } from "@/app/(user)/quotes/quotes-table";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - All Quotes",
  description:
    "Manage all solar panel installation quotes across the platform.",
};

interface AdminQuotesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminQuotesPage({
  searchParams,
}: AdminQuotesPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);

  const requestHeaders = await headers();
  const quotes = await serverApiClient.listQuotes(
    { page: currentPage, all: true },
    {
      headers: requestHeaders,
      cache: "no-store",
    }
  );

  if (!quotes || quotes.data.length === 0) {
    return (
      <>
        <PageHeader title="All Quotes" />
        <EmptyState
          title="No quotes yet"
          description="No solar quotes have been created yet"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="All Quotes"
        description={`Showing ${quotes.data.length} of ${quotes.pagination.total} quotes`}
      />
      <QuotesTable initialData={quotes} />
    </>
  );
}
