import { test, expect, Page } from "@playwright/test";
import prisma from "@/lib/prisma";

test.describe.serial("Complete User Journey - Happy Path", () => {
  const timestamp = Date.now();
  let testUser: {
    name: string;
    email: string;
    password: string;
  };

  let sharedPage: Page;

  test.beforeAll(async ({ browser, browserName }) => {
    // Create unique email per browser to avoid conflicts
    testUser = {
      name: "Test User",
      email: `test-${browserName}-${timestamp}@example.com`,
      password: "TestPassword123!",
    };

    // Create a new page that will be shared across all tests
    const context = await browser.newContext();
    sharedPage = await context.newPage();
  });

  test.afterAll(async () => {
    // Cleanup: Delete test user (cascade will delete all related data)
    await prisma.user.delete({
      where: { email: testUser.email },
    });

    await sharedPage.close();
  });

  test("should sign up and create account", async () => {
    // Navigate to home and click Get Started
    await sharedPage.goto("/");
    await sharedPage.getByRole("link", { name: /Get Started/i }).click();

    // Verify we're on sign-up page
    await expect(sharedPage).toHaveURL("/sign-up");
    await expect(
      sharedPage.getByRole("heading", { name: /Sign Up/i })
    ).toBeVisible();

    // Fill in the sign-up form
    await sharedPage.getByLabel(/Name/i).fill(testUser.name);
    await sharedPage.getByLabel(/Email/i).fill(testUser.email);
    await sharedPage.getByLabel(/Password/i).fill(testUser.password);
    await sharedPage.getByRole("button", { name: /Sign Up/i }).click();

    // Wait for navigation to complete
    await sharedPage.waitForURL("/quotes");

    // Verify we successfully signed up and are on quotes page
    await expect(sharedPage).toHaveURL("/quotes");
    await expect(
      sharedPage.getByRole("heading", { name: /Your Quotes/i })
    ).toBeVisible();
  });

  test("should navigate to add quote page", async () => {
    await sharedPage
      .getByRole("button", { name: /Create your first quote/i })
      .click();

    await expect(sharedPage).toHaveURL("/quotes/add");
    await expect(
      sharedPage.getByRole("heading", { name: /Get Your Solar Quote/i })
    ).toBeVisible();
  });

  test("should fill and submit quote form", async () => {
    await sharedPage.getByLabel(/Full Name/i).fill("Hans Mueller");
    await sharedPage.getByLabel(/Email/i).fill("hans@example.com");
    await sharedPage.getByLabel(/Address Line 1/i).fill("Unter den Linden 77");
    await sharedPage.getByLabel(/City/i).fill("Berlin");
    await sharedPage.getByLabel(/ZIP/i).fill("10117");

    // Select Germany from country combobox
    await sharedPage.getByRole("combobox", { name: /Country/i }).click();
    await sharedPage
      .getByRole("combobox", { name: /Country/i })
      .fill("Germany");
    await sharedPage.getByRole("option", { name: /Germany/i }).click();

    await sharedPage.getByLabel(/Monthly Consumption/i).fill("500");
    await sharedPage.getByLabel(/System Size/i).fill("6");
    await sharedPage.getByLabel(/Down Payment/i).fill("2000");

    await sharedPage
      .getByRole("button", { name: /Get Pre-Qualification/i })
      .click();

    // Verify redirect to quote detail page
    await expect(sharedPage).toHaveURL(/\/quotes\/[a-z0-9-]+/);
  });

  test("should display quote results correctly", async () => {
    await expect(
      sharedPage.getByRole("heading", { name: /Your Solar Quote/i })
    ).toBeVisible();

    // Verify installation details
    await expect(sharedPage.getByText(/Installation Details/i)).toBeVisible();
    await expect(sharedPage.getByText(/Hans Mueller/i).first()).toBeVisible();
    await expect(sharedPage.getByText(/Berlin/i)).toBeVisible();
    await expect(sharedPage.getByText(/Germany/i)).toBeVisible();
  });

  test("should display financing options", async () => {
    await expect(sharedPage.getByText(/Financing Options/i)).toBeVisible();
    await expect(
      sharedPage.getByRole("paragraph").filter({ hasText: /^5 Years$/i })
    ).toBeVisible();
    await expect(
      sharedPage.getByRole("paragraph").filter({ hasText: /^10 Years$/i })
    ).toBeVisible();
    await expect(
      sharedPage.getByRole("paragraph").filter({ hasText: /^15 Years$/i })
    ).toBeVisible();
  });

  test("should download quote as PDF", async () => {
    // Click the download button
    const downloadPromise = sharedPage.waitForEvent("download");
    await sharedPage.getByRole("button", { name: /Download PDF/i }).click();

    // Wait for the download to complete
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/^Green-Quote-.+\.pdf$/);

    // Verify download succeeded
    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
