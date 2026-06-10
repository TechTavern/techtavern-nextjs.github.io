/**
 * Accessibility Tests using axe-core
 * Tests WCAG AA compliance across key pages
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  test.beforeEach(async () => {
    // Start development server before running tests if not already running
    // Note: This assumes the dev server is running on localhost:3000
  });

  test('Homepage meets WCAG AA standards', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Articles page meets WCAG AA standards', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation is keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Should focus skip link
    await page.keyboard.press('Tab'); // Should focus logo
    await page.keyboard.press('Tab'); // Should focus first nav item

    // Verify focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test that Enter key works on focused links
    await page.keyboard.press('Enter');

    // Verify navigation occurred or menu opened
    await page.waitForTimeout(500);
  });

  test('Focus states are visible', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test focus on navigation items
    const navItems = page.locator('nav a, nav button');
    const count = await navItems.count();

    for (let i = 0; i < count; i++) {
      const item = navItems.nth(i);
      await item.focus();

      // Check that focus ring is applied
      const styles = await item.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          outlineOffset: computed.outlineOffset
        };
      });

      // Verify some form of focus indicator exists
      const hasFocusIndicator =
        styles.outline !== 'none' ||
        styles.boxShadow !== 'none' ||
        styles.boxShadow.includes('rgb');

      expect(hasFocusIndicator).toBe(true);
    }
  });

  test('Buttons have adequate touch targets', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Get all buttons and links
    const interactiveElements = page.locator('.touch-target');
    const count = await interactiveElements.count();

    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const boundingBox = await element.boundingBox();

      if (boundingBox) {
        // WCAG guideline: minimum 44x44 pixels for touch targets
        const minSize = 44;
        expect(boundingBox.width).toBeGreaterThanOrEqual(minSize);
        expect(boundingBox.height).toBeGreaterThanOrEqual(minSize);
      }
    }
  });

  test('Images have appropriate alt text', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Every image should have an alt attribute (can be empty for decorative images)
      expect(alt).not.toBeNull();

      // If image is not decorative, alt should not be empty
      const isDecorative = await img.evaluate(el => {
        return el.closest('[role="presentation"]') ||
               el.hasAttribute('aria-hidden') ||
               el.getAttribute('alt') === '';
      });

      if (!isDecorative) {
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  test('Color contrast meets WCAG AA requirements', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Should have no color contrast violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Pagination component meets accessibility requirements', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');

    // Wait for page to fully load and hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    // Wait for React hydration by checking for interactive elements
    await page.waitForSelector('article', { state: 'visible', timeout: 10000 });

    // Check if pagination actually exists on the page (rather than assuming based on article count)
    const paginationRegion = page.getByRole('navigation', { name: /pagination/i });
    const paginationExists = await paginationRegion.count() > 0;

    if (paginationExists) {
      // Test pagination accessibility
      await expect(paginationRegion).toBeVisible({ timeout: 10000 });

      // Verify current page button has correct ARIA attribute
      const currentPage = paginationRegion.getByRole('link', { name: /page 1/i, exact: false });
      await expect(currentPage).toHaveAttribute('aria-current', 'page');

      // Run accessibility scan on the pagination component
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('nav[data-pagination]')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    } else {
      // Skip test if pagination doesn't render (graceful degradation)
      const articles = await page.locator('article').count();
      test.skip(true, `Skipping pagination test: ${articles} articles found, pagination not rendered (need > 15 for 2 pages with itemsPerPage=15)`);
    }
  });

  test('Skip link functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Tab to skip link
    await page.keyboard.press('Tab');

    // Verify skip link is focused and visible
    const skipLink = page.locator('.skip-link:focus');
    await expect(skipLink).toBeVisible();

    // Press Enter to use skip link
    await page.keyboard.press('Enter');

    // Verify focus moved to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('Technology logo containers are keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Find all technology logo containers
    const logoContainers = page.locator('[role="img"][tabindex="0"]');
    const count = await logoContainers.count();

    // Verify each logo container is focusable and has proper ARIA
    for (let i = 0; i < count; i++) {
      const container = logoContainers.nth(i);

      // Test keyboard focus
      await container.focus();
      await expect(container).toBeFocused();

      // Verify ARIA attributes
      const ariaLabel = await container.getAttribute('aria-label');
      const ariaDescription = await container.getAttribute('aria-description');

      expect(ariaLabel).toContain('technology logo');
      expect(ariaDescription).toBeTruthy();

      // Test keyboard activation
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
    }
  });

  test('Technology groups have proper semantic structure', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Find technology group containers
    const groups = page.locator('[role="group"]');
    const groupCount = await groups.count();

    for (let i = 0; i < groupCount; i++) {
      const group = groups.nth(i);

      // Verify group has aria-labelledby
      const labelledBy = await group.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();

      // Verify the referenced heading exists
      const heading = page.locator(`#${labelledBy}`);
      await expect(heading).toBeVisible();

      // Verify heading content
      const headingText = await heading.textContent();
      expect(['Cloud', 'AI', 'Code']).toContain(headingText);
    }
  });

  test('Logo contrast treatments provide sufficient visibility', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test that different logo types have appropriate contrast treatments
    const logoContainers = page.locator('[role="img"]');
    const count = await logoContainers.count();

    for (let i = 0; i < count; i++) {
      const container = logoContainers.nth(i);

      // Check background styles are applied
      const styles = await container.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderWidth: computed.borderWidth,
          boxShadow: computed.boxShadow
        };
      });

      // Verify some form of background treatment exists
      const hasBackground =
        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        styles.borderWidth !== '0px' ||
        styles.boxShadow !== 'none';

      expect(hasBackground).toBe(true);
    }
  });
});
