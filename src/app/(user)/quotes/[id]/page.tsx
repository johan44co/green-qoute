import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { QuoteResults } from "./quote-results";
import { serverApiClient } from "@/lib/api-client";
import { PageHeader } from "@/components/page-header";
import { DownloadQuotePdfButton } from "./download-quote-pdf-button";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface QuotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Quote #${id}`,
    description:
      "View your solar panel installation quote details, costs, and financing options.",
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params;
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    notFound();
  }

  // Fetch the quote
  let quote;
  try {
    quote = await serverApiClient.getQuote(id, {
      headers: new Headers(requestHeaders),
      cache: "no-store",
    });
  } catch {
    notFound();
  }

  // Check if the current user is the quote owner
  const isOwner = session.user.id === quote.userId;
  const title = isOwner ? "Your Solar Quote" : "Solar Quote";

  return (
    <>
      <PageHeader
        title={title}
        description={`Quote generated for ${quote.fullName} on ${formatDate(quote.createdAt)}`}
      />
      <div className="mb-6">
        <DownloadQuotePdfButton quoteId={id} />
      </div>
      <QuoteResults quote={quote} />
    </>
  );
}
