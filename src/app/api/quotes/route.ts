import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { calculateQuote } from "@/lib/pricing";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/lib/with-auth";

const quoteInputSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  zip: z.string().min(3, "ZIP/Postal code is required"),
  country: z.string().min(2, "Country is required"),
  monthlyConsumptionKwh: z
    .number()
    .positive("Monthly consumption must be a positive number"),
  systemSizeKw: z.number().positive("System size must be a positive number"),
  downPayment: z.number().min(0, "Down payment cannot be negative").optional(),
});

export const POST = withAuth(async ({ request, session }) => {
  // Parse and validate input
  const body = await request.json();
  const validationResult = quoteInputSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(validationResult.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const input = validationResult.data;

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

  // Return quote without userId
  const { userId, ...quoteResponse } = quote;
  return NextResponse.json(quoteResponse);
});

export const GET = withAuth(async ({ request, session }) => {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  // Check if user is admin
  const isAdmin = session.user.role?.includes("admin");

  // Build where clause based on role
  const where = isAdmin ? {} : { userId: session.user.id };

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

  // Return paginated response
  return NextResponse.json({
    data: quotes.map(({ userId, ...quote }) => quote),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});