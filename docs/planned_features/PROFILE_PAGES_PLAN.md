# Consultant Profile Pages Implementation Plan

**Status**: Ready for Implementation  
**Target Route**: `/consulting/[slug]`  
**Architecture**: Next.js 15 App Router with MDX content  
**Deployment**: Static export to GitHub Pages

---

## Overview

This plan implements a scalable consultant profile system for Tech Tavern using MDX files for content and Next.js App Router for dynamic page generation. Each consultant profile is a single MDX file with YAML frontmatter containing structured data (services, certifications, case studies) and markdown content for the biography.

### Key Features

- **MDX-based content**: Each profile is a self-contained `.mdx` file
- **Type-safe validation**: Zod schemas ensure data integrity
- **Static generation**: All pages built at compile time for GitHub Pages
- **Scalable architecture**: Add new consultants by creating new MDX files
- **SEO optimized**: Metadata generation for each profile
- **Responsive design**: Mobile-first layout using Tailwind CSS

### URL Structure

- Profile pages: `/consulting/[slug]` (e.g., `/consulting/scott-turnbull`)
- Vanity redirects: `/scott` → `/consulting/scott-turnbull`

---

## Phase 1: Content Structure & Schema

### 1.1 Create Profile Content Directory

Create the directory structure:

```bash
mkdir -p content/profiles
```

### 1.2 Create First Profile MDX File

**File**: `content/profiles/scott-turnbull.mdx`

```mdx
---
name: "Scott Turnbull"
slug: "scott-turnbull"
title: "AI & Cloud Strategy for Nonprofits"
image: "/images/profiles/scott-turnbull.jpg"
bio_short: "Leveraging two decades of AI, data, and cloud leadership to help mission-driven organizations harness AI responsibly and efficiently."

certifications:
  - title: "PMP (Project Management Professional)"
    badge_image: "/images/badges/project-management-professional-pmp.webp"
    link: "https://www.pmi.org/certifications/project-management-pmp"
  - title: "Google Gen-AI Leader"
    badge_image: "/images/badges/generative-ai-leader-certification.webp"
  - title: "AWS Solutions Architect"
    badge_image: "/images/badges/project-management-professional-pmp.webp"
  - title: "Certified Scrum Master"
    badge_image: "/images/badges/generative-ai-leader-certification.webp"

booking:
  provider: "google-booking"
  link: "https://calendar.google.com/calendar/appointments/schedules/00000000000000000000000000000000?gv=true"
  ctaLabel: "Book a Consultation"
  embedComponent: "GoogleBookingButton"
  color: "#2D6AE0"

socials:
  - service: "linkedin"
    url: "https://www.linkedin.com/in/scott-tech-tavern"
  - service: "twitter"
    url: "https://twitter.com/scott-tech-tavern"

services:
  - title: "Ethical AI Governance Audit"
    description: "Review, roadmap, and ISO-27001 checklist."
    price: "$750–$1,200"
    duration: "5 days"

  - title: "AI Strategy Workshop"
    description: "2-hour Zoom session plus a comprehensive roadmap PDF."
    price: "$750"
    duration: "4 hours"
  
  - title: "Cloud Optimization Audit"
    description: "AWS/Azure performance & cost blueprint."
    price: "$1,200–$2,000"
    duration: "1 week"
  
  - title: "AI Governance Implementation Sprint"
    description: "Framework setup, workflow, and implementation roadmap."
    price: "$1,800"
    duration: "7 days"
  
  - title: "Grant-Ready Tech Boost"
    description: "Grant outline review with a comprehensive tech appendix."
    price: "$1,500"
    duration: "5 days"

additional_services:
  - title: "AI Ethics Policy Drafting"
    description: "Collaborative policy sprint to codify AI principles and review checkpoints."
    price: "$1,000"
    duration: "3 days"

case_studies:
  - title: "AI Governance for a Mid-Sized Nonprofit"
    description: "Developed a 5-step ethical AI framework, reducing compliance risk."
    pdf_url: "/case-studies/nonprofit-ai-governance.pdf"
  
  - title: "Cloud Cost Reduction for Public Sector"
    description: "Identified $45k in annual savings for an AWS-based municipal service."
    pdf_url: "/case-studies/public-sector-cloud-audit.pdf"
  
  - title: "Digital Transformation for Grant-Seekers"
    description: "Authored a winning tech strategy for a $1.2M federal grant."
    pdf_url: "/case-studies/grant-tech-strategy.pdf"
---

## About Me

Leveraging over two decades of leadership in AI, data, and cloud architecture, I partner with mission-driven organizations to implement ethical, scalable technology solutions that amplify their impact without compromising their values.

My work focuses on three core areas:

1. **Ethical AI Governance**: Helping organizations build frameworks for responsible AI use
2. **Cloud Strategy**: Optimizing infrastructure for performance, cost, and security
3. **Grant-Ready Technology**: Crafting compelling tech narratives for federal and foundation grants

### My Philosophy

I believe that technology should serve people and missions, not the other way around. Every recommendation I make is grounded in practical experience, measurable outcomes, and a deep respect for organizational culture and constraints.

### Background

Before consulting, I led data and AI initiatives for both public sector agencies and nonprofits, where I learned that the best technology solutions are the ones that people actually want to use. I hold a PMP certification and am a Google-certified Gen-AI Leader.

When I'm not working with clients, I'm writing about tech strategy at [Tech Tavern](/) and mentoring early-career technologists in the nonprofit sector.
```

