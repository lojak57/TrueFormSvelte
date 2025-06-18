import { expect, test } from "@playwright/test";

/**
 * Admin Dashboard E2E Tests
 *
 * Critical admin journeys:
 * - Admin login and authentication
 * - Dashboard loads with correct data
 * - Opportunity management (view, edit, delete)
 * - Admin settings and configuration
 * - Data export and reporting
 * - User management (if applicable)
 */

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto("/admin/opportunities");
  });

  test("dashboard loads and displays correctly", async ({ page }) => {
    // Verify admin dashboard loads
    await expect(page).toHaveTitle(/Admin|Dashboard/);

    // Check for admin navigation
    await expect(page.locator("nav, .sidebar")).toBeVisible();

    // Verify admin-specific elements
    await expect(
      page.locator("text=Dashboard, text=Opportunities, text=Admin")
    ).toBeVisible();
  });

  test("opportunities table displays data", async ({ page }) => {
    // Check for opportunities table/grid
    await expect(page.locator("table, .grid, .list")).toBeVisible();

    // Verify table headers
    await expect(
      page.locator("text=Name, text=Email, text=Status")
    ).toBeVisible();

    // Check for data rows (if any exist)
    const rows = page.locator("tr, .row, .item");
    const rowCount = await rows.count();

    if (rowCount > 1) {
      // More than just header
      await expect(rows.nth(1)).toBeVisible();
    }
  });

  test("can view opportunity details", async ({ page }) => {
    // Look for opportunity entries
    const opportunityLinks = page.locator(
      'a[href*="/admin/opportunities/"], .opportunity-item, tr td:first-child a'
    );

    if ((await opportunityLinks.count()) > 0) {
      // Click first opportunity
      await opportunityLinks.first().click();

      // Verify opportunity detail page loads
      await expect(page).toHaveURL(/\/admin\/opportunities\/[^\/]+/);

      // Check for opportunity details
      await expect(
        page.locator("text=Details, text=Contact, text=Project")
      ).toBeVisible();
    }
  });

  test("can filter and search opportunities", async ({ page }) => {
    // Look for search/filter controls
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="search"], input[name*="search"]'
    );

    if ((await searchInput.count()) > 0) {
      // Test search functionality
      await searchInput.fill("test");
      await page.keyboard.press("Enter");

      // Verify search updates results
      await expect(page.locator("table, .grid")).toBeVisible();
    }

    // Test filter dropdowns if available
    const filterSelects = page.locator(
      'select[name*="filter"], select[name*="status"], select[name*="type"]'
    );

    if ((await filterSelects.count()) > 0) {
      await filterSelects.first().selectOption({ index: 1 });

      // Verify filter applies
      await expect(page.locator("table, .grid")).toBeVisible();
    }
  });

  test("can update opportunity status", async ({ page }) => {
    // Find status update controls
    const statusSelects = page.locator(
      'select[name*="status"], .status-dropdown'
    );

    if ((await statusSelects.count()) > 0) {
      const firstStatus = statusSelects.first();
      await firstStatus.selectOption("in-progress");

      // Look for save/update button
      const saveButton = page.locator(
        'button:has-text("Save"), button:has-text("Update")'
      );
      if ((await saveButton.count()) > 0) {
        await saveButton.click();

        // Verify success feedback
        await expect(
          page.locator("text=updated, text=saved, text=success")
        ).toBeVisible();
      }
    }
  });

  test("can delete opportunities", async ({ page }) => {
    // Look for delete buttons
    const deleteButtons = page.locator(
      'button:has-text("Delete"), .delete-btn, [aria-label*="delete"]'
    );

    if ((await deleteButtons.count()) > 0) {
      // Click delete
      await deleteButtons.first().click();

      // Handle confirmation dialog
      await expect(
        page.locator("text=confirm, text=sure, text=delete")
      ).toBeVisible();

      // Confirm deletion
      const confirmButton = page.locator(
        'button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")'
      );
      if ((await confirmButton.count()) > 0) {
        await confirmButton.click();

        // Verify deletion success
        await expect(page.locator("text=deleted, text=removed")).toBeVisible();
      }
    }
  });

  test("admin navigation works correctly", async ({ page }) => {
    // Test navigation between admin sections
    const navLinks = page.locator("nav a, .sidebar a");

    if ((await navLinks.count()) > 0) {
      // Test dashboard link
      const dashboardLink = page
        .locator('a:has-text("Dashboard"), a[href*="/admin"]')
        .first();
      if ((await dashboardLink.count()) > 0) {
        await dashboardLink.click();
        await expect(page).toHaveURL(/\/admin/);
      }

      // Test opportunities link
      const opportunitiesLink = page.locator(
        'a:has-text("Opportunities"), a[href*="/opportunities"]'
      );
      if ((await opportunitiesLink.count()) > 0) {
        await opportunitiesLink.click();
        await expect(page).toHaveURL(/\/admin\/opportunities/);
      }
    }
  });

  test("can export data", async ({ page }) => {
    // Look for export functionality
    const exportButton = page.locator(
      'button:has-text("Export"), .export-btn, a:has-text("Download")'
    );

    if ((await exportButton.count()) > 0) {
      // Set up download handling
      const downloadPromise = page.waitForEvent("download");

      await exportButton.click();

      // Verify download starts
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|pdf)$/);
    }
  });

  test("displays admin statistics", async ({ page }) => {
    // Check for admin dashboard statistics
    const statCards = page.locator(".stat-card, .metric, .dashboard-stat");

    if ((await statCards.count()) > 0) {
      // Verify statistics are displayed
      await expect(statCards.first()).toBeVisible();

      // Check for numeric values
      await expect(page.locator("text=/\\d+/")).toBeVisible();
    }
  });
});

