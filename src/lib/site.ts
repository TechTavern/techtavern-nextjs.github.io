import { env } from './env';

export function getBaseUrlWith(e: { SITE_URL?: string; NEXT_PUBLIC_BASE_PATH?: string }) {
  const base = (e.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const basePath = (e.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return `${base}${basePath}`;
}

export function getBaseUrl() {
  return getBaseUrlWith(env);
}

export const siteMeta = {
  title: 'Tech Tavern',
  description: "We help you harness AI, data, and cloud to transform your mission into impact—strategically and responsibly.",
};

// Default featured image to use across the site when none is provided
export const DEFAULT_FEATURED_IMAGE = '/images/tech-tavern-default-featured.webp';

// Prefix a root-relative path with the configured basePath (for subdirectory hosting)
export function withBasePath(pathname: string | undefined | null): string | undefined {
  if (!pathname) return undefined;
  const p = String(pathname);
  if (/^https?:\/\//i.test(p)) return p; // already absolute
  const basePath = (env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const normalized = p.startsWith('/') ? p : `/${p}`;
  return `${basePath}${normalized}`;
}
