import { test, expect, type Page } from '@playwright/test';

const waitForAppReady = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body');
};

test.describe('Primary smoke journeys', () => {
  test('home hero CTA navigates to articles grid', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    await page.getByRole('link', { name: /articles/i }).first().click();
    await page.waitForURL('**/articles/**', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 1, name: /articles & insights/i })).toBeVisible();
  });

  test('article detail renders from articles listing', async ({ page }) => {
    await page.goto('/articles');
    await waitForAppReady(page);

    const firstReadMore = page.getByRole('link', { name: /read more/i }).first();
    await expect(firstReadMore).toBeVisible();

    await firstReadMore.click();
    await page.waitForURL(/\/articles\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?$/, { waitUntil: 'networkidle' });

    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('nav').getByText('Back to Articles')).toBeVisible();
  });

  test('contact CTA focuses the contact section on the homepage', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    await page.getByRole('link', { name: /contact us/i }).click();

    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#Contact');
    await expect(page.locator('#Contact')).toBeInViewport();
    await expect(page.getByRole('heading', { level: 2, name: /contact us/i })).toBeVisible();
  });

  test('captures accessibility snapshot of homepage landmarks', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const snapshot = await page.accessibility.snapshot();
    expect(snapshot).toBeTruthy();
    const hasMainLandmark = snapshot?.children?.some((child) => child.role === 'main');
    expect(hasMainLandmark).toBe(true);
  });
});