### 1.3 Create Asset Directories

Create directories for profile images and case study PDFs:

```bash
mkdir -p public/images/profiles
mkdir -p public/case-studies
```

### 1.4 Add Required Assets

Place the following files:

- `public/images/profiles/scott-turnbull.jpg` (profile photo, recommended 400x400px)
- `public/case-studies/nonprofit-ai-governance.pdf`
- `public/case-studies/public-sector-cloud-audit.pdf`
- `public/case-studies/grant-tech-strategy.pdf`

**Note**: If you don't have these files yet, create placeholder files or use temporary images.

---

## Phase 2: Data Layer Implementation

### 2.1 Create Profile Utilities Library

**File**: `src/lib/profiles.ts`

This module handles profile data fetching and validation using Zod for type safety.

```typescript
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import fastGlob from 'fast-glob';

const PROFILES_DIR = path.join(process.cwd(), 'content/profiles');

/**
 * Zod schema for service offerings.
 */
export const BOOKING_PROVIDERS = ['google-booking', 'calendly', 'hubspot'] as const;
export type BookingProvider = (typeof BOOKING_PROVIDERS)[number];

export const BOOKING_COMPONENT_IDS = [
  'GoogleBookingButton',
  'CalendlyBookingButton',
  'HubSpotBookingButton',
] as const;
export type BookingComponentId = (typeof BOOKING_COMPONENT_IDS)[number];

const ServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.string(),
});

const CaseStudySchema = z.object({
  title: z.string(),
  description: z.string(),
  pdf_url: z.string(),
});

const CertificationSchema = z.object({
  title: z.string(),
  badge_image: z.string(),
  link: z.string().url().optional(),
});

export const SOCIAL_SERVICES = ['linkedin', 'twitter', 'instagram', 'facebook', 'github', 'gitlab', 'youtube'] as const;
export type SocialService = (typeof SOCIAL_SERVICES)[number];

const SocialProfileSchema = z.object({
  service: z.enum(SOCIAL_SERVICES),
  url: z.string().url(),
});

const BookingSchema = z.object({
  provider: z.enum(BOOKING_PROVIDERS).default('google-booking'),
  link: z.string().url(),
  ctaLabel: z.string().optional(),
  color: z.string().optional(),
  embedComponent: z.enum(BOOKING_COMPONENT_IDS).optional(),
});

export type BookingConfig = z.infer<typeof BookingSchema>;

const ProfileFrontmatterSchema = z.object({
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  bio_short: z.string(),
  certifications: z.array(CertificationSchema),
  booking: BookingSchema.optional(),
  services: z.array(ServiceSchema),
  additional_services: z.array(ServiceSchema).optional(),
  socials: z.array(SocialProfileSchema).optional(),
  case_studies: z.array(CaseStudySchema),
});

/**
 * Type representing a consultant profile with metadata.
 */
export type ProfileMeta = z.infer<typeof ProfileFrontmatterSchema> & {
  filePath: string;
  url: string;
};

/**
 * Fetches all profile metadata from the content/profiles directory.
 * Validates frontmatter using Zod schemas.
 * 
 * @returns Array of profile metadata objects
 * @throws {z.ZodError} If any profile has invalid frontmatter
 */
export async function getAllProfiles(): Promise<ProfileMeta[]> {
  const files = await fastGlob('*.mdx', { cwd: PROFILES_DIR });
  
  const profiles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(PROFILES_DIR, file);
      const source = await fs.readFile(filePath, 'utf8');
      const { data } = matter(source);
      
      // Validate frontmatter with Zod
      const validated = ProfileFrontmatterSchema.parse(data);
      
      return {
        ...validated,
        filePath,
        url: `/consulting/${validated.slug}`,
      };
    })
  );
  
  return profiles;
}

/**
 * Fetches a single profile by slug.
 * 
 * @param slug - The profile slug to fetch
 * @returns Profile metadata or null if not found
 */
export async function getProfileBySlug(slug: string): Promise<ProfileMeta | null> {
  const profiles = await getAllProfiles();
  return profiles.find(p => p.slug === slug) || null;
}
```

