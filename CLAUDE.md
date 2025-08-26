# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based static blog for Tech Tavern, LLC, configured for GitHub Pages deployment. The project uses MDX for blog posts and is designed to generate static output.

## Key Architecture

- **Static Site Generation**: Uses Next.js with `output: "export"` for GitHub Pages
- **Blog System**: Date-based URL structure `/blog/YYYY/MM/DD/slug/` with MDX posts in `content/posts/`
- **Post Processing**: Uses gray-matter for frontmatter parsing, with required fields: `title`, `date`, `slug`
- **MDX Integration**: Configured with remark-gfm, rehype-slug, and rehype-autolink-headings plugins
- **Styling**: Tailwind CSS v4 with PostCSS integration

## Essential Commands

```bash
# Development
npm run dev          # Start development server
npm run dev:watch    # Dev server with MDX change notifications

# Build and Deploy
npm run build        # Build static site to /out directory
npm start           # Start production server (after build)

# Code Quality  
npm run lint        # Run ESLint with Next.js and TypeScript rules
npm run typecheck   # TypeScript type checking without emit

# Testing
npm run test        # Run Jest tests
npm run test:watch  # Run Jest tests in watch mode

# Content Creation
npm run new-article # Interactive script to create new MDX article
```

## File Structure

- `content/articles/*.mdx` - Blog posts with date-prefixed filenames (YYYY-MM-DD-slug.mdx)
- `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx` - Dynamic blog post pages
- `src/lib/posts.ts` - Post metadata extraction, URL generation, and Zod schema validation
- `src/lib/env.ts` - Environment variable validation using Zod
- `src/mdx-components.tsx` - Global MDX component styling
- `scripts/new-article.js` - Interactive article creation script

## Blog Post Requirements

