# Booking Modal Provider Extensions Plan

**Status**: Approved
**Owners**: Web Platform Team  
**Last Updated**: 2025-10-30

---

## 1. Overview

Extend the consulting profile system so each consultant can choose a scheduling provider (Google Booking, Calendly, HubSpot, etc.) while keeping the trigger button on-brand and CSP-compliant. The existing `GoogleBookingButton` serves as the reference implementation; this plan generalizes the schema, introduces a provider/component registry, and documents integration steps for additional services.

---

## 2. Requirements & Goals

- **Theming**: All booking buttons use Tech Tavern Tailwind styles, independent of the provider SDK.
- **Flexibility**: Profiles declare their provider in MDX frontmatter; no page-level code edits are required per consultant.
- **CSP Compliance**: Only approved script/frame hosts are allowed; `next/script` handles external SDK loading.
- **Accessibility & Fallbacks**: Maintain semantic buttons, visible labels, focus management, and fallback links when scripts fail.

Non-goals: building a full scheduling UI in-house, replacing provider UIs, or adding analytics in this iteration (see Future Extensions).

---

## 3. Technical Plan

### 3.1 Schema & Types

- Update `src/lib/profiles.ts`
  - Extend `booking.provider` union to include supported providers (`'google-booking'`, `'calendly'`, `'hubspot'`, ...).
  - Map `booking.embedComponent` to specific React component identifiers (e.g. `'GoogleBookingButton'`, `'CalendlyBookingButton'`).
  - Export `BookingProvider` and `BookingComponent` types for downstream imports.
- Add inline documentation / code comments describing required fields per provider.
- Update unit tests if added later (see §6 Testing).

### 3.2 Booking Component Registry

- Create `src/components/consulting/booking/index.ts`
  - Export a registry (e.g. `BOOKING_COMPONENTS`) linking providers to components.
  - Provide a helper `getBookingComponent(provider)` that returns the matching component or `null`.
- Move the existing Google implementation into `src/components/consulting/booking/GoogleBookingButton.tsx`
  - Accept optional props (`label`, `color`, `className`).
  - Continue loading Google’s script via `next/script`.
- Stub new components:
  - `CalendlyBookingButton.tsx`
  - `HubSpotBookingButton.tsx`
  - Include TODOs for provider-specific script URLs and initialization (actual API integration can follow in subsequent tickets).

### 3.3 Consulting Page Integration

- Update `src/app/consulting/[slug]/page.tsx`
  - Replace the hard-coded Google import with dynamic resolution via the registry helper.
  - Render the resolved component when available, passing `booking.link`, `booking.ctaLabel`, and optional styling props.
  - Maintain a styled `<Link>` fallback if the provider/component is missing or the script errors.
- Ensure the fallback retains button semantics and accessible labeling.

### 3.4 MDX Frontmatter Guidance

- Update `docs/planned_features/PROFILE_PAGES_PLAN.md`
  - Show provider-specific frontmatter examples (Google, Calendly, HubSpot).
  - Document optional knobs (`ctaLabel`, brand color overrides).
- Update existing MDX files (`content/profiles/*.mdx`) to match new schema fields once code is ready.

### 3.5 CSP & Script Hosts

- Audit each provider’s required hostnames.
  - Extend `buildContentSecurityPolicy` (`src/lib/csp.ts`) with new `https://` hosts in the appropriate directives (`script-src`, `frame-src`, `connect-src`).
  - Update `src/lib/csp.test.ts` to assert the new hosts.
- Keep script loading inside the individual booking components via `next/script` to respect the `<meta httpEquiv="Content-Security-Policy">` tag.

---

## 4. Implementation Phases

1. **Schema Expansion**
   - Adjust Zod schemas & exported types.
   - Verify `npm run typecheck`.

2. **Component Registry & Refactor**
   - Create registry/module structure.
   - Move Google component; stub new providers.

3. **Page Integration**
   - Refactor profile page to use registry & fallbacks.
   - Smoke-test locally with existing Google profile.

4. **Documentation Updates**
   - Update plan docs and profile MDX samples.
   - Communicate schema changes to content maintainers.

5. **CSP Adjustments**
   - Add provider hosts & update CSP tests.
   - Re-run `npm run lint` & `npm run build`.

---

## 5. Testing & Verification

- **Automated**
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - (Optional) add unit tests for any new helper functions in `profiles.ts`.

- **Manual QA Checklist**
  - Start dev server (`npm run dev`).
  - Visit `/consulting/[slug]` for a Google-enabled profile.
    - Button displays with Tech Tavern styling.
    - Modal opens; ESC closes; focus returns to button.
  - Temporarily block script URL to confirm fallback link opens in new tab.
  - Repeat for additional providers once their components are wired up.

- **Static Export Verification**
  - `npm run build`
  - `npx serve out`
  - Hit `http://localhost:3000/consulting/[slug]` and confirm button functionality when served from static output.

---

## 6. Future Extensions

- Lazy-load provider components (`next/dynamic`) to avoid bundling unused SDKs.
- Add shared analytics utilities to track button clicks regardless of provider.
- Introduce automated integration tests with Playwright for modal interactions.
- Ship provider-specific configuration (e.g. duration, event types) via extended frontmatter.

---

## 7. Open Questions

- Which additional providers (Calendly, HubSpot, others) are highest priority for the first iteration?
- Do we need per-profile color overrides, or should button colors remain global?
- Should booking configurations support multiple buttons per profile (e.g. different services)?

Gather answers before implementation to keep the scope tightly aligned with current needs.

---

**End of Plan**