**Notes**:
- Profiles without `booking` data simply omit the CTA in the hero section.
- When introducing a new scheduling provider, extend both the `BookingSchema.provider`/`embedComponent` unions and add a matching client component.

---

## Phase 3: App Router Pages

### 3.1 Create Dynamic Route Page

**File**: `src/app/consulting/[slug]/page.tsx`

This page uses Next.js 15 App Router patterns with Server Components.

```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getAllProfiles, getProfileBySlug } from '@/lib/profiles';
import { getMDXComponents } from '@/mdx-components';
import { mdxOptions } from '@/lib/mdx-options';
import type { Metadata } from 'next';
import { getBaseUrl, withBasePath } from '@/lib/site.server';
import {
  resolveBookingComponent,
  buildBookingButtonProps,
} from '@/components/consulting/booking';
import SectionHeading from '@/components/consulting/SectionHeading';

/**
 * Generates static params for all profiles at build time.
 * Required for static export (GitHub Pages deployment).
 */
export async function generateStaticParams() {
  const profiles = await getAllProfiles();
  return profiles.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

/**
 * Generates metadata for SEO and social sharing.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return {};

  const baseUrl = getBaseUrl();
  const pageUrl = new URL(withBasePath(profile.url) ?? profile.url, baseUrl).toString();
  const imageUrl = profile.image
    ? new URL(withBasePath(profile.image) ?? profile.image, baseUrl).toString()
    : undefined;

  return {
    title: `${profile.name} | ${profile.title}`,
    description: profile.bio_short,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: profile.name,
      description: profile.bio_short,
      url: pageUrl,
      type: 'profile',
      images: imageUrl ? [{ url: imageUrl, alt: profile.name }] : undefined,
    },
  };
}

/**
 * Profile page component.
 * Server Component that renders MDX content with structured data.
 */
export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  
  if (!profile) notFound();
  
  // Read and compile MDX content
  const fs = await import('node:fs/promises');
  const source = await fs.readFile(profile.filePath, 'utf8');
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true, mdxOptions },
    components: getMDXComponents({}),
  });

  const booking = profile.booking;
  const ctaLabel = booking?.ctaLabel ?? 'Book a Consultation';
  const BookingComponent = booking
    ? resolveBookingComponent(booking.provider, booking.embedComponent)
    : null;
  const bookingButtonProps = booking
    ? buildBookingButtonProps({
        bookingLink: booking.link,
        label: ctaLabel,
        color: booking.color,
      })
    : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <header className="text-center border-b border-secondary/20 pb-8 mb-12">
        <Image
          src={profile.image}
          alt={profile.name}
          width={150}
          height={150}
          className="mx-auto rounded-full object-cover mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-2">
          {profile.name}
        </h1>
        <p className="text-xl text-dark/70 mb-6">{profile.title}</p>
        {booking ? (
          BookingComponent && bookingButtonProps ? (
            <BookingComponent {...bookingButtonProps} />
          ) : (
            <Link
              href={booking.link}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaLabel}
            </Link>
          )
        ) : null}
      </header>

      {/* Bio Section (MDX Content) */}
      <section className="prose prose-lg max-w-none mb-12">
        {content}
      </section>

      {/* Certifications */}
      <section className="mb-12">
        <SectionHeading>
          Certifications
        </SectionHeading>
        <ul className="feature-list space-y-2">
          {profile.certifications.map((cert) => (
            <li key={cert}>{cert}</li>
          ))}
        </ul>
      </section>

      {/* Services Grid */}
      <section className="mb-12">
        <SectionHeading>
          Service Offerings
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.services.map((service) => (
            <div 
              key={service.title} 
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-heading font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-dark/70 mb-4">{service.description}</p>
              <div className="text-sm text-dark/60">
                <span className="font-semibold">{service.price}</span> • {service.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {profile.additional_services && profile.additional_services.length > 0 ? (
        <section className="mb-12">
          <details className="group border border-secondary/30 rounded-lg p-6 bg-light/80" role="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
              <SectionHeading level={3} className="m-0">
                Additional Services
              </SectionHeading>
              <ChevronDown className="ml-4 h-5 w-5 text-dark/60 transition-transform duration-200 group-open:-rotate-180" />
            </summary>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.additional_services.map((service) => (
                <div 
                  key={service.title} 
                  className="border border-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-dark/70 mb-4">{service.description}</p>
                  <div className="text-sm text-dark/60">
                    <span className="font-semibold">{service.price}</span> • {service.duration}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      ) : null}

      {/* Case Studies */}
      <section>
        <SectionHeading>
          Case Studies
        </SectionHeading>
        <div className="grid grid-cols-1 gap-6">
          {profile.case_studies.map((study) => (
            <Link
              href={study.pdf_url}
              key={study.title}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="text-xl font-heading font-semibold mb-3">
                {study.title}
              </h3>
              <p className="text-dark/70 mb-3">{study.description}</p>
              <span className="text-accent font-semibold">View PDF →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### 3.2 Booking Component Registry

**File**: `src/components/consulting/booking/index.ts`

Central registry that maps scheduling providers to their React components and applies shared button styling.

```typescript
import GoogleBookingButton from './GoogleBookingButton';
import CalendlyBookingButton from './CalendlyBookingButton';
import HubSpotBookingButton from './HubSpotBookingButton';
import type { BookingButtonProps } from './types';
import type { BookingComponentId, BookingProvider } from '@/lib/profiles';

