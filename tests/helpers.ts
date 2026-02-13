/**
 * Shared helpers for E2E tests and seed scripts
 */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateQuote } from "@/lib/pricing";
import { Prisma, Quote } from "@prisma/client";

export type QuoteData = Pick<
  Quote,
  | "fullName"
  | "email"
  | "address1"
  | "city"
  | "region"
  | "zip"
  | "country"
  | "monthlyConsumptionKwh"
  | "systemSizeKw"
  | "downPayment"
>;

export interface UserWithQuotes {
  name: string;
  email: string;
  password: string;
  quotes: QuoteData[];
}

/**
 * Ensures admin user exists, creates if missing, updates role if needed
 */
export async function ensureAdminUser(
  email: string,
  password: string,
  name: string
): Promise<void> {
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: ["admin", "user"],
      },
    });
  } else if (!existingAdmin.role?.includes("admin")) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { role: "admin,user" },
    });
  }
}

/**
 * Creates users with their quotes
 * Skips user creation if user already exists
 */
export async function createUsersWithQuotes(
  users: UserWithQuotes[]
): Promise<void> {
  for (const userData of users) {
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      // Create user
      await auth.api.createUser({
        body: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: ["user"],
        },
      });

      user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
    }

    if (user) {
      // Create quotes for this user
      for (const quoteData of userData.quotes) {
        const quoteResult = calculateQuote({
          systemSizeKw: quoteData.systemSizeKw,
          monthlyConsumptionKwh: quoteData.monthlyConsumptionKwh,
          downPayment: quoteData.downPayment,
        });

        await prisma.quote.create({
          data: {
            userId: user.id,
            fullName: quoteData.fullName,
            email: quoteData.email,
            address1: quoteData.address1,
            address2: null,
            city: quoteData.city,
            region: quoteData.region,
            zip: quoteData.zip,
            country: quoteData.country,
            monthlyConsumptionKwh: quoteData.monthlyConsumptionKwh,
            systemSizeKw: quoteData.systemSizeKw,
            downPayment: quoteData.downPayment,
            systemPrice: quoteResult.systemPrice,
            principalAmount: quoteResult.principalAmount,
            riskBand: quoteResult.riskBand,
            offers: quoteResult.offers as unknown as Prisma.InputJsonValue,
          },
        });
      }
    }
  }
}

/**
 * Deletes test users by email (cascade deletes their quotes)
 */
export async function deleteTestUsers(emails: string[]): Promise<void> {
  for (const email of emails) {
    await prisma.user
      .delete({
        where: { email },
      })
      .catch(() => {
        // Ignore if user doesn't exist
      });
  }
}
