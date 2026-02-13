import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { calculateQuote } from "@/lib/pricing";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/lib/with-auth";
import { getCountryList } from "@/lib/countries";
import { log } from "@/lib/logger";

const quoteInputSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  zip: z.string().min(3, "ZIP/Postal code is required"),
  country: z
    .string()
    .length(2, "Country code is required")
    .refine(
      (code) => getCountryList().some((c) => c.value === code),
      "Invalid country code"
    ),
  monthlyConsumptionKwh: z
    .number()
    .positive("Monthly consumption must be a positive number"),
  systemSizeKw: z.number().positive("System size must be a positive number"),
  downPayment: z.number().min(0, "Down payment cannot be negative").optional(),
});

export const POST = withAuth(async ({ request, session }) => {
  const userId = session.user.id;

  // Parse and validate input
  const body = await request.json();
  const validationResult = quoteInputSchema.safeParse(body);

  if (!validationResult.success) {
    log.warn("Quote creation failed - validation error", {
      userId,
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(validationResult.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const input = validationResult.data;

  log.info("Creating quote", {
    userId,
    systemSizeKw: input.systemSizeKw,
    monthlyConsumptionKwh: input.monthlyConsumptionKwh,
  });

  // Calculate quote
  const quoteResult = calculateQuote({
    systemSizeKw: input.systemSizeKw,
    monthlyConsumptionKwh: input.monthlyConsumptionKwh,
    downPayment: input.downPayment,
  });

  // Persist quote to database
  const quote = await prisma.quote.create({
    data: {
      userId: session.user.id,
      fullName: input.fullName,
      email: input.email,
      address1: input.address1,
      address2: input.address2,
      city: input.city,
      region: input.region,
      zip: input.zip,
      country: input.country,
      monthlyConsumptionKwh: input.monthlyConsumptionKwh,
      systemSizeKw: input.systemSizeKw,
      downPayment: input.downPayment || 0,
      systemPrice: quoteResult.systemPrice,
      principalAmount: quoteResult.principalAmount,
      riskBand: quoteResult.riskBand,
      offers: quoteResult.offers as unknown as Prisma.InputJsonValue,
    },
  });

  log.info("Quote created successfully", {
    userId,
    quoteId: quote.id,
    systemPrice: quote.systemPrice,
  });

  // Return quote
  return NextResponse.json(quote);
});

export const GET = withAuth(async ({ request, session }) => {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const all = searchParams.get("all") === "true";

  const userId = session.user.id;
  const isAdmin = session.user.role?.includes("admin");

  // Build where clause based on role and 'all' parameter
  // Only admins can request all quotes with all=true
  const where = isAdmin && all ? {} : { userId: session.user.id };

  log.info("Fetching quotes", {
    userId,
    isAdmin,
    all,
    page,
    limit,
  });

  // Fetch quotes with pagination
  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.quote.count({ where }),
  ]);

  log.info("Quotes fetched successfully", {
    userId,
    count: quotes.length,
    total,
    page,
  });

  // Return paginated response
  return NextResponse.json({
    data: quotes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
