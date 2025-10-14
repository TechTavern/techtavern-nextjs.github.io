# Playwright Accessibility Tests

This directory contains Playwright end-to-end tests with a focus on WCAG accessibility compliance.

## Prerequisites

- Node.js 20+
- At least **16 MDX articles** in `/content/articles/` for pagination tests to run
- Dev server running on `localhost:3000` (handled automatically by Playwright)

## Running Tests

### Locally

```bash
# Verify test data exists
npm run verify-test-data

# Run all accessibility tests
npm run test:a11y

# Run all Playwright tests
npm run test:playwright

# Run smoke tests only
npm run test:smoke
```

### In CI/CD

Tests run automatically in GitHub Actions during the `quality-gates` job. The workflow:

1. Installs dependencies
2. Installs Playwright browsers
3. Verifies test data (article count)
4. Starts Next.js dev server
5. Runs accessibility tests
6. Uploads test reports as artifacts

## Test Requirements

### Pagination Tests

The pagination accessibility test requires:

- **Minimum 16 articles** in `content/articles/` directory
- Default pagination setting: 15 items per page (configured in `src/lib/site.ts`)
- With 16 articles, pagination renders with 2 pages

If fewer than 16 articles exist, the pagination test will automatically skip with a clear message.

### Test Data Verification

Before running tests, you can verify test data:

```bash
npm run verify-test-data
```

This script checks:
- Article count in `content/articles/`
- Pagination configuration
- Whether pagination will render
- Lists sample articles

## Configuration

### Playwright Config (`playwright.config.js`)

Key settings:

- **Base URL**: `http://localhost:3000`
- **Retries**: 2 retries in CI, 0 locally
- **Timeout**: 60 seconds per test
- **Navigation Timeout**: 30 seconds
- **Expect Timeout**: 10 seconds
- **Web Server**: Automatically starts `npm run dev` before tests

### CI-Specific Settings

In GitHub Actions:
- Uses single worker (sequential tests)
- Enables strict mode (`forbidOnly`)
- Uploads HTML reports as artifacts
- Installs only Chromium browser for faster setup

## Test Structure

### `accessibility.spec.js`

Tests WCAG 2.1 AA compliance across:

- **Homepage**: General accessibility, keyboard navigation, focus states
- **Articles Page**: Pagination accessibility, article listings
- **Navigation**: Skip links, keyboard accessibility
- **Interactive Elements**: Touch targets, focus indicators
- **Images**: Alt text compliance
- **Color Contrast**: WCAG AA standards
- **Technology Components**: Logo containers, semantic structure

### Common Issues

**Pagination not visible:**
- Check article count: `find content/articles -name "*.mdx" | wc -l`
- Ensure at least 16 articles exist
- Verify pagination settings in `src/lib/site.ts`

**Test timeouts:**
- Increase timeouts in `playwright.config.js`
- Check dev server is starting correctly
- Review network conditions (especially in CI)

**React hydration issues:**
- Tests wait for `networkidle` and `domcontentloaded`
- Additional wait for visible `article` elements ensures hydration

## Best Practices

### Writing New Tests

1. **Wait for hydration**: Use `page.waitForSelector()` for interactive elements
2. **Use semantic selectors**: Prefer `getByRole()`, `getByLabel()` over CSS selectors
3. **Add timeouts**: Specify explicit timeouts for slow operations
4. **Test data validation**: Check if required data exists before assertions
5. **Graceful degradation**: Skip tests if prerequisites aren't met

### Example Pattern

```javascript
test('Component accessibility', async ({ page }) => {
  await page.goto('/page');

  // Wait for full load and hydration
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="component"]', {
    state: 'visible',
    timeout: 10000
  });

  // Verify prerequisites
  const elements = await page.locator('.item').count();
  if (elements < 5) {
    test.skip(true, `Insufficient data: ${elements} items`);
    return;
  }

  // Run accessibility scan
  const results = await new AxeBuilder({ page })
    .include('[data-testid="component"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Debugging

### View Test Reports

After tests run, view the HTML report:

```bash
npx playwright show-report
```

### Run in Debug Mode

```bash
npx playwright test --debug
```

### CI Artifacts

When tests run in GitHub Actions:
- HTML reports: `playwright-report-{sha}`
- Test traces: Available on retry failures
- View in Actions > Workflow Run > Artifacts

## Accessibility Standards

Tests validate compliance with:

- **WCAG 2.1 Level A**: Basic accessibility
- **WCAG 2.1 Level AA**: Enhanced accessibility (required for most compliance)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Focus Management**: Visible focus indicators required
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **ARIA Attributes**: Proper use of roles, labels, and states

## Continuous Improvement

When adding new components:

1. Add corresponding accessibility tests
2. Verify WCAG compliance using axe-core
3. Test keyboard navigation
4. Check touch target sizes
5. Validate ARIA attributes
6. Test with screen readers (manual testing)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
