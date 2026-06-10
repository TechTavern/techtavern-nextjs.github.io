# Code Review Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 19 findings from the 2026-06-10 full-application code review: 5 user-visible bugs, 4 security hardenings, 4 efficiency wins, dead-code removal (~500 lines), and hygiene fixes.

**Architecture:** This is a Next.js 15 static-export (`output: "export"`) blog deployed to GitHub Pages. There is no server runtime — all pages render at build time. Content lives in `content/articles/*.mdx`, parsed by `src/lib/posts.ts` (gray-matter + Zod). Tests are Jest (jsdom) + Playwright. Every task is an independent commit; tasks are ordered so earlier tasks never depend on later ones.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind v4, Zod v4, Jest 30 + React Testing Library, Playwright.

**Finding → Task map:**

| Finding | Task |
|---|---|
| #17 tsconfig strict flags | 1 |
| #3 timezone date bug, #15a formatDate duplication | 2 |
| #5 RSS XML escaping | 3 |
| #1 dead head.tsx / missing JSON-LD | 4 |
| #2 /scott redirect no-op | 5 |
| #4 skip link broken on interior pages | 6 |
| #6 GA ID validation | 7 |
| #8 canonicalUrl scheme, #7 (schema half) booking link https | 8 |
| #7 HubSpot embed escaping | 9 |
| #9 CSP accepted-risk documentation | 10 |
| #10 getAllPosts memoization + double file read | 11 |
| #11 cpus:1 build serialization | 12 |
| #16 /articles/page/1/ duplicate, #10 (sitemap half) double getAllPosts | 13 |
| #12 client-JS pagination + Services 'use client', #15b mergeConfig dup | 14 |
| #13 featured image CLS | 15 |
| #14 dead variants/UI components, #15c PaginationConstants + orphan scripts + new-article comment | 16 |
| #18 server-only guards | 17 |
| #19 `as any` in booking tests | 18 |
| #15d prose class duplication | 19 |
| Final verification | 20 |

**Important facts verified during planning (do not re-litigate):**
- `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Typography.tsx` have **zero** imports outside their own test files. `src/lib/variants.ts` is consumed only by those four components. All five files (plus tests) are deletable.
- `accessibility-test.js` at repo root **IS** referenced (`package.json` script `test:a11y-static`) — keep it. Only `contrast-audit.js` is orphaned.
- `validatePageParameter`, `createPaginationState`, `getPaginationErrorType` (pagination.ts) and `getPostsForPage` (posts.ts) are used only by their own tests.
- The skip link lives inside `Navigation.tsx`, which returns `null` on every page except home — interior pages have no skip link at all. `id="main-content"` exists only on `src/app/page.tsx`.
- The article page renders a `<main>` *inside* `src/app/articles/layout.tsx`'s `<main>` — invalid nested landmarks.
- Playwright specs (`tests/integration/pagination.spec.ts`, `tests/accessibility.spec.js:171`) currently query pagination controls by `role=button`; Task 14 changes them to `role=link`.
- `server-only` package is NOT yet in package.json.
- Date formatting runs at **build time** (server components) — the timezone bug manifests when the build machine is not UTC (e.g. local builds in US timezones), not per-visitor.

---

### Task 1: Add missing tsconfig strict flags (#17)

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Add the flags**

In `tsconfig.json`, after the line `"strict": true,` add:

```json
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: PASS (exit 0). If `noImplicitReturns` errors surface, add an explicit `return undefined;` (or the correct value) to each flagged code path — do not weaken the flag.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: enable noImplicitReturns and noFallthroughCasesInSwitch"
```

---

### Task 2: Timezone-safe shared date formatter (#3, #15a)

The bug: `new Date("2024-06-10")` parses as UTC midnight; `.toLocaleDateString()` then renders **June 9** on any machine west of UTC. Two identical copies of this buggy function exist.

**Files:**
- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx:64-71` (delete local `formatDate`)
- Modify: `src/app/articles/ArticlesPageSections.tsx:25-32` (delete local `formatDate`)

- [ ] **Step 1: Write the failing test**

Create `src/lib/format.test.ts`:

```ts
import { formatDisplayDate } from './format';

describe('formatDisplayDate', () => {
  it('formats yyyy-mm-dd as a long US date', () => {
    expect(formatDisplayDate('2024-06-10')).toBe('June 10, 2024');
  });

  it('does not shift the day in negative-UTC-offset timezones', () => {
    // Naive new Date('2024-01-01') is UTC midnight → "December 31, 2023" in US zones.
    expect(formatDisplayDate('2024-01-01')).toBe('January 1, 2024');
  });
});
```

- [ ] **Step 2: Run it under a US timezone to verify it fails**

Run: `TZ=America/New_York npx jest src/lib/format.test.ts`
Expected: FAIL with "Cannot find module './format'"

- [ ] **Step 3: Implement**

Create `src/lib/format.ts`:

```ts
/**
 * Format a yyyy-mm-dd date string for display.
 *
 * Parses the date components explicitly so the result is the calendar date the
 * author wrote, regardless of the build machine's timezone. (A bare
 * `new Date('yyyy-mm-dd')` is interpreted as UTC midnight, which renders as
 * the previous day on any machine west of UTC.)
 */
export function formatDisplayDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TZ=America/New_York npx jest src/lib/format.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Replace both duplicated copies**

In `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`:
- Delete lines 64–71 (the local `formatDate` function).
- Add to the imports at the top: `import { formatDisplayDate } from "@/lib/format";`
- Change `<time dateTime={post.date}>{formatDate(post.date)}</time>` to `<time dateTime={post.date}>{formatDisplayDate(post.date)}</time>`

In `src/app/articles/ArticlesPageSections.tsx`:
- Delete lines 25–32 (the local `formatDate` function).
- Add to the imports: `import { formatDisplayDate } from '@/lib/format';`
- Change `<time dateTime={post.date}>{formatDate(post.date)}</time>` to `<time dateTime={post.date}>{formatDisplayDate(post.date)}</time>`

- [ ] **Step 6: Run the affected test suites**

Run: `npx jest src/lib/format.test.ts "src/app/articles"`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/format.ts src/lib/format.test.ts "src/app/articles/[year]/[month]/[day]/[slug]/page.tsx" src/app/articles/ArticlesPageSections.tsx
git commit -m "fix: timezone-safe date formatting, dedupe formatDate"
```

---

### Task 3: Escape RSS link/guid (#5)

`src/app/rss.xml/route.ts:23` interpolates `link`/`guid` raw while escaping everything else. A slug containing `&` produces invalid XML.

**Files:**
- Create: `src/app/rss.xml/route.escape.test.ts`
- Modify: `src/app/rss.xml/route.ts:23`

- [ ] **Step 1: Write the failing test**

Create `src/app/rss.xml/route.escape.test.ts`:

```ts
jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn().mockResolvedValue([
    {
      title: 'Q&A Article',
      excerpt: 'An excerpt',
      date: '2024-06-10',
      url: '/articles/2024/06/10/q&a-testing/',
    },
  ]),
}));

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: () => 'https://example.com',
}));