Posts must have frontmatter with:
- `title: string` (required)
- `date: string` (yyyy-mm-dd format, required)
- `slug: string` (required)
- Optional: `excerpt`, `tags` array, `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `draft` boolean

Frontmatter is validated using Zod schema at build time for type safety.

## Development Notes

- **TypeScript**: Strict mode enabled with path aliases (`@/*` → `src/*`)
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Testing**: Jest with React Testing Library, jsdom environment
- **Images**: Unoptimized for static export compatibility
- **Environment**: Uses Zod validation for SITE_URL and NEXT_PUBLIC_BASE_PATH
- **Content**: MDX with gray-matter frontmatter parsing, reading time calculation (~200 wpm)
- **Security**: CSP headers configured in root layout
- **URLs**: Date-based structure `/articles/YYYY/MM/DD/slug/`

## Code Quality and Best Practices Guidelines (Next.js with TypeScript)

### Architecture and Design Principles

- **Architecture-First Approach**: Design the application structure using Next.js conventions (pages/app router, API routes, middleware). Plan component hierarchy, state management, and data flow before implementation.
- **Single Responsibility Principle**: Each React component, custom hook, utility function, and API route should have one clear purpose. Separate business logic from presentation logic.
- **Encapsulation**: Use proper TypeScript access modifiers, private methods, and module boundaries. Expose only necessary props and interfaces from components and modules.
- **DRY (Don't Repeat Yourself)**: Extract common functionality into custom hooks, utility functions, shared components, and reusable TypeScript types/interfaces.

### Next.js Specific Best Practices

- **App Router Structure**: Use the app directory structure with proper layout nesting, loading states, and error boundaries.
- **Server vs Client Components**: Explicitly mark client components with 'use client' and prefer server components for data fetching and static content.
- **API Route Security**: Implement proper HTTP method handling, request validation, and error responses in API routes.
- **Performance Optimization**: Utilize Next.js built-in optimizations (Image component, dynamic imports, static generation) and implement proper caching strategies.
- **SEO and Metadata**: Implement proper metadata API usage, structured data, and semantic HTML for better search engine optimization.

### TypeScript Standards

- **Type Safety**: Use strict TypeScript configuration with `strict: true` and additional strict flags (`noImplicitReturns`, `noFallthroughCasesInSwitch`).
- **NO `any` TYPES**: **NEVER use `any` type**. Always specify proper types. Use `unknown` for truly unknown data, specific interfaces for objects, or union types for multiple possibilities.
- **Unused Variables**: Prefix unused parameters with underscore (e.g., `_event`, `_index`) to indicate intentional non-use and avoid linting errors.
- **Interface Design**: Define clear interfaces for props, API responses, and data models. Use generic types for reusable components.
- **Type Guards**: Implement proper runtime type checking using type guards or validation libraries like Zod for external data.
- **Utility Types**: Leverage TypeScript utility types (`Omit`, `Pick`, `Partial`, etc.) for type transformations and avoid duplication.

### React and Component Best Practices

- **Component Design**: Create small, focused components with clear prop interfaces. Use composition over inheritance.
- **State Management**: Choose appropriate state management (useState, useReducer, Zustand, Redux Toolkit) based on complexity and scope.
- **Custom Hooks**: Extract complex logic into custom hooks for reusability and testability.
- **Error Boundaries**: Implement error boundaries for graceful error handling in component trees.
- **Accessibility**: Follow WCAG guidelines with proper ARIA attributes, semantic HTML, and keyboard navigation support.

### Security Best Practices

- **Input Validation**: Validate all user inputs using schema validation libraries (Zod, Yup) on both client and server sides.
- **API Security**: Implement CSRF protection, rate limiting, and proper authentication/authorization for API routes.
- **XSS Prevention**: Sanitize user-generated content and avoid dangerouslySetInnerHTML unless absolutely necessary.
- **Environment Variables**: Use Next.js environment variable conventions (`NEXT_PUBLIC_` for client-side, secure server-only variables).
- **Content Security Policy**: Implement CSP headers through next.config.js or middleware for additional security.
- **Dependency Security**: Regular dependency updates, use of `npm audit`, and careful evaluation of third-party packages.

### Performance and Optimization

- **Bundle Optimization**: Use dynamic imports for code splitting, optimize bundle size with proper tree shaking.
- **Image Optimization**: Always use Next.js Image component with proper sizing, lazy loading, and format optimization.
- **Caching Strategies**: Implement appropriate caching with Next.js cache functions, SWR/React Query for client-side caching.
- **Core Web Vitals**: Monitor and optimize for LCP, FID, CLS, and other performance metrics.

### Testing and Quality Assurance

- **Testing Stack**: Use Jest with React Testing Library for unit/integration tests, Playwright or Cypress for E2E tests.
- **Component Testing**: Test component behavior, user interactions, and accessibility features.
- **API Testing**: Test API routes with proper mocking and error scenarios.
- **Type Testing**: Use TypeScript compiler tests and tools like `tsd` for type-level testing.

### Development Workflow

- **Linting and Formatting**: Configure ESLint with Next.js rules, Prettier, and TypeScript-specific linting rules.
- **Git Hooks**: Implement pre-commit hooks for linting, type checking, and testing using Husky or similar tools.
- **Code Review**: Review for TypeScript type safety, React patterns, Next.js best practices, and security considerations.

### Implementation Standards

- Follow Next.js and React conventions for file naming (kebab-case for files, PascalCase for components)
- Use ESLint rules: `@next/eslint-plugin-next`, `@typescript-eslint/recommended`
- Implement proper TypeScript path mapping in `tsconfig.json` for clean imports
- Use Next.js built-in features (middleware, route handlers) over custom solutions
- Implement proper loading states and error handling for async operations
- Consider accessibility from the start with proper semantic HTML and ARIA attributes

### Performance Monitoring

- Implement analytics and monitoring (Web Vitals, error tracking)
- Use Next.js built-in performance metrics and bundle analysis
- Regular lighthouse audits and performance testing

Remember: These guidelines should enhance development velocity while maintaining code quality. Leverage TypeScript's type system and Next.js optimizations to build robust, scalable applications.

## Testing Framework

- **Jest**: Configured with Next.js integration
- **React Testing Library**: For component testing
- **jsdom**: Test environment for DOM testing
- **Setup**: `jest.setup.js` with testing-library/jest-dom
- **Coverage**: Collects from `src/**/*.{ts,tsx}` excluding type definitions
- **Path mapping**: Supports `@/*` imports in tests

## Environment Configuration

- **SITE_URL**: Public origin for sitemap/RSS (validated with Zod)
- **NEXT_PUBLIC_BASE_PATH**: Handled automatically by CI for staging/production
- **Validation**: Runtime environment validation using `src/lib/env.ts`
- **Defaults**: Falls back to `http://localhost:3000` in development

# NextJS Windows Project

This project uses Windows npm through PowerShell. 

**Use `win-npm` instead of `npm` for all package management:**
- `win-npm install`
- `win-npm run dev` 
- `win-npm run build`

The development server runs on Windows for proper file watching.