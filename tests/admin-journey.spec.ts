import { test, expect, Page } from "@playwright/test";
import {
  ensureAdminUser,
  createUsersWithQuotes,
  deleteTestUsers,
  type UserWithQuotes,
} from "./helpers";
import { createTestUsers } from "./fixtures/test-users";
import "dotenv/config";

test.describe.serial("Admin Journey - All Quotes View", () => {
  let sharedPage: Page;
  const timestamp = Date.now();
  let browserName: string;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME must be set in .env file"
    );
  }

  let testUsers: UserWithQuotes[];

  test.beforeAll(async ({ browser, browserName: bn }) => {
    browserName = bn;

    // Create unique test users for this test run
    testUsers = createTestUsers(browserName, timestamp);

    // Ensure admin user exists
    await ensureAdminUser(adminEmail, adminPassword, adminName);

    // Create test users with quotes
    await createUsersWithQuotes(testUsers);

    const context = await browser.newContext();
    sharedPage = await context.newPage();
  });

  test.afterAll(async () => {
    // Cleanup: Delete test users (cascade will delete their quotes)
    await deleteTestUsers(testUsers.map((u) => u.email));

    await sharedPage.close();
  });

  test("should sign in as admin", async () => {
    await sharedPage.goto("/sign-in");

    await expect(
      sharedPage.getByRole("heading", { name: /Sign In/i })
    ).toBeVisible();

    // Fill in the sign-in form
    await sharedPage.getByLabel(/Email/i).fill(adminEmail);
    await sharedPage.getByLabel(/Password/i).fill(adminPassword);
    await sharedPage.getByRole("button", { name: /Sign In/i }).click();

    // Wait for navigation to complete
    await sharedPage.waitForURL("/admin/quotes");

    // Verify we successfully signed in and redirected to admin quotes
    await expect(sharedPage).toHaveURL("/admin/quotes");
    await expect(
      sharedPage.getByRole("heading", { name: /All Quotes/i })
    ).toBeVisible();
  });

  test("should display all users quotes", async () => {
    // Check that table is visible
    await expect(sharedPage.getByRole("table")).toBeVisible();

    // Check that we have quotes from all test users (visible on first page)
    await expect(sharedPage.getByText(/Emma Schmidt/i).first()).toBeVisible();
    await expect(sharedPage.getByText(/Max Müller/i).first()).toBeVisible();
    await expect(sharedPage.getByText(/Sophie Weber/i).first()).toBeVisible();

    // Verify we're showing paginated results
    await expect(
      sharedPage.getByText(/Showing \d+ of \d+ quotes/)
    ).toBeVisible();
  });

  test("should be able to view any user's quote", async () => {
    // Click on the first "View" button
    await sharedPage.getByRole("button", { name: /View/i }).first().click();

    // Verify we're on a quote detail page
    await expect(sharedPage).toHaveURL(/\/quotes\/[a-z0-9-]+/);
    await expect(
      sharedPage.getByRole("heading", { name: /Solar Quote/i })
    ).toBeVisible();

    // Verify we can see installation details
    await expect(sharedPage.getByText(/Installation Details/i)).toBeVisible();

    // Verify we can see financing options
    await expect(sharedPage.getByText(/Financing Options/i)).toBeVisible();
  });

  test("should be able to download any user's quote as PDF", async () => {
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

  test("should be able to navigate back to admin view", async () => {
    // Click on user menu trigger
    await sharedPage.getByRole("button", { name: "User menu" }).click();

    // Click on "All Quotes" menu item
    await sharedPage.getByRole("menuitem", { name: /All Quotes/i }).click();

    // Verify we're back on admin quotes page
    await expect(sharedPage).toHaveURL("/admin/quotes");
    await expect(
      sharedPage.getByRole("heading", { name: /All Quotes/i })
    ).toBeVisible();
  });

  test("should have pagination if more than 10 quotes", async () => {
    // Should show pagination info on first page
    await expect(
      sharedPage.getByText(/Showing .* of \d+ quotes/)
    ).toBeVisible();

    // Click next to go to page 2
    await sharedPage.getByRole("button", { name: "Next page" }).click();

    // Wait for URL to update
    await sharedPage.waitForURL(/\?page=2/);

    // Previous button should be visible on page 2
    await expect(
      sharedPage.getByRole("button", { name: "Previous page" })
    ).toBeVisible();

    // Still showing pagination info
    await expect(
      sharedPage.getByText(/Showing .* of \d+ quotes/)
    ).toBeVisible();
  });
});