import { GET } from './route';

describe('RSS XML escaping', () => {
  it('escapes XML special characters in link and guid', async () => {
    const res = await GET();
    const xml = await res.text();
    expect(xml).toContain(
      '<link>https://example.com/articles/2024/06/10/q&amp;a-testing/</link>'
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">https://example.com/articles/2024/06/10/q&amp;a-testing/</guid>'
    );
    expect(xml).not.toContain('q&a-testing/</link>');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest src/app/rss.xml/route.escape.test.ts`
Expected: FAIL — xml contains the raw `&` (the `not.toContain` assertion fails)

- [ ] **Step 3: Fix the route**

In `src/app/rss.xml/route.ts`, change line 23 from:

```ts
      const link = `${base}${p.url}`
```

to:

```ts
      const link = escapeXml(`${base}${p.url}`)
```

(`guid` is assigned from `link` on line 26 and inherits the fix.)

- [ ] **Step 4: Run all RSS tests**

Run: `npx jest src/app/rss.xml`
Expected: PASS (new test plus the existing `route.test.ts`)

- [ ] **Step 5: Commit**

```bash
git add src/app/rss.xml/route.ts src/app/rss.xml/route.escape.test.ts
git commit -m "fix: escape XML special characters in RSS link and guid"
```

---

### Task 4: Render article JSON-LD; delete dead head.tsx (#1)

`head.tsx` is a Pages-Router-era convention the stable App Router ignores — article pages currently ship **no** structured data. Render the JSON-LD `<script>` directly in the page server component.

**Files:**
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.test.tsx`
- Delete: `src/app/articles/[year]/[month]/[day]/[slug]/head.tsx`
- Modify: `jest.config.js` (remove the now-pointless `'!src/app/**/head.tsx'` coverage exclusion)

- [ ] **Step 1: Write the failing test**

Open `src/app/articles/[year]/[month]/[day]/[slug]/page.test.tsx` and find the existing test that renders the page (it asserts `getByRole('heading', { level: 1, name: 'Fixture Article With Excerpt' })` around line 109). Copy the exact `params` object and render call that test uses, then add this test to the same `describe` block, substituting that params object for `FIXTURE_PARAMS`:

```tsx
it('renders Article JSON-LD structured data', async () => {
  const ui = await ArticlePage({ params: Promise.resolve(FIXTURE_PARAMS) });
  render(ui);

  const script = document.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();

  const json = JSON.parse(script?.textContent ?? '{}');
  expect(json['@type']).toBe('Article');
  expect(json.headline).toBe('Fixture Article With Excerpt');
  expect(json.datePublished).toBeTruthy();
});
```

(If the file renders via a different helper, mirror it exactly — the assertion body stays the same.)

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest "src/app/articles/\[year\]"`
Expected: FAIL — `script` is null because nothing renders JSON-LD

- [ ] **Step 3: Render JSON-LD in the page component**

In `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`:

Add to the imports:

```tsx
import { buildArticleJsonLd } from "@/lib/seo";
```

(`siteOrg` and `getBaseUrl` are already imported.)

In `ArticlePage`, after the `if (!post) notFound();` line, add:

```tsx
  const jsonLd = buildArticleJsonLd({
    post,
    baseUrl: getBaseUrl(),
    orgName: siteOrg.name,
    orgLogoPath: siteOrg.logoPath,
  });
```

And as the first child inside the returned fragment (before the breadcrumb `<nav>`):

```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest "src/app/articles/\[year\]"`
Expected: PASS

- [ ] **Step 5: Delete the dead file and its coverage exclusion**

```bash
git rm "src/app/articles/[year]/[month]/[day]/[slug]/head.tsx"
```

In `jest.config.js`, delete the line `'!src/app/**/head.tsx',` from `collectCoverageFrom`.

- [ ] **Step 6: Full jest run**

Run: `npm run test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: render article JSON-LD in page component, remove dead head.tsx"
```

---

### Task 5: Working /scott redirect for static export (#2)

`redirects()` in `next.config.mjs` is silently ignored under `output: 'export'` — `/scott` 404s in production. Replace with a static page that client-redirects, with a visible fallback link.

**Files:**
- Create: `src/app/scott/page.tsx`
- Create: `src/app/scott/RedirectClient.tsx`
- Create: `src/app/scott/page.test.tsx`
- Modify: `next.config.mjs:40-48` (delete `redirects()`)

- [ ] **Step 1: Write the failing test**

Create `src/app/scott/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import ScottRedirectPage from './page';

describe('/scott redirect page', () => {
  it('client-redirects to the consulting profile', () => {
    render(<ScottRedirectPage />);
    expect(mockReplace).toHaveBeenCalledWith('/consulting/scott-turnbull/');
  });

  it('renders a fallback link for no-JS visitors and crawlers', () => {
    render(<ScottRedirectPage />);
    const link = screen.getByRole('link', { name: /consulting profile/i });
    expect(link).toHaveAttribute('href', '/consulting/scott-turnbull/');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest src/app/scott`
Expected: FAIL with "Cannot find module './page'"

- [ ] **Step 3: Implement**

Create `src/app/scott/RedirectClient.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectClient({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return null;
}
```

Create `src/app/scott/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import RedirectClient from './RedirectClient';

// Server-side redirects() in next.config are ignored under output: "export",
// so this static page performs the /scott vanity redirect client-side.
const DESTINATION = '/consulting/scott-turnbull/';

export const metadata: Metadata = {
  title: 'Redirecting…',
  robots: { index: false, follow: false },
};

export default function ScottRedirectPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light">
      <RedirectClient to={DESTINATION} />
      <p className="text-dark/80">
        Redirecting to{' '}
        <Link href={DESTINATION} className="text-accent underline">
          Scott Turnbull&rsquo;s consulting profile
        </Link>
        &hellip;
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/app/scott`
Expected: PASS (2 tests)

- [ ] **Step 5: Delete the no-op redirects() from next.config.mjs**

Delete lines 40–48 of `next.config.mjs`:

```js
    async redirects() {
        return [
            {
                source: "/scott",
                destination: "/consulting/scott-turnbull",
                permanent: true,
            },
        ];
    },
```

- [ ] **Step 6: Commit**

```bash
git add src/app/scott next.config.mjs
git commit -m "fix: replace no-op config redirect with static /scott redirect page"
```

---

### Task 6: Skip link on interior pages + main-content targets (#4)

The skip link only exists inside `Navigation`, which renders only on the home page. Interior pages (articles, consulting) have neither a skip link nor an `id="main-content"` target, and the article page nests a `<main>` inside the layout's `<main>`.

**Files:**
- Modify: `src/components/ui/Header.tsx` (interior variant)
- Modify: `src/components/ui/Header.test.tsx`
- Modify: `src/app/articles/layout.tsx`
- Modify: `src/app/consulting/layout.tsx`
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx` (un-nest `<main>`)

- [ ] **Step 1: Write the failing test**

Add to `src/components/ui/Header.test.tsx` (inside its existing `describe`, matching the file's existing import style):

```tsx
it('renders a skip link on interior pages', () => {
  render(<Header variant="interior" />);
  const link = screen.getByRole('link', { name: /skip to main content/i });
  expect(link).toHaveAttribute('href', '#main-content');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest src/components/ui/Header.test.tsx`
Expected: FAIL — no skip link in the interior variant

- [ ] **Step 3: Add the skip link to the interior header**

In `src/components/ui/Header.tsx`, in the interior return branch, add as the first child of the `<header>` element (before the `<nav>`):

```tsx
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>
```

- [ ] **Step 4: Add the targets in the two interior layouts**

In `src/app/articles/layout.tsx`, change:

```tsx
      <main className="min-h-screen bg-light">
```

to:

```tsx
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-light">
```

In `src/app/consulting/layout.tsx`, change:

```tsx
      <main className="min-h-screen bg-light">{children}</main>
```

to:

```tsx
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-light">{children}</main>
```

- [ ] **Step 5: Un-nest the article page's main**

In `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`, the Article Content block renders a `<main>` *inside* the articles layout's `<main>` (invalid duplicate landmark). Change:

```tsx
      <main className="py-12">
```

to:

```tsx
      <div className="py-12">
```

and its matching closing tag from `</main>` to `</div>` (the closing tag directly above the `{/* Article Footer */}` comment).

- [ ] **Step 6: Run affected tests**

Run: `npx jest src/components/ui/Header.test.tsx "src/app/articles"`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/Header.tsx src/components/ui/Header.test.tsx src/app/articles/layout.tsx src/app/consulting/layout.tsx "src/app/articles/[year]/[month]/[day]/[slug]/page.tsx"
git commit -m "fix: add skip link and main-content target to interior pages"
```

---

### Task 7: Validate NEXT_PUBLIC_GA_ID format (#6)

The GA measurement ID is interpolated into an inline `<script>` in `GoogleAnalyticsScript.tsx`. It is currently validated only as `z.string().optional()` — a malicious env value is build-time XSS. Lock it to the GA4 format (same standard the HubSpot portal ID already gets).

**Files:**
- Modify: `src/lib/env.ts:35-44`
- Modify: `src/lib/env.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/env.test.ts` (inside the existing `describe`; the `beforeEach` already deletes `NEXT_PUBLIC_GA_ID`):

```ts
it('rejects a malformed NEXT_PUBLIC_GA_ID', () => {
  process.env.NEXT_PUBLIC_GA_ID = "G-123'); alert(1); //";
  expect(() => parseEnv()).toThrow(/NEXT_PUBLIC_GA_ID/);
});

it('accepts a valid GA4 measurement ID', () => {
  process.env.NEXT_PUBLIC_GA_ID = 'G-ABC123XYZ0';
  expect(parseEnv().NEXT_PUBLIC_GA_ID).toBe('G-ABC123XYZ0');
});
```

- [ ] **Step 2: Run them to verify the reject case fails**

Run: `npx jest src/lib/env.test.ts`
Expected: FAIL — the malformed ID is currently accepted

- [ ] **Step 3: Tighten the schema**

In `src/lib/env.ts`, replace the `NEXT_PUBLIC_GA_ID` entry (lines 35–44) with:

```ts
  NEXT_PUBLIC_GA_ID: z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return undefined;
      }
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z
      .string()
      .regex(/^G-[A-Z0-9]+$/, {
        message:
          'NEXT_PUBLIC_GA_ID must be a GA4 measurement ID (e.g. "G-XXXXXXXXXX") — it is interpolated into an inline script',
      })
      .optional()
  ),
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/env.ts src/lib/env.test.ts
git commit -m "fix(security): validate GA measurement ID format before script interpolation"
```

---

### Task 8: Restrict canonicalUrl and booking link schemes (#8, #7-schema)

Zod v4's `.url()` accepts `javascript:` URIs (the WHATWG `URL` constructor parses them). `canonicalUrl` flows into `<link rel="canonical">`; `booking.link` flows into an HTML embed string.

**Files:**
- Modify: `src/lib/posts.ts:64` (FrontmatterSchema)
- Modify: `src/lib/posts.schema.test.ts`
- Modify: `src/lib/profiles.ts:54-60` (BookingSchema)

- [ ] **Step 1: Write the failing test**

Add to `src/lib/posts.schema.test.ts` (match the file's existing valid-frontmatter shape — it already uses `canonicalUrl: 'https://example.com/hello'` around line 11):

```ts
it('rejects non-http canonicalUrl schemes', () => {
  const result = FrontmatterSchema.safeParse({
    title: 'T',
    date: '2024-01-01',
    slug: 't',
    canonicalUrl: 'javascript:alert(1)',
  });
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest src/lib/posts.schema.test.ts`
Expected: FAIL — `javascript:alert(1)` passes `.url()` today

- [ ] **Step 3: Add the refinements**

In `src/lib/posts.ts`, change line 64 from:

```ts
  canonicalUrl: z.string().url().optional(),
```

to:

```ts
  canonicalUrl: z
    .string()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), {
      message: 'canonicalUrl must be an http(s) URL',
    })
    .optional(),
```

In `src/lib/profiles.ts`, change the `link` field of `BookingSchema` from:

```ts
  link: z.string().url(),
```

to:

```ts
  link: z
    .string()
    .url()
    .refine((value) => value.startsWith('https://'), {
      message: 'booking link must be an https:// URL',
    }),
```

- [ ] **Step 4: Run schema + profile-dependent tests**

Run: `npx jest src/lib/posts.schema.test.ts src/lib/posts.test.ts && npm run typecheck`
Expected: PASS (existing profile content uses https links, so nothing else breaks)

- [ ] **Step 5: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.schema.test.ts src/lib/profiles.ts
git commit -m "fix(security): restrict canonicalUrl and booking link to http(s) schemes"
```

---

### Task 9: Escape booking link in HubSpot embed string (#7)

`HubSpotBookingButton.tsx:38` interpolates `bookingLink` into a raw HTML attribute passed to HubSpot's `innerHTML`-style embed API. A `"` in the URL breaks the attribute boundary.

**Files:**
- Modify: `src/components/consulting/booking/HubSpotBookingButton.tsx:37-40`
- Modify: `src/components/consulting/booking/__tests__/HubSpotBookingButton.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/components/consulting/booking/__tests__/HubSpotBookingButton.test.tsx` (using the file's existing `(window as any)` pattern — Task 18 types these later):

```tsx
it('escapes quotes in the booking link before embedding', () => {
  const create = jest.fn();
  (window as any).hbspt = { meetings: { create } };

  const { getByRole } = renderWithProviders(
    <HubSpotBookingButton
      bookingLink={'https://meetings.hubspot.com/acme?x="onmouseover="alert(1)'}
      label="Connect"
      className="btn"
    />,
  );

  fireEvent.click(getByRole('button', { name: 'Connect' }));
  expect(create).toHaveBeenCalledWith(
    expect.objectContaining({
      embedCode: expect.not.stringContaining('"onmouseover'),
    }),
  );
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest HubSpotBookingButton`
Expected: FAIL — the raw quote currently passes through

- [ ] **Step 3: Escape the interpolation**

In `src/components/consulting/booking/HubSpotBookingButton.tsx`, replace lines 37–40:

```tsx
      hubspotMeetings.create({
        embedCode: `<div class="meetings-iframe-container" data-src="${bookingLink}"></div>`,
        target: `#${containerId}`,
      });
```

with:

```tsx
      // Percent-encode quotes so the URL cannot break out of the data-src
      // attribute in the HTML string HubSpot injects via innerHTML.
      const safeBookingSrc = bookingLink.replace(/"/g, '%22').replace(/'/g, '%27');
      hubspotMeetings.create({
        embedCode: `<div class="meetings-iframe-container" data-src="${safeBookingSrc}"></div>`,
        target: `#${containerId}`,
      });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest HubSpotBookingButton`
Expected: PASS (all tests, including the two existing ones)

- [ ] **Step 5: Commit**

```bash
git add src/components/consulting/booking/HubSpotBookingButton.tsx src/components/consulting/booking/__tests__/HubSpotBookingButton.test.tsx
git commit -m "fix(security): escape booking link before HubSpot embed interpolation"
```

---

### Task 10: Document CSP accepted risks (#9)

No behavior change — record the two deliberate limitations so future reviews don't re-flag them.

**Files:**
- Modify: `src/lib/csp.ts`

- [ ] **Step 1: Add the documentation comments**

In `src/lib/csp.ts`, add above the `buildContentSecurityPolicy` function:

```ts
// DELIVERY LIMITATION: this policy is injected via <meta http-equiv> in
// src/app/layout.tsx because GitHub Pages cannot set HTTP response headers.
// Per the CSP spec, frame-ancestors, sandbox, and report-uri are IGNORED in
// meta-delivered policies, so clickjacking protection is not achievable on
// this host — they are deliberately omitted rather than silently broken.
```

And directly above the `"'unsafe-inline'",` line inside `scriptSrc`:

```ts
    // ACCEPTED RISK: the GA bootstrap, JSON-LD blocks, and the Calendly/HubSpot
    // loaders all require inline scripts, and a static export cannot mint
    // nonces per-request. Removing this entry requires reworking every
    // third-party embed. Mitigation: all inline-interpolated values are
    // schema-validated in src/lib/env.ts.
```

- [ ] **Step 2: Verify nothing broke**

Run: `npx jest src/lib/csp.test.ts && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/csp.ts
git commit -m "docs: document meta-CSP delivery limits and unsafe-inline accepted risk"
```

---

### Task 11: Memoize getAllPosts and stop double-reading MDX (#10)

`getAllPosts()` re-globs, re-reads, and re-parses every article on every call — ~48+ full content-directory passes per build at 20 articles. The article page then reads the same file a second time for `compileMDX`. Cache both, **production-only** so dev hot-reload and Jest isolation are unaffected.

**Files:**
- Modify: `src/lib/posts.ts`
- Create: `src/lib/posts.cache.test.ts`
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx:78-79`
- Modify: `src/app/articles/page/[pageNumber]/page.tsx:44-51` (generateMetadata)

- [ ] **Step 1: Write the failing test**

Create `src/lib/posts.cache.test.ts`:

```ts
describe('getAllPosts caching', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = OLD_NODE_ENV;
    jest.resetModules();
  });

  it('returns the same promise across calls in production', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    jest.resetModules();
    const { getAllPosts } = await import('./posts');
    expect(getAllPosts()).toBe(getAllPosts());
  });

  it('re-reads content in non-production environments', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    jest.resetModules();
    const { getAllPosts } = await import('./posts');
    expect(getAllPosts()).not.toBe(getAllPosts());
  });
});
```

- [ ] **Step 2: Run it to verify the production case fails**

Run: `npx jest src/lib/posts.cache.test.ts`
Expected: FAIL — every call currently creates a new promise

- [ ] **Step 3: Implement the caches in posts.ts**

In `src/lib/posts.ts`:

(a) Below the `POSTS_DIR` constant, add:

```ts
// Build-time caches. Next.js invokes getAllPosts from generateStaticParams,
// generateMetadata, every page component, the sitemap, and the RSS route —
// without this cache the content directory is fully re-read and re-parsed
// dozens of times per build. Production-only so `next dev` always sees fresh
// content and Jest keeps per-test isolation.
const isProd = process.env.NODE_ENV === "production";
let postsCache: Promise<PostMeta[]> | null = null;
const sourceCache = new Map<string, string>();
```

(b) Rename the existing `export async function getAllPosts(...)` to `async function loadAllPosts(...)` (drop the `export`), and inside it, immediately after `const raw = await fs.readFile(filePath, "utf8");` add:

```ts
      if (isProd) {
        sourceCache.set(filePath, raw);
      }
```

(c) Add the new public functions below `loadAllPosts`:

```ts
export function getAllPosts(): Promise<PostMeta[]> {
  if (!isProd) {
    return loadAllPosts();
  }
  if (!postsCache) {
    postsCache = loadAllPosts();
  }
  return postsCache;
}

/**
 * Raw MDX source for a post. During a production build the source was already
 * read (and cached) by getAllPosts, so this avoids a second disk read per page.
 */
export async function getPostSource(filePath: string): Promise<string> {
  const cached = sourceCache.get(filePath);
  if (cached !== undefined) {
    return cached;
  }
  return fs.readFile(filePath, "utf8");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/posts.cache.test.ts src/lib/posts.test.ts`
Expected: PASS

- [ ] **Step 5: Use getPostSource in the article page**

In `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`:

Change the import on line 3 to include the new function:

```tsx
import { getAllPosts, getPostByParams, getPostSource } from "@/lib/posts";
```

Replace lines 78–79:

```tsx
  const fs = await import('node:fs/promises');
  const source = await fs.readFile(post.filePath, 'utf8');
```

with:

```tsx
  const source = await getPostSource(post.filePath);
```

- [ ] **Step 6: Stop loading full pages just to validate in generateMetadata**

In `src/app/articles/page/[pageNumber]/page.tsx`:

Change the posts import (line 5) to:

```tsx
import { generatePaginationParams, getPaginatedPosts, getTotalPages } from '@/lib/posts';
```

Replace the validation block in `generateMetadata` (lines 44–51):

```tsx
  try {
    await getPaginatedPosts(page);
  } catch (error) {
    if (error instanceof InvalidPageError) {
      return {};
    }
    throw error;
  }
```

with:

```tsx
  const totalPages = await getTotalPages();
  if (page > totalPages) {
    return {};
  }
```

(`InvalidPageError` is still used by `resolvePagination` below — keep its import.)

- [ ] **Step 7: Full verification**

Run: `npm run test && npm run typecheck`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.cache.test.ts "src/app/articles/[year]/[month]/[day]/[slug]/page.tsx" "src/app/articles/page/[pageNumber]/page.tsx"
git commit -m "perf: memoize post loading in production builds, eliminate double MDX reads"
```

---

### Task 12: Remove cpus:1 build serialization (#11)

`experimental.cpus: 1` + `workerThreads: false` forces single-threaded static generation. `output: 'export'` already guarantees full static generation — the comment's stated purpose is a no-op, and the setting costs up to N× build time on an N-core machine.

**Files:**
- Modify: `next.config.mjs:28-32`

- [ ] **Step 1: Delete the experimental block**

In `next.config.mjs`, delete:

```js
    // Ensure all pages are statically generated
    experimental: {
        workerThreads: false,
        cpus: 1,
    },
```

- [ ] **Step 2: Verify with a real production build**

Run: `npm run build`
Expected: build completes, `out/` directory produced, no new warnings about workers. If the build crashes with a worker-related error (the original reason for the setting, if any), restore the block with a comment documenting the actual crash and skip this task.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "perf: remove cpus:1 override to restore parallel static generation"
```

---

### Task 13: Stop generating duplicate /articles/page/1/ (#16, #10-sitemap)

`/articles/page/1/` duplicates `/articles/` (its canonical even says so) and is listed in the sitemap. Also: `sitemap.ts` calls `getAllPosts` twice (directly + via `generatePaginationParams`).

**Files:**
- Modify: `src/lib/posts.ts:170-181` (`generatePaginationParams`)
- Modify: `src/lib/posts.test.ts:57-62, 84-86`
- Modify: `src/app/articles/page/[pageNumber]/page.tsx` (`generateMetadata` page-1 branch, `resolvePagination`)
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/sitemap.test.ts` (expectations)

- [ ] **Step 1: Update the failing-first tests**

In `src/lib/posts.test.ts`, replace the test at lines 84–86:

```ts
    const params = await generatePaginationParams(10_000);
    expect(params[0]).toEqual({ pageNumber: '1' });
```

with:

```ts
    const params = await generatePaginationParams(10_000);
    // Page 1 is served canonically at /articles/ — never generated here.
    expect(params).toEqual([]);
```

And strengthen the test around line 57 (the `generatePaginationParams(10)` test) by adding after its existing assertions:

```ts
    expect(params.some((p) => p.pageNumber === '1')).toBe(false);
```

- [ ] **Step 2: Run to verify failures**

Run: `npx jest src/lib/posts.test.ts`
Expected: FAIL on both updated assertions

- [ ] **Step 3: Filter page 1 from generated params**

In `src/lib/posts.ts`, replace `generatePaginationParams` (lines 170–181):

```ts
export async function generatePaginationParams(
  itemsPerPage: number = paginationSettings.defaultItemsPerPage,
): Promise<Array<{ pageNumber: string }>> {
  const totalPages = await getTotalPages(itemsPerPage);
  // Page 1 is served canonically at /articles/ — generate only pages 2..N.
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    pageNumber: String(index + 2),
  }));
}
```

- [ ] **Step 4: Make the route reject page 1 explicitly**

In `src/app/articles/page/[pageNumber]/page.tsx`:

Replace the page-1 branch of `generateMetadata` (lines 33–42):

```tsx
  if (page === 1) {
    const canonical = new URL(withBasePath('/articles/')!, getBaseUrl()).toString();
    return {
      title: ARTICLES_PAGE.title,
      description: siteMeta.description,
      alternates: {
        canonical,
      },
    };
  }
```

with:

```tsx
  if (page === 1) {
    // /articles/page/1/ is never generated; page 1 lives at /articles/.
    return {};
  }
```

In `resolvePagination`, change:

```tsx
  if (page < 1) {
    notFound();
  }
```

to:

```tsx
  if (page <= 1) {
    // Page 1 is canonically /articles/; treat /articles/page/1/ as missing.
    notFound();
  }
```

- [ ] **Step 5: Single-pass sitemap without page 1**

In `src/app/sitemap.ts`:

Change the imports:

```ts
import { getAllPosts } from '@/lib/posts';
import { paginationSettings } from '@/lib/site';
import { getBaseUrl } from '@/lib/site.server';
```

(removing `generatePaginationParams` from the posts import.)

Replace the `paginatedRoutes` block (lines 30–35):

```ts
  const totalPages =
    allPosts.length === 0
      ? 1
      : Math.ceil(allPosts.length / paginationSettings.defaultItemsPerPage);

  // Pages 2..N only — page 1 is canonically /articles/ (already listed above).
  const paginatedRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => ({
      url: `${base}/articles/page/${index + 2}/`,
      lastModified: rootLastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );
```

- [ ] **Step 6: Update sitemap test expectations**

Run: `npx jest src/app/sitemap.test.ts`
If it fails, update its expected URLs: remove any expected `/articles/page/1/` entry; paginated expectations start at `/articles/page/2/`. The total-route-count assertions decrease by one.

- [ ] **Step 7: Full verification including a build**

Run: `npm run test && npm run build`
Expected: PASS; build output contains `out/articles/page/2/` but NOT `out/articles/page/1/`. Verify:

```bash
ls out/articles/page/
```

Expected: directories `2` (and higher if >30 articles), no `1`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.test.ts "src/app/articles/page/[pageNumber]/page.tsx" src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "fix(seo): stop generating duplicate /articles/page/1/, single-pass sitemap"
```

---

### Task 14: Server-rendered pagination links; drop client pagination JS (#12, #15b)

Pagination on a fully static site needs no JS: replace the `Pagination` (client, 203 lines, `useRouter`/`useCallback`/lucide icons) + `ArticlesPagination` (client wrapper) pair with one server component rendering `<Link>` elements. This also deletes `mergeConfig`, the duplicate of `normalizeConfig` (#15b). Also remove the unnecessary `'use client'` from `Services.tsx` (verified: no hooks, no browser APIs).

**Files:**
- Create: `src/components/articles/PaginationLinks.tsx`
- Create: `src/components/articles/PaginationLinks.test.tsx`
- Modify: `src/app/articles/ArticlesPageSections.tsx` (swap component)
- Delete: `src/components/ui/Pagination.tsx`, `src/components/ui/Pagination.test.tsx`
- Delete: `src/components/articles/ArticlesPagination.tsx`, `src/components/articles/ArticlesPagination.test.tsx`
- Modify: `src/components/sections/Services.tsx:1` (remove `'use client'`)
- Modify: `tests/integration/pagination.spec.ts` (button → link roles)
- Modify: `tests/accessibility.spec.js:171` (button → link role)

- [ ] **Step 1: Write the failing test**

Create `src/components/articles/PaginationLinks.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { PaginationLinks } from './PaginationLinks';
import type { PaginationData } from '@/lib/pagination.types';

function makeData(overrides: Partial<PaginationData> = {}): PaginationData {
  return {
    currentPage: 2,
    totalPages: 3,
    totalItems: 45,
    itemsPerPage: 15,
    startIndex: 15,
    endIndex: 30,
    hasNextPage: true,
    hasPreviousPage: true,
    pageItems: [],
    ...overrides,
  };
}

describe('PaginationLinks', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = render(<PaginationLinks data={makeData({ totalPages: 1 })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('marks the current page with aria-current', () => {
    render(<PaginationLinks data={makeData()} />);
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('links previous and next pages to the right URLs', () => {
    render(<PaginationLinks data={makeData()} />);
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute('href', '/articles/');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '/articles/page/3/');
  });

  it('exposes the pagination landmark', () => {
    render(<PaginationLinks data={makeData()} />);
    expect(screen.getByRole('navigation', { name: 'Articles pagination' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx jest src/components/articles/PaginationLinks.test.tsx`
Expected: FAIL with "Cannot find module './PaginationLinks'"

- [ ] **Step 3: Implement the server component**

Create `src/components/articles/PaginationLinks.tsx`:

```tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { generatePaginationLinks } from '@/lib/pagination';
import type { PaginationData } from '@/lib/pagination.types';

// Server component: pagination on a static export is plain navigation between
// pre-built routes, so it ships zero client JavaScript.

const itemClasses =
  'touch-target inline-flex h-12 min-w-[3rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
const inactiveClasses = 'border-dark/20 bg-white text-dark hover:bg-secondary/10';
const activeClasses = 'border-primary bg-primary text-white shadow';
const disabledClasses = 'border-dark/10 bg-white text-dark/30';

function pageHref(page: number): string {
  return page <= 1 ? '/articles/' : `/articles/page/${page}/`;
}

interface PaginationLinksProps {
  data: PaginationData;
  'aria-label'?: string;
}

export function PaginationLinks({
  data,
  'aria-label': ariaLabel = 'Articles pagination',
}: PaginationLinksProps) {
  if (data.totalPages <= 1) {
    return null;
  }

  const links = generatePaginationLinks(data.currentPage, data.totalPages);

  return (
    <nav data-pagination aria-label={ariaLabel} className="mt-8 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {data.hasPreviousPage ? (
          <Link
            href={pageHref(data.currentPage - 1)}
            aria-label="Previous page"
            className={cn(itemClasses, inactiveClasses)}
          >
            Previous
          </Link>
        ) : (
          <span aria-hidden className={cn(itemClasses, disabledClasses)}>
            Previous
          </span>
        )}

        {links.showStartEllipsis ? (
          <>
            <Link
              href={pageHref(1)}
              aria-label="Page 1"
              className={cn(itemClasses, inactiveClasses, 'hidden sm:inline-flex')}
            >
              1
            </Link>
            <span
              aria-hidden
              className="hidden h-11 w-6 items-center justify-center text-sm text-dark/60 sm:inline-flex"
            >
              …
            </span>
          </>
        ) : null}

        {links.visiblePages.map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            aria-label={`Page ${page}`}
            aria-current={page === data.currentPage ? 'page' : undefined}
            className={cn(
              itemClasses,
              page === data.currentPage ? activeClasses : inactiveClasses,
              'hidden sm:inline-flex',
            )}
          >
            {page}
          </Link>
        ))}

        {links.showEndEllipsis ? (
          <>
            <span
              aria-hidden
              className="hidden h-11 w-6 items-center justify-center text-sm text-dark/60 sm:inline-flex"
            >
              …
            </span>
            <Link
              href={pageHref(links.lastPage)}
              aria-label={`Page ${links.lastPage}`}
              className={cn(itemClasses, inactiveClasses, 'hidden sm:inline-flex')}
            >
              {links.lastPage}
            </Link>
          </>
        ) : null}

        {data.hasNextPage ? (
          <Link
            href={pageHref(data.currentPage + 1)}
            aria-label="Next page"
            className={cn(itemClasses, inactiveClasses)}
          >
            Next
          </Link>
        ) : (
          <span aria-hidden className={cn(itemClasses, disabledClasses)}>
            Next
          </span>
        )}
      </div>

      <span className="text-xs text-dark/70 sm:text-sm">
        Page {data.currentPage} of {data.totalPages}
      </span>
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/articles/PaginationLinks.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Swap it into ArticlesPageSections**

In `src/app/articles/ArticlesPageSections.tsx`:

Change line 4 from:

```tsx
import { ArticlesPagination } from '@/components/articles/ArticlesPagination';
```

to:

```tsx
import { PaginationLinks } from '@/components/articles/PaginationLinks';
```

Change line 153 from:

```tsx
            <ArticlesPagination data={pagination} />
```

to:

```tsx
            <PaginationLinks data={pagination} />
```

- [ ] **Step 6: Delete the client pagination components**

```bash
git rm src/components/ui/Pagination.tsx src/components/ui/Pagination.test.tsx src/components/articles/ArticlesPagination.tsx src/components/articles/ArticlesPagination.test.tsx
```

- [ ] **Step 7: Remove 'use client' from Services**

In `src/components/sections/Services.tsx`, delete line 1 (`'use client';`) and the now-blank line 2.

- [ ] **Step 8: Update the Playwright specs to expect links**

In `tests/integration/pagination.spec.ts`, change line 9 from:

```ts
    const nextButton = page.getByRole('button', { name: /next/i });
```

to:

```ts
    const nextButton = page.getByRole('link', { name: /next/i });
```

In `tests/accessibility.spec.js`, change line 171 from:

```js
      const currentPage = paginationRegion.getByRole('button', { name: /page 1/i, exact: false });
```

to:

```js
      const currentPage = paginationRegion.getByRole('link', { name: /page 1/i, exact: false });
```

- [ ] **Step 9: Full jest + typecheck + lint**

Run: `npm run test && npm run typecheck && npm run lint`
Expected: PASS, no references to the deleted components remain. Verify:

```bash
grep -rn "ArticlesPagination\|ui/Pagination" src tests || echo "clean"
```

Expected: `clean`

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "perf: replace client pagination components with server-rendered links"
```

---

### Task 15: Fix featured-image CLS on article pages (#13)

The above-the-fold header `<img>` has no reserved space (layout shift) and no fetch priority. Mirror the aspect-ratio container already used in the card list.

**Files:**
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx:117-126`

- [ ] **Step 1: Replace the image block**

Replace:

```tsx
            {post.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-secondary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImage}
                  alt={`Featured image for article: ${post.title}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
```

with:

```tsx
            {post.featuredImage && (
              <div
                className="relative mb-8 w-full overflow-hidden rounded-lg shadow-lg border border-secondary/20 bg-secondary/10"
                style={{ aspectRatio: '16/9' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImage}
                  alt={`Featured image for article: ${post.title}`}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              </div>
            )}
```

- [ ] **Step 2: Verify**

Run: `npx jest "src/app/articles/\[year\]" && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add "src/app/articles/[year]/[month]/[day]/[slug]/page.tsx"
git commit -m "perf: reserve featured-image space to prevent CLS, prioritize fetch"
```

---

### Task 16: Dead-code purge (#14, #15c)

All verified-unused (zero application imports; only their own tests reference them):
- `src/lib/variants.ts` (622 lines) and all four consumers: `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Typography.tsx`
- `pagination.ts`: `validatePageParameter`, `createPaginationState`, `getPaginationErrorType`, `normalizeConfig`
- `pagination.types.ts`: `PaginationConstants`, `PaginationConfig`, `PageParameter`, `PaginationErrorType`
- `posts.ts`: `getPostsForPage`
- `contrast-audit.js` (root, referenced nowhere; `accessibility-test.js` IS referenced by `test:a11y-static` — keep it)

**Files:**
- Delete: `src/lib/variants.ts`, `src/lib/variants.test.ts`
- Delete: `src/components/ui/Button.tsx`, `src/components/ui/Button.test.tsx`
- Delete: `src/components/ui/Badge.tsx`, `src/components/ui/Badge.test.tsx`
- Delete: `src/components/ui/Card.tsx`, `src/components/ui/Card.test.tsx`
- Delete: `src/components/ui/Typography.tsx`, `src/components/ui/Typography.test.tsx`
- Delete: `contrast-audit.js`
- Modify: `src/lib/pagination.ts`, `src/lib/pagination.types.ts`, `src/lib/pagination.test.ts`
- Modify: `src/lib/posts.ts`, `src/lib/posts.test.ts`
- Modify: `scripts/new-article.js` (sync comment)

- [ ] **Step 1: Re-verify nothing started using these since the review**

```bash
grep -rn "from '@/lib/variants'\|ui/Button\|ui/Badge\|ui/Card\|ui/Typography" src --include="*.ts" --include="*.tsx" | grep -v "\.test\.\|__tests__"
grep -rn "validatePageParameter\|createPaginationState\|getPaginationErrorType\|getPostsForPage\|PaginationConstants" src --include="*.ts" --include="*.tsx" | grep -v "\.test\.\|pagination.ts:\|posts.ts:\|pagination.types.ts:"
```

Expected: both commands output nothing. If either prints an application usage, STOP and keep that symbol.

- [ ] **Step 2: Delete the dead files**

```bash
git rm src/lib/variants.ts src/lib/variants.test.ts \
  src/components/ui/Button.tsx src/components/ui/Button.test.tsx \
  src/components/ui/Badge.tsx src/components/ui/Badge.test.tsx \
  src/components/ui/Card.tsx src/components/ui/Card.test.tsx \
  src/components/ui/Typography.tsx src/components/ui/Typography.test.tsx \
  contrast-audit.js
```

- [ ] **Step 3: Trim pagination.ts**

In `src/lib/pagination.ts`:
- Delete `normalizeConfig` (lines 24–33), `coerceRawParam` + `validatePageParameter` (lines 84–134), `createPaginationState` (lines 172–179), `getPaginationErrorType` (lines 181–189).
- Update the type import at the top to:

```ts
import type { PaginationData, PaginationLinks } from '@/lib/pagination.types';
```

- Keep `InvalidPageError`, `InvalidConfigError`, `assertPositiveInteger`, `createPageRange`, `getPaginationData`, `generatePaginationLinks` — all still used.

- [ ] **Step 4: Trim pagination.types.ts**

In `src/lib/pagination.types.ts`, delete the `PaginationErrorType` type and the `PaginationConfig`, `PageParameter`, and `PaginationConstants` interfaces. Keep `PaginationData` and `PaginationLinks`.

- [ ] **Step 5: Trim posts.ts**

In `src/lib/posts.ts`, delete the `getPostsForPage` function (lines 130–137). `getPaginationData` import remains used by `getPaginatedPosts`.

- [ ] **Step 6: Update the tests that exercised deleted exports**

In `src/lib/pagination.test.ts`: remove `validatePageParameter` and `createPaginationState` from the import list and delete the `describe('validatePageParameter', ...)` and `describe('createPaginationState', ...)` blocks (and any `getPaginationErrorType` tests).

In `src/lib/posts.test.ts`: remove `getPostsForPage` from the import and delete its two tests (around lines 74 and 80).

- [ ] **Step 7: Add the schema-sync comment to new-article.js**

In `scripts/new-article.js`, directly above the frontmatter template block (around line 89), add:

```js
// NOTE: keep this field list in sync with FrontmatterSchema in src/lib/posts.ts —
// the Zod schema is the source of truth; this script cannot import it (CJS/ESM boundary).
```

- [ ] **Step 8: Full verification**

Run: `npm run test && npm run typecheck && npm run lint`
Expected: PASS. Coverage thresholds should still hold (deleted code took its tests with it). If `coverageThreshold` fails, the deleted self-tested utilities were inflating coverage — re-run `npm run test -- --coverage` and report the new numbers rather than papering over them.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: remove unused variant system, UI components, and dead pagination exports"
```

---

### Task 17: server-only guards on server modules (#18)

`next.config.mjs` aliases `zod` to `false` in client bundles, so a future client-side import of `env.ts` or `site.server.ts` fails at **runtime**. `import 'server-only'` turns that into a build error.

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/lib/env.ts:1`
- Modify: `src/lib/site.server.ts:1`

- [ ] **Step 1: Install the guard package**

Run: `npm install server-only`
Expected: added to `dependencies` in package.json.

- [ ] **Step 2: Add the guards**

Add as the very first line of `src/lib/env.ts`:

```ts
import 'server-only';
```

Add as the very first line of `src/lib/site.server.ts`:

```ts
import 'server-only';
```

- [ ] **Step 3: Verify Jest still passes**

Run: `npm run test`
Expected: PASS — `next/jest` maps `server-only` to an empty module automatically. **If** tests instead fail with a "cannot be imported from a Client Component" error, add this entry to `moduleNameMapper` in `jest.config.js`:

```js
    '^server-only$': '<rootDir>/src/tests/server-only-stub.js',
```

and create `src/tests/server-only-stub.js` containing exactly:

```js
module.exports = {};
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: PASS (all current importers are server components/modules).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/env.ts src/lib/site.server.ts jest.config.js src/tests/server-only-stub.js 2>/dev/null || git add package.json package-lock.json src/lib/env.ts src/lib/site.server.ts
git commit -m "chore: enforce server-only imports for env and site.server modules"
```

---

### Task 18: Type the third-party window globals in booking tests (#19)

Project rule: no `any`. The booking tests use `(window as any).hbspt` / `(window as any).Calendly`.

**Files:**
- Modify: `src/components/consulting/booking/__tests__/HubSpotBookingButton.test.tsx`
- Modify: `src/components/consulting/booking/__tests__/CalendlyBookingButton.test.tsx`

- [ ] **Step 1: Type the HubSpot test window**

In `HubSpotBookingButton.test.tsx`, add below the imports:

```tsx
type HubspotTestWindow = Window & {
  hbspt?: { meetings: { create: jest.Mock } };
};
const testWindow = window as HubspotTestWindow;
```

Then replace every occurrence:
- `delete (window as any).hbspt;` → `delete testWindow.hbspt;`
- `(window as any).hbspt = { meetings: { create } };` → `testWindow.hbspt = { meetings: { create } };`

(including the occurrence added in Task 9.)

- [ ] **Step 2: Type the Calendly test window**

In `CalendlyBookingButton.test.tsx`, add below the imports (match the property shape the file actually assigns at its line 12 — adjust the member name if it differs):

```tsx
type CalendlyTestWindow = Window & {
  Calendly?: { initPopupWidget: jest.Mock };
};
const testWindow = window as CalendlyTestWindow;
```

Then replace:
- line 7: `delete (window as any).Calendly;` → `delete testWindow.Calendly;`
- line 12: `(window as any).Calendly = {...}` → `testWindow.Calendly = {...}`

- [ ] **Step 3: Verify**

Run: `npx jest src/components/consulting/booking && grep -rn "as any" src/components/consulting/booking/__tests__/ || echo "clean"`
Expected: tests PASS; grep prints `clean`.

- [ ] **Step 4: Commit**

```bash
git add src/components/consulting/booking/__tests__
git commit -m "chore: replace as-any window casts with typed test windows"
```

---

### Task 19: Share the prose heading-anchor reset (#15d)

The 12-token `[&_hN_a]` reset block (needed because rehype-autolink-headings wraps every heading in a link) is duplicated verbatim between the article and consulting pages.

**Files:**
- Create: `src/lib/prose.ts`
- Modify: `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx:197-198`
- Modify: `src/app/consulting/[slug]/page.tsx:190-191`

- [ ] **Step 1: Create the shared constant**

Create `src/lib/prose.ts`:

```ts
// rehype-autolink-headings (next.config.mjs) wraps every heading in an anchor;
// without this reset, headings render underlined in the link color.
export const proseHeadingAnchorReset =
  '[&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline ' +
  '[&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit [&_h5_a]:text-inherit [&_h6_a]:text-inherit';
```

- [ ] **Step 2: Use it in the article page**

In `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx`:

Add the import: `import { proseHeadingAnchorReset } from "@/lib/prose";`

The prose `<div>`'s className is a plain string literal — convert it to a template literal (backticks instead of quotes) and replace these two lines inside it:

```
              [&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline
              [&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit [&_h5_a]:text-inherit [&_h6_a]:text-inherit
```

with:

```
              ${proseHeadingAnchorReset}
```

- [ ] **Step 3: Use it in the consulting page**

In `src/app/consulting/[slug]/page.tsx`, same operation: add the import, convert the `<section>` prose className (lines 184–197) to a template literal, and replace its two `[&_hN_a]` lines (190–191) with `${proseHeadingAnchorReset}`.

- [ ] **Step 4: Verify**

Run: `npm run test && npm run typecheck`
Expected: PASS. Visual spot-check (optional): `npm run dev:webpack`, open an article, confirm headings are not underlined.

- [ ] **Step 5: Commit**

```bash
git add src/lib/prose.ts "src/app/articles/[year]/[month]/[day]/[slug]/page.tsx" "src/app/consulting/[slug]/page.tsx"
git commit -m "refactor: share prose heading-anchor reset between article and consulting pages"
```

---

### Task 20: Final verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Full quality gates**

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Expected: all PASS.

- [ ] **Step 2: Static output spot checks**

```bash
node scripts/validate-outputs.js
ls out/scott/ out/articles/page/
grep -c "ld+json" out/articles/*/*/*/*/index.html | head -3
grep -o "page/1" out/sitemap.xml || echo "no page-1 in sitemap"
```

Expected: validate-outputs passes; `out/scott/index.html` exists; no `out/articles/page/1/`; each article HTML contains ≥1 `ld+json` (Organization + Article = 2); sitemap has no `page/1`.

- [ ] **Step 3: Playwright (requires ≥16 articles; see tests/README.md)**

```bash
npm run verify-test-data && npx playwright test tests/integration/pagination.spec.ts tests/accessibility.spec.js
```

Expected: PASS. The pagination spec now finds `link`-role controls; the a11y scan of `nav[data-pagination]` passes; the skip-link test still passes on home, and interior pages now also have a working skip link.

- [ ] **Step 4: Commit any straggler fixes**

If steps 1–3 required fixes, commit them:

```bash
git add -A
git commit -m "test: align integration specs with remediation changes"
```