test.describe("Admin Dashboard - Authentication", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();

    // Try to access admin dashboard
    await page.goto("/admin/opportunities");

    // Should redirect to login or show auth prompt
    await expect(page).toHaveURL(/\/login|\/auth/);

    // Or should show login form on the same page
    await expect(
      page.locator('text=login, text=sign in, input[type="password"]')
    ).toBeVisible();
  });

  test("can login with valid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Check if login form exists
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
      // Fill login form
      await emailInput.fill("admin@trueform.dev");
      await passwordInput.fill("test123");

      // Submit login
      await page.click('button[type="submit"]');

      // Should redirect to admin dashboard
      await expect(page).toHaveURL(/\/admin/);

      // Verify admin interface is accessible
      await expect(
        page.locator("text=Dashboard, text=Admin, text=Opportunities")
      ).toBeVisible();
    }
  });

  test("shows error for invalid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
      // Fill with invalid credentials
      await emailInput.fill("wrong@email.com");
      await passwordInput.fill("wrongpassword");

      // Submit login
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator("text=invalid, text=incorrect, text=error")
      ).toBeVisible();

      // Should not redirect
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("can logout successfully", async ({ page }) => {
    // Start from admin dashboard (assumes authentication)
    await page.goto("/admin/opportunities");

    // Look for logout button
    const logoutButton = page.locator(
      'button:has-text("Logout"), a:has-text("Sign Out"), .logout-btn'
    );

    if ((await logoutButton.count()) > 0) {
      await logoutButton.click();

      // Should redirect to home or login page
      await expect(page).toHaveURL(/\/login|\/$/);

      // Verify admin dashboard is no longer accessible
      await page.goto("/admin/opportunities");
      await expect(page).toHaveURL(/\/login|\/auth/);
    }
  });
});

test.describe("Admin Dashboard - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/opportunities");
  });

  test("admin interface is mobile responsive", async ({ page }) => {
    // Verify admin interface adapts to mobile
    await expect(page.locator("nav, .sidebar, .admin-nav")).toBeVisible();

    // Check mobile menu if available
    const mobileMenuButton = page.locator(
      'button[aria-label="Menu"], .mobile-menu-btn'
    );

    if ((await mobileMenuButton.count()) > 0) {
      await mobileMenuButton.click();

      // Verify mobile menu opens
      await expect(
        page.locator("text=Dashboard, text=Opportunities")
      ).toBeVisible();
    }
  });

  test("opportunities table is mobile friendly", async ({ page }) => {
    // Verify table/list adapts to mobile viewport
    await expect(page.locator("table, .grid, .mobile-list")).toBeVisible();

    // Check for mobile-optimized layout
    const tableContainer = page.locator(".table-container, .responsive-table");

    if ((await tableContainer.count()) > 0) {
      // Should be scrollable horizontally if needed
      await expect(tableContainer).toBeVisible();
    }
  });

  test("mobile admin actions work correctly", async ({ page }) => {
    // Test mobile-specific admin actions
    const actionButtons = page.locator("button, .action-btn");

    if ((await actionButtons.count()) > 0) {
      // Verify buttons are accessible on mobile
      await expect(actionButtons.first()).toBeVisible();

      // Test button interactions
      await actionButtons.first().click();

      // Should work without layout issues
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Admin Dashboard - Performance", () => {
  test("admin dashboard loads within performance budget", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/admin/opportunities");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Admin dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("large datasets render efficiently", async ({ page }) => {
    await page.goto("/admin/opportunities");

    // Check if pagination or virtual scrolling is implemented
    const paginationControls = page.locator(
      '.pagination, .page-nav, button:has-text("Next")'
    );
    const virtualScroll = page.locator(".virtual-scroll, .lazy-load");

    // Should have either pagination or virtual scrolling for large datasets
    const hasPerformanceOptimization =
      (await paginationControls.count()) > 0 ||
      (await virtualScroll.count()) > 0;

    // If there are many rows, performance optimization should be present
    const rows = page.locator("tr, .row-item");
    const rowCount = await rows.count();

    if (rowCount > 20) {
      expect(hasPerformanceOptimization).toBe(true);
    }
  });
});
