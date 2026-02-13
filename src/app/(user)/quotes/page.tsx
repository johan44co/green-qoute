import { headers } from "next/headers";
import { serverApiClient } from "@/lib/api-client";
import { QuotesTable } from "./quotes-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Quotes",
  description: "View and manage all your solar panel installation quotes.",
};
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

interface QuotesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const requestHeaders = await headers();

  const quotes = await serverApiClient.listQuotes(
    { page, limit: 10 },
    {
      headers: requestHeaders,
      cache: "no-store",
    }
  );

  if (!quotes || quotes.data.length === 0) {
    return (
      <>
        <PageHeader title="Your Quotes" />
        <EmptyState
          title="No quotes yet"
          description="Get started by creating your first solar quote"
        >
          <Link href="/quotes/add">
            <Button>Create Your First Quote</Button>
          </Link>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Your Quotes"
        description={`Showing ${quotes.data.length} of ${quotes.pagination.total} quotes`}
      />
      <div className="mb-6">
        <Link href="/quotes/add">
          <Button>Create New Quote</Button>
        </Link>
      </div>
      <QuotesTable initialData={quotes} />
    </>
  );
}
