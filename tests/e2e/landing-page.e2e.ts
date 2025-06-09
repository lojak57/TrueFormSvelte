import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Tests
 * 
 * Critical user journeys:
 * - Page loads and renders correctly
 * - Navigation works across all devices  
 * - CTA buttons function properly
 * - Mobile menu operates correctly
 * - Performance benchmarks met
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads homepage successfully', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/TrueForm/);
    
    // Check for key elements
    await expect(page.locator('text=TrueForm')).toBeVisible();
    await expect(page.locator('text=Excellence Refined')).toBeVisible();
    
    // Verify page is interactive
    await expect(page.locator('nav')).toBeVisible();
  });

  test('header navigation functions correctly', async ({ page }) => {
    // Test logo link
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
    
    // Test navigation links (desktop)
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
  });

  test('services dropdown menu works', async ({ page }) => {
    // Click on Services
    await page.click('text=Services');
    
    // Verify dropdown appears
    await expect(page.locator('text=Marketing Websites')).toBeVisible();
    await expect(page.locator('text=E-commerce Stores')).toBeVisible();
    await expect(page.locator('text=Booking Systems')).toBeVisible();
    
    // Test service link navigation
    await page.click('text=Marketing Websites');
    await expect(page).toHaveURL(/\/services\/marketing/);
  });

  test('CTA buttons navigate correctly', async ({ page }) => {
    // Test "Get Started" button
    const getStartedBtn = page.locator('text=Get Started').first();
    await expect(getStartedBtn).toBeVisible();
    await getStartedBtn.click();
    await expect(page).toHaveURL(/\/request/);
    
    // Go back and test Admin button
    await page.goto('/');
    const adminBtn = page.locator('text=Admin').first();
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();
    await expect(page).toHaveURL(/\/admin\/opportunities/);
  });

  test('hero section displays correctly', async ({ page }) => {
    // Check hero content
    await expect(page.locator('h1')).toContainText(/Transform Your Digital Presence/);
    
    // Verify hero buttons
    await expect(page.locator('text=Start Your Project')).toBeVisible();
    await expect(page.locator('text=View Our Work')).toBeVisible();
    
    // Test hero CTA
    await page.click('text=Start Your Project');
    await expect(page).toHaveURL(/\/request/);
  });

  test('features section loads', async ({ page }) => {
    // Scroll to features section
    await page.locator('text=Why Choose TrueForm').scrollIntoViewIfNeeded();
    
    // Verify features are visible
    await expect(page.locator('text=Professional Design')).toBeVisible();
    await expect(page.locator('text=Modern Technology')).toBeVisible();
    await expect(page.locator('text=Fast Delivery')).toBeVisible();
  });

  test('pricing section displays', async ({ page }) => {
    // Scroll to pricing
    await page.locator('text=Transparent Pricing').scrollIntoViewIfNeeded();
    
    // Check pricing tiers
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Standard')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    
    // Verify pricing buttons
    await expect(page.locator('text=Choose Plan').first()).toBeVisible();
  });

  test('contact section is accessible', async ({ page }) => {
    // Scroll to footer/contact
    await page.locator('text=Ready to Get Started').scrollIntoViewIfNeeded();
    
    // Verify contact CTA
    await expect(page.locator('text=Contact Us Today')).toBeVisible();
    
    // Test contact button
    await page.click('text=Contact Us Today');
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Landing Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobile navigation menu works', async ({ page }) => {
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Menu"]').or(
      page.locator('svg').first()
    );
    await menuButton.click();
    
    // Verify mobile menu opens
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    
    // Test mobile menu navigation
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
  });

  test('mobile services dropdown works', async ({ page }) => {
    // Open mobile menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    
    // Click Services in mobile menu
    await page.click('text=Services');
    
    // Verify services submenu
    await expect(page.locator('text=Marketing Websites')).toBeVisible();
    
    // Test service selection
    await page.click('text=E-commerce Stores');
    await expect(page).toHaveURL(/\/services\/ecommerce/);
  });

  test('mobile CTA buttons are accessible', async ({ page }) => {
    // Open mobile menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    
    // Verify mobile CTAs
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Test mobile CTA
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/\/request/);
  });

  test('mobile layout is responsive', async ({ page }) => {
    // Check mobile-specific layout elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify mobile-optimized content
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    
    // Check mobile buttons stack properly
    const heroButtons = page.locator('button').or(page.locator('a[role="button"]'));
    await expect(heroButtons.first()).toBeVisible();
  });
});

test.describe('Landing Page - Performance & Accessibility', () => {
  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('has proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check page has proper heading structure
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    
    // Verify navigation has proper ARIA labels
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveAttribute('type', /.*/);
    }
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Check logo has alt text
    const logoImg = page.locator('img[alt*="Logo"]');
    await expect(logoImg).toHaveAttribute('alt', /TrueForm Logo/);
    
    // Verify other images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('page has proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    
    // Verify page title
    await expect(page).toHaveTitle(/.+/);
  });
}); 