export type BookingComponentType = (props: BookingButtonProps) => JSX.Element;

const DEFAULT_BUTTON_CLASSES =
  'inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg';

const PROVIDER_COMPONENT_MAP: Record<BookingProvider, BookingComponentType> = {
  'google-booking': GoogleBookingButton,
  calendly: CalendlyBookingButton,
  hubspot: HubSpotBookingButton,
};

const COMPONENT_ID_MAP: Record<BookingComponentId, BookingComponentType> = {
  GoogleBookingButton,
  CalendlyBookingButton,
  HubSpotBookingButton,
};

export function resolveBookingComponent(
  provider: BookingProvider,
  componentId?: BookingComponentId,
): BookingComponentType | null {
  if (componentId) {
    return COMPONENT_ID_MAP[componentId] ?? null;
  }
  return PROVIDER_COMPONENT_MAP[provider] ?? null;
}

export function buildBookingButtonProps(
  props: Omit<BookingButtonProps, 'className'>,
): BookingButtonProps {
  return {
    ...props,
    className: DEFAULT_BUTTON_CLASSES,
  };
}
```

Additional files in the same directory:
- `GoogleBookingButton.tsx` — wraps the Google Scheduling SDK (loads script + stylesheet safely, provides fallback).
- `CalendlyBookingButton.tsx` — opens the Calendly popup widget via their script (falls back to new tab).
- `HubSpotBookingButton.tsx` — initializes the HubSpot Meetings embed when available, otherwise opens the booking link.
- `types.ts` — shared `BookingButtonProps` interface.

### 3.3 Create Consulting Section Layout

**File**: `src/app/consulting/layout.tsx`

This layout wraps all consulting pages with consistent header/footer and metadata.

```typescript
import type { ReactNode } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: {
    template: '%s | Tech Tavern Consulting',
    default: 'Consulting | Tech Tavern',
  },
};

