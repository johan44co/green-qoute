import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { log } from "@/lib/logger";

export const GET = withAuth<{ id: string }>(async ({ params, session }) => {
  const { id } = await params;
  const userId = session.user.id;

  log.info("Fetching quote", { userId, quoteId: id });

  // Fetch quote from database
  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    log.warn("Quote not found", { userId, quoteId: id });
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  // Verify ownership (skip for admins)
  const isAdmin = session.user.role?.includes("admin");
  if (!isAdmin && quote.userId !== session.user.id) {
    log.warn("Forbidden - user attempting to access another user's quote", {
      userId,
      quoteId: id,
      quoteOwnerId: quote.userId,
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  log.info("Quote fetched successfully", { userId, quoteId: id });

  // Return quote
  return NextResponse.json(quote);
});
