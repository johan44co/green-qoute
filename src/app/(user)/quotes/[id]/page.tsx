import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { QuoteResults } from "./quote-results";
import { serverApiClient } from "@/lib/api-client";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";

interface QuotePageProps {
  params: Promise<{
    id: string;
  }>;
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
      headers: requestHeaders,
      cache: "no-store",
    });
  } catch (error) {
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
      <QuoteResults quote={quote} />
    </>
  );
}