export default function ConsultingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header variant="interior" />
      <main className="min-h-screen bg-light">{children}</main>
      <Footer />
    </>
  );
}
```

---

## Phase 4: Routing & Configuration

### 4.1 Add Vanity URL Redirect

**File**: `next.config.ts` (modify existing)

Add the `redirects()` function to your existing configuration:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ...existing configuration (output, images, etc.)...
  
  async redirects() {
    return [
      {
        source: '/scott',
        destination: '/consulting/scott-turnbull',
        permanent: true, // 308 permanent redirect for SEO
      },
      // Add more consultant vanity URLs here as needed
    ];
  },
};

export default nextConfig;
```

**Example of full `next.config.ts` if you need reference**:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  
  async redirects() {
    return [
      {
        source: '/scott',
        destination: '/consulting/scott-turnbull',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 4.2 Update CSP for Google Booking Script

**File**: `src/lib/csp.ts`

- Add `https://calendar.google.com` to the `script-src`, `connect-src`, and `frame-src` directive arrays (Google serves both the embed script and the modal iframe from this host).
- Optionally extract a `GOOGLE_BOOKING_HOST = "https://calendar.google.com"` constant so future providers are easy to toggle.
- Keep the existing HubSpot and GA hosts intact.

**File**: `src/app/layout.tsx`

- No inline script is required because booking components load their SDKs via `next/script`.
- Confirm the `<meta httpEquiv="Content-Security-Policy">` continues to call `buildContentSecurityPolicy()` with the new domains included.

---

## Phase 5: Testing & Validation

### 5.1 Development Testing

Run these commands and verify results:

```bash
# Start development server
npm run dev

# In your browser, test these URLs:
# http://localhost:3000/scott
# (should redirect to /consulting/scott-turnbull)
#
# http://localhost:3000/consulting/scott-turnbull
# (should display full profile page)

# Verify all sections render:
# - Profile image and name
# - Call-to-action button (Google Booking link)
# - Biography (MDX content)
# - Certifications badge cards display correctly
# - Services grid (2 columns on desktop)
# - Collapsible "Additional Services" section (if provided)
# - Case studies with PDF links

# Test external links:
# - Click "Book a Consultation" → opens Google Booking in a new tab
# - Click case study cards → PDFs open in new tab

# Test responsive layout:
# - Resize browser to mobile width
# - Verify single-column layout
# - Check that all content is readable
```

### 5.2 Type Checking & Linting

```bash
# Run TypeScript type checking
npm run typecheck
# Expected: No errors

# Run ESLint
npm run lint
# Expected: No errors or warnings
```

### 5.3 Build Testing

```bash
# Build static export
npm run build
# Expected: Successful build with no errors

# Verify generated files exist:
ls -la out/consulting/scott-turnbull/
# Should contain: index.html and assets

# Serve the built site locally
npx serve out

# Test in browser:
# http://localhost:3000/scott
# http://localhost:3000/consulting/scott-turnbull
# Verify all assets load (images, fonts, CSS)
```

### 5.4 Testing Checklist

- [ ] `/scott` redirects to `/consulting/scott-turnbull`
- [ ] Profile page renders all sections correctly
- [ ] Profile image loads and displays properly
- [ ] "Book a Consultation" button opens Google Booking in a new tab
- [ ] Biography (MDX content) renders with proper formatting
- [ ] Certifications badge cards display all configured items and link out when provided
- [ ] Services grid shows 2 columns on desktop, 1 on mobile
- [ ] Additional services accordion renders and toggles when extra services are configured
- [ ] Social profile icons render in a single row and open links in new tabs
- [ ] Case study cards link to PDF files
- [ ] External links open in new tabs with proper security attributes
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Built site works when served from `out` directory

---

## Phase 6: Deployment

### 6.1 Commit and Push

```bash
# Stage all new files
git add content/profiles/scott-turnbull.mdx
git add src/lib/profiles.ts
git add src/app/consulting/
git add public/images/profiles/
git add public/case-studies/
git add next.config.ts

# Commit with descriptive message
git commit -m "feat: add consultant profile pages with Scott Turnbull profile"

# Push to main branch
git push origin main
```

### 6.2 Verify GitHub Pages Deployment

1. Navigate to your repository on GitHub
2. Go to **Actions** tab
3. Wait for the deployment workflow to complete
4. Visit your production site at `https://[your-username].github.io/[repo-name]/scott`
5. Verify the redirect and profile page work correctly

---

## Phase 7: Adding Additional Consultants

### 7.1 Create New Profile

To add another consultant (e.g., Jane Doe):

1. **Create MDX file**: `content/profiles/jane-doe.mdx`
   
   ```mdx
   ---
   name: "Jane Doe"
   slug: "jane-doe"
   title: "DevOps & Infrastructure Expert"
   image: "/images/profiles/jane-doe.jpg"
   bio_short: "Helping organizations build resilient, scalable infrastructure..."
   certifications:
     - "Kubernetes Certified Administrator"
     - "AWS DevOps Professional"
   booking:
     provider: "google-booking"
     link: "https://calendar.google.com/calendar/appointments/schedules/11111111111111111111111111111111?gv=true"
     ctaLabel: "Schedule with Jane"
   services:
     - title: "Infrastructure Audit"
       description: "..."
       price: "$1,000"
       duration: "3 days"
   case_studies:
     - title: "..."
       description: "..."
       pdf_url: "/case-studies/..."
   ---
   
   ## About Me
   
   Biography content...
   ```

2. **Add assets**:
   - `public/images/profiles/jane-doe.jpg`
   - Any case study PDFs referenced

3. **Add vanity redirect** (optional):
   
   In `next.config.ts`:
   ```typescript
   async redirects() {
     return [
       {
         source: '/scott',
         destination: '/consulting/scott-turnbull',
         permanent: true,
       },
       {
         source: '/jane',
         destination: '/consulting/jane-doe',
         permanent: true,
       },
     ];
   },
   ```

4. **Build and deploy**:
   ```bash
   npm run build
   git add content/profiles/jane-doe.mdx public/images/profiles/jane-doe.jpg
   git commit -m "feat: add Jane Doe consultant profile"
   git push origin main
   ```

**That's it!** Next.js will automatically generate `/consulting/jane-doe` at build time.

---

## Architecture Notes

### Why This Approach

This implementation follows established patterns in the Tech Tavern codebase:

1. **Mirrors article system**: Uses same patterns as `src/lib/posts.ts` and article pages
2. **Type-safe with Zod**: All frontmatter validated at build time
3. **Static-first**: No runtime dependencies, perfect for GitHub Pages
4. **Scalable**: Adding consultants requires only content files, no code changes
5. **Maintainable**: Follows Next.js 15 App Router best practices

### Design System Integration

The implementation uses Tech Tavern's existing design tokens:

- **Typography**: 
  - Headings: `font-heading` (Montserrat)
  - Body: `font-body` (Open Sans)
- **Colors**:
  - Text: `text-dark`, `text-dark/70` (opacity variants)
  - Background: `bg-light`
  - Primary CTA: `bg-primary`, `hover:bg-primary-dark`
  - Accent: `text-accent`
  - Borders: `border-secondary/20`, `border-secondary/30`
- **Components**:
  - Lists: `.feature-list` class from global CSS
  - Prose: `.prose` class for MDX content styling
- **Layout**:
  - Container: `container mx-auto` with max-width constraints
  - Grid: Tailwind grid utilities (responsive 1/2 columns)
  - Spacing: Consistent `mb-6`, `mb-12` rhythm

### Accessibility Features

- Semantic HTML5 structure (`<header>`, `<section>`, `<main>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images
- Focus states on interactive elements (buttons, links)
- External links with `rel="noopener noreferrer"` for security
- ARIA-compliant markup

### SEO Considerations

- Dynamic metadata generation per profile
- OpenGraph tags for social sharing
- Descriptive URLs (`/consulting/[slug]`)
- Semantic HTML for better crawlability
- 308 permanent redirects for vanity URLs

---

## Dependencies

No new dependencies required. The implementation uses existing packages:

- `next` (15.x) — App Router, Image optimization, static export
- `next-mdx-remote` (5.x) — MDX compilation with React Server Components
- `gray-matter` (4.x) — YAML frontmatter parsing
- `zod` (3.x) — Schema validation
- `fast-glob` (3.x) — Efficient file system globbing
- `react` (19.x) — UI framework
- `typescript` (5.x) — Type safety

All are already installed in the project.

---

## Troubleshooting

### Build Errors

**Problem**: `Cannot find module '@/lib/profiles'`

**Solution**: Ensure `src/lib/profiles.ts` exists and has no TypeScript errors. Run `npm run typecheck`.

---

**Problem**: `Error: ENOENT: no such file or directory, open 'content/profiles/scott-turnbull.mdx'`

**Solution**: Verify the profile MDX file exists at the correct path and has valid YAML frontmatter.

---

**Problem**: Zod validation error: `Expected string, received undefined`

**Solution**: Check that all required frontmatter fields are present in your MDX file. Compare against the schema in `src/lib/profiles.ts`.

---

### Development Issues

**Problem**: Images not loading in development

**Solution**: Ensure images are in `public/images/profiles/` and paths in frontmatter start with `/` (e.g., `/images/profiles/scott-turnbull.jpg`).

---

**Problem**: Redirect not working

**Solution**: 
1. Check that `next.config.ts` has the `redirects()` function
2. Restart the dev server (`npm run dev`)
3. Clear browser cache

---

**Problem**: MDX content not rendering

**Solution**: 
1. Verify `getMDXComponents` is exported from `mdx-components.tsx`
2. Check that `mdxOptions` exists in `src/lib/mdx-options.ts`
3. Ensure MDX file has valid markdown below the frontmatter

---

### Deployment Issues

**Problem**: 404 on production but works locally

**Solution**: 
1. Verify `npm run build` succeeds without errors
2. Check that `out/consulting/scott-turnbull/index.html` exists
3. Ensure `NEXT_PUBLIC_BASE_PATH` is set correctly in GitHub Actions

---

**Problem**: Images broken on GitHub Pages

**Solution**: Image paths must be absolute from the site root. Use `/images/profiles/...` not `./images/...`.

---

## Future Enhancements

### Consulting Index Page

Create `src/app/consulting/page.tsx` to list all consultants:

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { getAllProfiles } from '@/lib/profiles';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: 'Our Consultants',
  description: 'Meet our team of technology consultants specializing in AI, cloud, and digital transformation.',
};

export default async function ConsultingIndexPage() {
  const profiles = await getAllProfiles();

  return (
    <>
      <Header variant="interior" />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
          Our Consultants
        </h1>
        <p className="text-xl text-dark/70 mb-12 max-w-2xl">
          Expert guidance for nonprofits, government agencies, and mission-driven organizations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <Link
              key={profile.slug}
              href={profile.url}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Image
                src={profile.image}
                alt={profile.name}
                width={120}
                height={120}
                className="mx-auto rounded-full object-cover mb-4"
              />
              <h2 className="text-2xl font-heading font-semibold text-center mb-2">
                {profile.name}
              </h2>
              <p className="text-dark/70 text-center mb-4">{profile.title}</p>
              <p className="text-sm text-dark/60">{profile.bio_short}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

### Service Categories

Add filtering by service category:

1. **Add to frontmatter**:
   ```yaml
   service_categories:
     - "AI & Machine Learning"
     - "Cloud Infrastructure"
   ```

2. **Update schema in `src/lib/profiles.ts`**:
   ```typescript
   const ProfileFrontmatterSchema = z.object({
     // ...existing fields...
     service_categories: z.array(z.string()).optional(),
   });
   ```

3. **Add filter UI** to consulting index page

### Contact Forms

Integrate a contact form for direct inquiries:

- Use Formspree, Netlify Forms, or similar service
- Add form component to profile pages
- Validate with Zod on client and server

### Testimonials

Add client testimonials to profiles:

1. **Extend frontmatter**:
   ```yaml
   testimonials:
     - quote: "Scott's AI governance framework was transformative..."
       author: "Jane Smith"
       organization: "Nonprofit XYZ"
   ```

2. **Update schema** in `src/lib/profiles.ts`

3. **Render in page** component

### Availability Calendar

Display real-time availability:

- Integrate scheduling provider API (Google Booking first)
- Show next available time slots
- Add booking flow

---

## Success Criteria

Implementation is complete when:

- ✅ Profile page accessible at `/consulting/scott-turnbull`
- ✅ Vanity URL `/scott` redirects correctly
- ✅ All TypeScript checks pass (`npm run typecheck`)
- ✅ All linting checks pass (`npm run lint`)
- ✅ Static build succeeds (`npm run build`)
- ✅ All images and PDFs load correctly
- ✅ Booking CTA renders via Google Booking widget fallback
- ✅ Responsive layout works on mobile/tablet/desktop (320px to 1920px+)
- ✅ External links open in new tabs with security attributes
- ✅ SEO metadata properly generated
- ✅ Site deploys successfully to GitHub Pages
- ✅ Profile page matches Tech Tavern design system

---

## Maintenance

### Updating a Profile

To update consultant information:

1. Edit the MDX file: `content/profiles/[slug].mdx`
2. Modify frontmatter or biography content
3. Commit and push: `git commit -m "chore: update Scott's profile"` and `git push`
4. GitHub Actions will automatically rebuild and deploy

### Adding New Services

To add a service to an existing profile:

```yaml
services:
  # ...existing services...
  - title: "New Service Name"
    description: "Service description"
    price: "$X,XXX"
    duration: "X days/weeks"
```

No code changes required — just update the MDX file.

### Archive a Consultant

To remove a consultant profile:

1. Delete or rename the MDX file (e.g., `scott-turnbull.mdx.disabled`)
2. Remove the vanity redirect from `next.config.ts`
3. Commit and push

The page will no longer be generated in the next build.

---

## Reference Files

Key files in this implementation:

- `content/profiles/[slug].mdx` — Profile content and data
- `src/lib/profiles.ts` — Data fetching and validation
- `src/app/consulting/[slug]/page.tsx` — Dynamic profile page
- `src/app/consulting/layout.tsx` — Consulting section layout
- `next.config.ts` — Redirect configuration
- `public/images/profiles/` — Profile photos
- `public/case-studies/` — Case study PDFs

Related existing patterns to reference:

- `src/lib/posts.ts` — Similar data fetching for articles
- `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx` — Similar dynamic route
- `docs/BRANDING_GUIDE.md` — Design system tokens
- `AGENTS.md` — Project architecture and conventions

---

## Questions & Support

If you encounter issues during implementation:

1. Check the **Troubleshooting** section above
2. Run `npm run typecheck` and `npm run lint` for error details
3. Verify file paths match exactly as shown in this plan
4. Compare your implementation against reference files in the codebase

---

**End of Implementation Plan**
