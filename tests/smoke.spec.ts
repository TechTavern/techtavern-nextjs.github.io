import { test, expect, type Page } from '@playwright/test';

const waitForAppReady = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body');
};

test.describe('Primary smoke journeys', () => {
  test.describe.configure({ mode: 'serial' });

  test('home hero CTA navigates to articles grid', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    await page.getByRole('link', { name: /articles/i }).first().click();
    await expect(page).toHaveURL(/\/articles\/?$/);
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { level: 1, name: /articles & insights/i })).toBeVisible();
  });

  test('article detail renders from articles listing', async ({ page }) => {
    await page.goto('/articles');
    await waitForAppReady(page);

    const firstReadMore = page.getByRole('link', { name: /read more/i }).first();
    await expect(firstReadMore).toBeVisible();

    const articleHref = await firstReadMore.getAttribute('href');
    expect(articleHref).toMatch(/^\/articles\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?$/);
    await page.goto(articleHref!, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /back to articles/i })).toBeVisible();
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

    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
