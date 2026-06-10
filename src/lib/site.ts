// Client-safe site constants. Server-only helpers moved to site.server.ts

export const siteMeta = {
  title: 'Tech Tavern',
  description: "We help you harness AI, data, and cloud to transform your mission into impact—strategically and responsibly.",
};

// Default featured image to use across the site when none is provided
export const DEFAULT_FEATURED_IMAGE = '/images/tech-tavern-default-featured.webp';

// Organization metadata for JSON-LD and OG
export const siteOrg = {
  name: 'Tech Tavern, LLC',
  email: 'info@tech-tavern.com',
  // Use a square logo for previews and JSON-LD
  logoPath: '/favicons/android-icon-192x192.png',
};

export const paginationSettings = {
  defaultItemsPerPage: 12,
  maxVisiblePageLinks: 3,
} as const;
