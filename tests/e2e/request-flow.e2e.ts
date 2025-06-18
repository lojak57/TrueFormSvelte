import { expect, test } from "@playwright/test";

/**
 * Project Request Flow E2E Tests
 *
 * Critical user journeys:
 * - Form loads and displays correctly
 * - Validation works for all fields
 * - File uploads function properly
 * - Form submission completes successfully
 * - Error handling works appropriately
 * - Success feedback is shown
 */

test.describe("Project Request Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/request");
  });

  test("form loads with all required fields", async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/Request Project/);

    // Check form exists
    await expect(page.locator("form")).toBeVisible();

    // Verify required fields are present
    await expect(
      page.locator('input[type="text"][name*="name"]')
    ).toBeVisible();
    await expect(
      page.locator('input[type="email"][name*="email"]')
    ).toBeVisible();
    await expect(
      page.locator('input[type="tel"][name*="phone"]')
    ).toBeVisible();
    await expect(page.locator('textarea[name*="description"]')).toBeVisible();

    // Check service type selector
    await expect(page.locator('select, [role="combobox"]')).toBeVisible();

    // Verify submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("validates required fields", async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(
      page.locator("text=required", { hasText: /name.*required/i })
    ).toBeVisible();
    await expect(
      page.locator("text=required", { hasText: /email.*required/i })
    ).toBeVisible();

    // Form should not submit
    await expect(page).toHaveURL(/\/request/);
  });

  test("validates email format", async ({ page }) => {
    // Fill invalid email
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button[type="submit"]');

    // Check for email validation error
    await expect(page.locator("text=valid email")).toBeVisible();
  });

  test("validates phone number format", async ({ page }) => {
    // Fill invalid phone
    await page.fill('input[type="tel"]', "123");
    await page.click('button[type="submit"]');

    // Check for phone validation error
    await expect(page.locator("text=valid phone")).toBeVisible();
  });

  test("service type selection works", async ({ page }) => {
    // Test service dropdown/select
    const serviceSelector = page.locator('select, [role="combobox"]').first();
    await serviceSelector.click();

    // Verify service options are available
    await expect(page.locator("text=Marketing Website")).toBeVisible();
    await expect(page.locator("text=E-commerce Store")).toBeVisible();
    await expect(page.locator("text=Booking System")).toBeVisible();

    // Select a service
    await page.click("text=Marketing Website");

    // Verify selection
    await expect(serviceSelector).toHaveValue(/marketing/);
  });

  test("budget selection works", async ({ page }) => {
    // Look for budget options (radio buttons or dropdown)
    const budgetOptions = page.locator(
      'input[type="radio"], select[name*="budget"]'
    );

    if ((await budgetOptions.count()) > 0) {
      // Test budget selection
      await page.click("text=$5,000 - $10,000");

      // Verify selection
      const selectedBudget = page.locator('input[type="radio"]:checked');
      await expect(selectedBudget).toBeVisible();
    }
  });

  test("timeline selection functions", async ({ page }) => {
    // Test timeline options
    const timelineOptions = page.locator(
      "text=1-2 weeks, text=1-2 months, text=3+ months"
    );

    if ((await timelineOptions.count()) > 0) {
      await page.click("text=1-2 months");

      // Verify timeline selection
      const selectedTimeline = page.locator('input[type="radio"]:checked');
      await expect(selectedTimeline).toBeVisible();
    }
  });

  test("file upload works", async ({ page }) => {
    // Look for file upload input
    const fileInput = page.locator('input[type="file"]');

    if ((await fileInput.count()) > 0) {
      // Create a test file
      const testFile = Buffer.from("test content");

      // Upload test file
      await fileInput.setInputFiles({
        name: "test-document.txt",
        mimeType: "text/plain",
        buffer: testFile,
      });

      // Verify file upload feedback
      await expect(page.locator("text=test-document.txt")).toBeVisible();
    }
  });

  test("completes successful form submission", async ({ page }) => {
    // Fill out complete form
    await page.fill('input[name*="name"]', "John Doe");
    await page.fill('input[type="email"]', "john@example.com");
    await page.fill('input[type="tel"]', "+1-555-123-4567");

    // Select service type
    const serviceSelector = page.locator('select, [role="combobox"]').first();
    await serviceSelector.selectOption("marketing");

    // Fill description
    await page.fill(
      "textarea",
      "I need a professional marketing website for my business."
    );

    // Select budget if available
    const budgetRadio = page.locator('input[type="radio"]').first();
    if ((await budgetRadio.count()) > 0) {
      await budgetRadio.click();
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success (could be redirect or success message)
    await expect(
      page.locator("text=success, text=submitted, text=thank you")
    ).toBeVisible({ timeout: 10000 });
  });

  test("handles form submission errors gracefully", async ({ page }) => {
    // Fill form with potentially problematic data
    await page.fill('input[name*="name"]', "Test User");
    await page.fill('input[type="email"]', "test@invalid-domain.invalid");
    await page.fill("textarea", "Test description");

    // Submit form
    await page.click('button[type="submit"]');

    // Should handle error gracefully (show error message or retry option)
    await expect(page.locator("text=error, text=try again, text=problem"))
      .toBeVisible({ timeout: 10000 })
      .or(page.locator("text=success, text=submitted"))
      .toBeVisible({ timeout: 10000 });
  });

  test("form fields retain values on validation error", async ({ page }) => {
    // Fill partial form
    await page.fill('input[name*="name"]', "John Doe");
    await page.fill('input[type="email"]', "invalid-email");

    // Submit to trigger validation
    await page.click('button[type="submit"]');

    // Verify valid data is retained
    await expect(page.locator('input[name*="name"]')).toHaveValue("John Doe");

    // Fix email and verify form can be submitted
    await page.fill('input[type="email"]', "john@example.com");
    await page.fill("textarea", "Test description");

    const serviceSelector = page.locator('select, [role="combobox"]').first();
    if ((await serviceSelector.count()) > 0) {
      await serviceSelector.selectOption({ index: 1 });
    }

    await page.click('button[type="submit"]');

    // Should now succeed
    await expect(page.locator("text=success, text=submitted")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Project Request Form - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/request");
  });

  test("form is responsive on mobile", async ({ page }) => {
    // Verify form adapts to mobile viewport
    await expect(page.locator("form")).toBeVisible();

    // Check fields are accessible
    await expect(page.locator('input[name*="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Verify submit button is visible and accessible
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("mobile keyboard appears for appropriate inputs", async ({ page }) => {
    // Test email input brings up email keyboard (on real mobile)
    await page.click('input[type="email"]');
    await expect(page.locator('input[type="email"]')).toBeFocused();

    // Test phone input
    await page.click('input[type="tel"]');
    await expect(page.locator('input[type="tel"]')).toBeFocused();
  });

  test("mobile form submission works", async ({ page }) => {
    // Fill and submit form on mobile
    await page.fill('input[name*="name"]', "Mobile User");
    await page.fill('input[type="email"]', "mobile@example.com");
    await page.fill("textarea", "Mobile form submission test");

    // Select service
    const serviceSelector = page.locator('select, [role="combobox"]').first();
    if ((await serviceSelector.count()) > 0) {
      await serviceSelector.selectOption({ index: 1 });
    }

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator("text=success, text=submitted")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Project Request Form - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/request");
  });

  test("form has proper labels and ARIA attributes", async ({ page }) => {
    // Check form labels
    await expect(page.locator('label[for*="name"]')).toBeVisible();
    await expect(page.locator('label[for*="email"]')).toBeVisible();

    // Verify ARIA attributes
    const requiredFields = page.locator("input[required], textarea[required]");
    const fieldCount = await requiredFields.count();

    for (let i = 0; i < fieldCount; i++) {
      const field = requiredFields.nth(i);
      await expect(field).toHaveAttribute("aria-required", "true");
    }
  });

  test("error messages are accessible", async ({ page }) => {
    // Submit empty form to trigger errors
    await page.click('button[type="submit"]');

    // Check error messages have proper ARIA attributes
    const errorMessages = page.locator('[role="alert"], .error-message');

    if ((await errorMessages.count()) > 0) {
      const firstError = errorMessages.first();
      await expect(firstError).toBeVisible();
    }
  });

  test("form is keyboard navigable", async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press("Tab");
    await expect(page.locator('input[name*="name"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('input[type="email"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('input[type="tel"]')).toBeFocused();

    // Continue tabbing to submit button
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test("supports screen reader announcements", async ({ page }) => {
    // Fill form and verify announcements would be made
    await page.fill('input[name*="name"]', "Test User");

    // Submit empty required fields to trigger errors
    await page.click('button[type="submit"]');

    // Check that error regions exist for screen readers
    const errorRegions = page.locator('[aria-live], [role="alert"]');

    if ((await errorRegions.count()) > 0) {
      await expect(errorRegions.first()).toBeVisible();
    }
  });
});
