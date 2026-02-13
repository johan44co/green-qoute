import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth<{ id: string }>(
  async ({ params, session }) => {
    const { id } = await params;

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Verify ownership (skip for admins)
    const isAdmin = session.user.role?.includes("admin");
    if (!isAdmin && quote.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return quote
    return NextResponse.json(quote);
  }
);
