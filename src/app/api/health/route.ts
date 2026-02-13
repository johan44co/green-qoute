import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { log } from "@/lib/logger";

export async function GET() {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    let migrations = "applied";
    try {
      const failed = await prisma.$queryRaw<
        Array<{ finished_at: Date | null }>
      >`
        SELECT finished_at FROM _prisma_migrations 
        WHERE finished_at IS NULL OR logs LIKE '%Error%' LIMIT 1
      `;
      if (failed.length > 0) {
        log.error("Health check failed - migrations have errors", undefined, {
          requestId,
          duration: Date.now() - startTime,
        });
        return NextResponse.json(
          {
            status: "error",
            timestamp: new Date().toISOString(),
            database: "connected",
            migrations: "failed",
            error: "Pending or failed migrations detected",
          },
          { status: 503 }
        );
      }
    } catch {
      migrations = "not-applied";
    }

    log.info("Health check passed", {
      requestId,
      duration: Date.now() - startTime,
      database: "connected",
      migrations,
    });

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      migrations,
    });
  } catch (error) {
    log.error("Health check failed - database error", error, {
      requestId,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        migrations: "unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
