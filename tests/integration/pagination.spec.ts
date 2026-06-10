import { expect, test } from '@playwright/test';

test.describe('Pagination integration (pre-implementation failing tests)', () => {
  test('navigates between paginated article pages using next button', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');

    await page.waitForLoadState('networkidle');

    const nextButton = page.getByRole('link', { name: /next/i });
    await expect(nextButton).toBeVisible();

    await nextButton.click();

    await page.waitForURL(/\/articles\/page\/2/);

    const currentPageLink = page.getByRole('link', { name: /page 2/i });
    await expect(currentPageLink).toHaveAttribute('aria-current', 'page');
  });

  test('updates content and URL when a numbered page is selected', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');
    await page.waitForLoadState('networkidle');

    const pageLink = page.getByRole('link', { name: /page 3/i });
    await pageLink.click();

    await page.waitForURL(/\/articles\/page\/3/);

    const headings = page.locator('article h2');
    await expect(headings.first()).toBeVisible();
  });
});
