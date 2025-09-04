# Coding Standards - Tech Tavern

Version: 1.0  
Last Updated: September 2025  
Applies to: Tech Tavern Next.js static site project

## Table of Contents

- [Overview](#overview)
- [File Organization](#file-organization)
- [TypeScript Standards](#typescript-standards)
- [React Component Standards](#react-component-standards)
- [Next.js App Router Standards](#nextjs-app-router-standards)
- [Styling Standards](#styling-standards)
- [Content & MDX Standards](#content--mdx-standards)
- [Performance Standards](#performance-standards)
- [Security Standards](#security-standards)
- [Testing Standards](#testing-standards)
- [Documentation Standards](#documentation-standards)
- [Git & CI Standards](#git--ci-standards)

## Overview

This document establishes coding standards for the Tech Tavern static site project. These standards prioritize maintainability, performance, security, and developer experience while adhering to SOLID principles and DRY (Don't Repeat Yourself) practices.

### Core Principles

- **Single Responsibility**: Each module, component, or function should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for their base classes
- **Interface Segregation**: Clients should not depend on interfaces they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions
- **DRY**: Avoid code duplication through abstraction and configuration centralization

## File Organization

### Directory Structure Standards

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout (global metadata, CSP, fonts)
│   ├── page.tsx           # Homepage composition
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── articles/          # Article routes and layouts
│   ├── sitemap.ts         # Static sitemap generation
│   └── rss.xml/route.ts   # RSS feed generation
├── components/            # Reusable UI components
│   ├── sections/          # Homepage section components
│   └── ui/               # Shared UI components
├── lib/                  # Utilities and business logic
│   ├── env.ts            # Environment validation (Zod schemas)
│   ├── site.ts           # Client-safe site constants
│   ├── site.server.ts    # Server-only URL helpers
│   ├── posts.ts          # Content processing and validation
│   └── seo.ts            # SEO and JSON-LD builders
content/
└── articles/             # MDX content files
public/                   # Static assets (images, fonts, favicons)
```

### Naming Conventions

- **Files**: Use kebab-case for non-component files (`site.server.ts`, `mdx-components.tsx`)
- **Components**: Use PascalCase (`Navigation.tsx`, `MDXImage.tsx`)
- **Utilities**: Use camelCase for functions and variables
- **Constants**: Use SCREAMING_SNAKE_CASE for module-level constants
- **Routes**: Use lowercase semantic paths (`/articles/`, not `/Articles/`)

### File Naming Standards

- Server-only modules: Use `.server.ts` suffix (e.g., `site.server.ts`)
- Component files: Match the default export name exactly
- Test files: Use `.test.ts` or `.test.tsx` suffix, colocated with source
- Config files: Use descriptive names (`next.config.ts`, `jest.config.js`)

## TypeScript Standards

### Type Safety

```typescript
// ✅ GOOD: Strict typing with Zod validation
import { z } from 'zod';

const FrontmatterSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slug: z.string(),
  excerpt: z.string().optional(),
  draft: z.boolean().optional()
});

export type PostMeta = z.infer<typeof FrontmatterSchema> & {
  year: number;
  month: number;
  day: number;
  url: string;
  readingTimeMinutes: number;
};

// ❌ AVOID: Loose typing
const post: any = { title: "Some title" };
```

### Configuration Standards

- Use strict TypeScript configuration (`strict: true`)
- Enable all recommended strict checks
- Use path aliases (`@/*` maps to `src/*`)
- Separate server-only code with `.server.ts` naming

### Error Handling

```typescript
// ✅ GOOD: Explicit error handling with proper types
export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const files = await glob('content/articles/*.mdx');
    const posts = await Promise.all(
      files.map(async (file) => {
        const result = await processPost(file);
        return FrontmatterSchema.parse(result.frontmatter);
      })
    );
    return posts.filter(post => !post.draft);
  } catch (error) {
    console.error('Error loading posts:', error);
    throw new Error('Failed to load posts');
  }
}

// ❌ AVOID: Silent failures or unclear error types
function getPosts() {
  try {
    // ... some logic
  } catch (e) {
    return [];
  }
}
```

## React Component Standards

### Component Architecture

```typescript
// ✅ GOOD: Single responsibility, clear props interface
interface NavigationProps {
  variant?: 'home' | 'interior';
  className?: string;
}

export function Navigation({ variant = 'interior', className }: NavigationProps) {
  const baseClasses = 'flex items-center justify-between';
  const variantClasses = variant === 'home' 
    ? 'fixed top-0 bg-transparent' 
    : 'relative bg-white border-b';
  
  return (
    <nav className={`${baseClasses} ${variantClasses} ${className}`}>
      {/* Navigation content */}
    </nav>
  );
}

// ❌ AVOID: Multiple responsibilities, unclear interface
function HeaderWithNavAndUser({ isHome, user, showSearch }) {
  // Handles navigation, user state, and search - too many responsibilities
}
```

### Server vs Client Components

```typescript
// ✅ GOOD: Server component by default (static content)
// src/app/articles/page.tsx
import { getAllPosts } from '@/lib/posts';

export default async function ArticlesPage() {
  const posts = await getAllPosts();
  
  return (
    <div>
      {posts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

// ✅ GOOD: Client component when interactivity needed
'use client';

import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  // Interactive navigation logic
}

// ❌ AVOID: Unnecessary client components
'use client';

export function StaticContent() {
  return <div>This could be a server component</div>;
}
```

### Component Composition

```typescript
// ✅ GOOD: Composition over inheritance
export function HomePage() {
  return (
    <>
      <Hero />
      <Info />
      <Mission />
      <Services />
      <Profile />
      <Contact />
      <Footer />
    </>
  );
}

// ❌ AVOID: Monolithic components
export function HomePage() {
  return (
    <div>
      {/* 500+ lines of mixed concerns */}
    </div>
  );
}
```

## Next.js App Router Standards

### Route Organization

```typescript
// ✅ GOOD: Clear route structure with proper nesting
src/app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage
├── articles/
│   ├── layout.tsx            # Articles layout
│   ├── page.tsx              # Articles index
│   └── [year]/[month]/[day]/[slug]/
│       ├── page.tsx          # Article detail
│       └── head.tsx          # Article metadata
└── sitemap.ts                # Sitemap generation
```

### Static Generation

```typescript
// ✅ GOOD: Proper static generation with type safety
export async function generateStaticParams(): Promise<
  { year: string; month: string; day: string; slug: string }[]
> {
  const posts = await getAllPosts();
  
  return posts.map(post => ({
    year: post.year.toString(),
    month: post.month.toString().padStart(2, '0'),
    day: post.day.toString().padStart(2, '0'),
    slug: post.slug
  }));
}

// ❌ AVOID: Missing static generation for dynamic routes
// This would cause build failures in static export mode
```

### Metadata Standards

```typescript
// ✅ GOOD: Centralized metadata generation
import { generateArticleJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostByParams(params);
  
  return {
    title: post.ogTitle || post.title,
    description: post.ogDescription || post.excerpt,
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt,
      url: `${getBaseUrl()}${post.url}`,
      images: post.ogImage ? [{ url: withBasePath(post.ogImage) }] : undefined
    },
    alternates: {
      canonical: post.canonicalUrl || `${getBaseUrl()}${post.url}`
    }
  };
}
```

## Styling Standards

### Tailwind CSS Standards

```typescript
// ✅ GOOD: Consistent utility class patterns
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700'
};

// ✅ GOOD: Responsive design patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// ❌ AVOID: Inline styles when Tailwind utilities exist
<div style={{ backgroundColor: '#3b82f6', padding: '16px' }}>
```

### CSS Organization

```css
/* ✅ GOOD: Organized globals.css structure */
@import "tailwindcss";

@theme {
  /* Custom design tokens */
  --color-brand: #1a365d;
  --font-family-display: "Inter", sans-serif;
}

/* Critical above-the-fold styles only */
.bg-hero {
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}

/* ❌ AVOID: Duplicating styles between inline and CSS */
```

## Content & MDX Standards

### Frontmatter Schema

```typescript
// ✅ GOOD: Strict frontmatter validation
const FrontmatterSchema = z.object({
  // Required fields
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  slug: z.string().min(1, 'Slug is required'),
  
  // Optional fields with defaults
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
  
  // SEO fields
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().url().optional()
});
```

### File Naming

```
content/articles/
├── 2024-01-15-getting-started.mdx     # ✅ GOOD: YYYY-MM-DD-slug format
├── 2024-02-20-advanced-patterns.mdx
└── draft-future-post.mdx              # ❌ AVOID: Non-standard naming
```

### MDX Configuration

```typescript
// ✅ GOOD: Centralized MDX configuration
// src/lib/mdx-options.ts
export const mdxOptions = {
  remarkPlugins: [
    remarkGfm,
    remarkSlug
  ],
  rehypePlugins: [
    rehypeAutolinkHeadings,
    rehypeExternalLinks
  ]
};

// Import in both next.config.ts and compileMDX calls
```

## Performance Standards

### Bundle Optimization

```typescript
// ✅ GOOD: Client-side bundle protection
// next.config.ts
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Prevent Zod from being bundled client-side
      'zod': process.env.NODE_ENV === 'production' ? false : 'zod'
    };
    return config;
  }
};

// ✅ GOOD: Proper image optimization
<Image 
  src="/images/hero.jpg"
  width={1200}
  height={630}
  alt="Hero image"
  priority // For above-the-fold images
/>
```

### Static Generation Best Practices

```typescript
// ✅ GOOD: Efficient static data loading
export const dynamic = 'force-static'; // For sitemap/RSS routes

// ✅ GOOD: Reading time calculation
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

## Security Standards

### Content Security Policy

```typescript
// ✅ GOOD: Strict CSP with environment awareness
const csp = [
  "default-src 'self'",
  "script-src 'self'" + (isDev ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com",
  "connect-src 'self' https://www.google-analytics.com"
].join('; ');
```

### Environment Variable Validation

```typescript
// ✅ GOOD: Zod validation for environment variables
const envSchema = z.object({
  SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string().optional().default(''),
  NEXT_PUBLIC_GA_ID: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

### Safe External Links

```typescript
// ✅ GOOD: Secure external link handling
const externalLinkProps = {
  target: '_blank',
  rel: 'nofollow noopener noreferrer external'
};
```

## Testing Standards

### Unit Test Structure

```typescript
// ✅ GOOD: Descriptive test organization
describe('getAllPosts', () => {
  it('should return published posts only', async () => {
    const posts = await getAllPosts();
    
    expect(posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          slug: expect.any(String),
          url: expect.stringMatching(/^\/articles\/\d{4}\/\d{2}\/\d{2}\/[\w-]+\/$/)
        })
      ])
    );
    
    expect(posts.every(post => !post.draft)).toBe(true);
  });
  
  it('should calculate reading time correctly', async () => {
    const posts = await getAllPosts();
    const post = posts[0];
    
    expect(post.readingTimeMinutes).toBeGreaterThan(0);
    expect(Number.isInteger(post.readingTimeMinutes)).toBe(true);
  });
});
```

### Component Testing

```typescript
// ✅ GOOD: Testing component behavior
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  it('should render home variant correctly', () => {
    render(<Navigation variant="home" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('fixed', 'top-0', 'bg-transparent');
  });
  
  it('should render interior variant correctly', () => {
    render(<Navigation variant="interior" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('relative', 'bg-white', 'border-b');
  });
});
```

## Documentation Standards

### Code Documentation

```typescript
// ✅ GOOD: Clear JSDoc documentation
/**
 * Generates absolute URLs for the site, handling base path configuration
 * for staging vs production environments.
 * 
 * @returns Base URL without trailing slash (e.g., "https://example.com")
 * @example
 * ```typescript
 * const absoluteUrl = new URL('/articles/', getBaseUrl()).toString();
 * // Result: "https://example.com/articles/"
 * ```
 */
export function getBaseUrl(): string {
  return env.SITE_URL || 'http://localhost:3000';
}
```

### README Requirements

- Clear setup instructions for all operating systems
- Environment variable documentation
- Script descriptions
- Architecture overview
- Deployment instructions

### Inline Comments

```typescript
// ✅ GOOD: Explain complex logic and business rules
// Calculate reading time based on average 200 words per minute
const readingTimeMinutes = Math.ceil(wordCount / 200);

// Normalize image paths for GitHub Pages subdirectory deployment
const normalizedImage = post.featuredImage 
  ? withBasePath(post.featuredImage)
  : undefined;

// ❌ AVOID: Obvious comments
// Increment counter by 1
counter += 1;
```

## Git & CI Standards

### Commit Messages

```
feat: add article pagination support
fix: resolve CSP blocking external images  
docs: update README with WSL setup instructions
refactor: centralize MDX configuration options
test: add unit tests for post processing
chore: update dependencies to latest versions
```

### Branch Protection

- Require PR reviews for `main` branch
- Require status checks to pass (lint, typecheck, tests)
- Require up-to-date branches before merging

### CI Pipeline Standards

```yaml
# ✅ GOOD: Comprehensive quality gates
- name: Quality Gates
  run: |
    npm run typecheck
    npm run lint
    npm run test
    npm audit --audit-level moderate
```

### Environment Management

- Use GitHub Actions secrets for sensitive values
- Use GitHub Actions variables for non-sensitive configuration
- Document all required environment variables
- Validate environment in CI before build

---

## Enforcement

These standards are enforced through:

- **ESLint**: Code style and common errors
- **TypeScript**: Type safety and interfaces  
- **Prettier**: Code formatting (when configured)
- **Jest**: Unit test coverage requirements
- **GitHub Actions**: Automated quality gates
- **PR Reviews**: Manual code review process

For questions about these standards or proposed changes, please create an issue or discussion in the repository.