import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { renderToStream } from "@react-pdf/renderer";
import { QuotePDFDocument } from "./quote-pdf-document";
import type { QuoteResponse } from "@/lib/api-client";
import { log } from "@/lib/logger";

export const GET = withAuth<{ id: string }>(async ({ params, session }) => {
  const { id } = await params;
  const userId = session.user.id;

  log.info("Generating PDF for quote", { userId, quoteId: id });

  // Fetch quote from database
  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    log.warn("PDF generation failed - quote not found", {
      userId,
      quoteId: id,
    });
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  // Verify ownership (skip for admins)
  const isAdmin = session.user.role?.includes("admin");
  if (!isAdmin && quote.userId !== session.user.id) {
    log.warn(
      "PDF generation forbidden - user attempting to access another user's quote",
      {
        userId,
        quoteId: id,
        quoteOwnerId: quote.userId,
      }
    );
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const startTime = Date.now();

  try {
    // Generate PDF
    const pdfStream = await renderToStream(
      <QuotePDFDocument quote={quote as QuoteResponse} />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    const duration = Date.now() - startTime;
    log.info("PDF generated successfully", {
      userId,
      quoteId: id,
      duration,
      sizeBytes: buffer.length,
    });

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Green-Quote-${id}.pdf"`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    log.error("PDF generation failed", error, {
      userId,
      quoteId: id,
      duration,
    });
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
});
