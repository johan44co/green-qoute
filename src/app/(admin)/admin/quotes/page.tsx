import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { serverApiClient } from "@/lib/api-client";
import { QuotesTable } from "@/app/(user)/quotes/quotes-table";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

interface AdminQuotesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminQuotesPage({
  searchParams,
}: AdminQuotesPageProps) {
  await auth.api.getSession({
    headers: await headers(),
  });

  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);

  const requestHeaders = await headers();
  const quotes = await serverApiClient.listQuotes(
    { page: currentPage, all: true },
    { headers: requestHeaders }
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
      <QuotesTable initialData={quotes} showAdminColumns />
    </>
  );
}
