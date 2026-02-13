/**
 * Centralized test mock exports
 *
 * Mock setup is done globally in jest.mocks.ts via jest.config.ts setupFiles.
 * This file exports typed references to the mocked functions.
 *
 * Usage in test files:
 *
 * import {
 *   mockGetSession,
 *   mockQuoteCreate,
 * } from "@/lib/test-mocks";
 *
 * describe("My test", () => {
 *   beforeEach(() => {
 *     jest.clearAllMocks();
 *   });
 *
 *   it("should work", () => {
 *     mockGetSession.mockResolvedValue(createMockSession());
 *     // ... test code
 *   });
 * });
 */

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Export typed mock functions
export const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

export const mockQuoteCreate = prisma.quote.create as jest.MockedFunction<
  typeof prisma.quote.create
>;

export const mockQuoteFindMany = prisma.quote.findMany as jest.MockedFunction<
  typeof prisma.quote.findMany
>;

export const mockQuoteFindUnique = prisma.quote
  .findUnique as jest.MockedFunction<typeof prisma.quote.findUnique>;

export const mockQuoteUpdate = prisma.quote.update as jest.MockedFunction<
  typeof prisma.quote.update
>;

export const mockQuoteDelete = prisma.quote.delete as jest.MockedFunction<
  typeof prisma.quote.delete
>;

export const mockQuoteCount = prisma.quote.count as jest.MockedFunction<
  typeof prisma.quote.count
>;
