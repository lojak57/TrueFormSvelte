import { expect, test } from "@playwright/test";

test("vertical CRUD flow", async ({ page }) => {
  // Create vertical
  await page.goto("/verticals");
  await page.click('button:has-text("New Vertical")');
  await page.fill('input[name="name"]', "Test Vertical");
  await page.click('button:has-text("Save")');

  // Verify creation
  await expect(page.locator("text=Test Vertical")).toBeVisible();

  // Edit vertical
  await page.click('button:has-text("Edit")');
  await page.fill('input[name="name"]', "Updated Vertical");
  await page.click('button:has-text("Save")');

  // Verify update
  await expect(page.locator("text=Updated Vertical")).toBeVisible();

  // Delete vertical
  await page.click('button:has-text("Delete")');
  await page.click('button:has-text("Confirm")');

  // Verify deletion
  await expect(page.locator("text=Updated Vertical")).not.toBeVisible();
});

test("contact with vertical assignment", async ({ page }) => {
  // Create vertical
  await page.goto("/verticals");
  await page.click('button:has-text("New Vertical")');
  await page.fill('input[name="name"]', "Test Vertical");
  await page.click('button:has-text("Save")');

  // Create contact with vertical
  await page.goto("/contacts");
  await page.click('button:has-text("New Contact")');
  await page.fill('input[name="first_name"]', "John");
  await page.fill('input[name="last_name"]', "Doe");
  await page.selectOption('select[name="vertical"]', "Test Vertical");
  await page.click('button:has-text("Save")');

  // Verify contact creation
  await expect(page.locator("text=John Doe")).toBeVisible();

  // Filter by vertical
  await page.selectOption('select[name="vertical_filter"]', "Test Vertical");
  await expect(page.locator("text=John Doe")).toBeVisible();

  // Clear filter
  await page.selectOption('select[name="vertical_filter"]', "");
  await expect(page.locator("text=John Doe")).toBeVisible();
});

test("inline vertical creation", async ({ page }) => {
  // Go to contact form
  await page.goto("/contacts/new");

  // Click "New Vertical" button
  await page.click('button:has-text("New Vertical")');

  // Fill and create vertical
  await page.fill('input[placeholder="Enter vertical name"]', "New Vertical");
  await page.click('button:has-text("Create")');

  // Verify vertical is selected
  await expect(page.locator('select[name="vertical"]')).toHaveValue(
    /^[0-9a-f-]+$/
  );

  // Fill contact details
  await page.fill('input[name="first_name"]', "Jane");
  await page.fill('input[name="last_name"]', "Smith");
  await page.click('button:has-text("Save Contact")');

  // Verify contact creation
  await expect(page.locator("text=Jane Smith")).toBeVisible();
});
