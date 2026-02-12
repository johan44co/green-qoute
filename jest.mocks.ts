/**
 * Global Jest module mocks
 * 
 * This file is loaded before all test files via jest.config.ts setupFiles.
 * It sets up mocks for commonly used modules across all tests.
 */

// Mock @/lib/auth
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

// Mock @/lib/prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    quote: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));
