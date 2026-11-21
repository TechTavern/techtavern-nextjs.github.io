import 'server-only';
import { env } from './env';
import { DEFAULT_FEATURED_IMAGE } from './site';

/**
 * Site address: the one place that knows about SITE_URL, basePath and the
 * trailing-slash convention (`trailingSlash: true` in next.config.mjs).
 *
 * Everything else stores basePath-free route paths ("/articles/2025/01/02/x/",
 * "/images/foo.webp") and asks this module for an `href` (rendered src/href that
 * Next does not prefix itself, e.g. <img src>) or an `absoluteUrl` (metadata,
 * sitemap, Feed, JSON-LD). Absolute http(s) inputs pass through unchanged.
 */
export type SiteAddressConfig = {
  siteUrl?: string;
  basePath?: string;
};

export type SiteAddress = {
  /** Absolute URL of the site root including basePath, without trailing slash. */
  readonly baseUrl: string;
  /** Normalized basePath ("" or "/something", no trailing slash). */
  readonly basePath: string;
  /** Root-relative, basePath-prefixed href for a stored path. */
  href(path: string): string;
  /** Fully qualified URL for a stored path. */
  absoluteUrl(path: string): string;
};

const ABSOLUTE_URL = /^https?:\/\//i;

function normalizeBasePath(basePath: string | undefined): string {
  const trimmed = (basePath ?? '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Page paths (no file extension in the last segment) end with "/". */
function withTrailingSlash(path: string): string {
  const match = /^([^?#]*)(.*)$/.exec(path);
  const pathname = match?.[1] ?? path;
  const suffix = match?.[2] ?? '';
  if (pathname.endsWith('/')) return path;
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (lastSegment.includes('.')) return path;
  return `${pathname}/${suffix}`;
}

export function createSiteAddress(config: SiteAddressConfig): SiteAddress {
  const basePath = normalizeBasePath(config.basePath);
  const site = new URL(config.siteUrl || 'http://localhost:3000');
  // SITE_URL may be the bare origin or may already include the basePath
  // (the staging deploy sets both); never apply the basePath twice.
  let sitePath = site.pathname.replace(/\/+$/, '');
  if (basePath && sitePath.endsWith(basePath)) {
    sitePath = sitePath.slice(0, -basePath.length);
  }
  const root = `${site.origin}${sitePath}`;

  const href = (path: string): string => {
    if (ABSOLUTE_URL.test(path)) return path;
    const rooted = path.startsWith('/') ? path : `/${path}`;
    return `${basePath}${withTrailingSlash(rooted)}`;
  };

  return {
    baseUrl: `${root}${basePath}`,
    basePath,
    href,
    absoluteUrl: (path: string) => (ABSOLUTE_URL.test(path) ? path : `${root}${href(path)}`),
  };
}

/** The site address for this build, from validated environment variables. */
export const siteAddress: SiteAddress = createSiteAddress({
  siteUrl: env.SITE_URL,
  basePath: env.NEXT_PUBLIC_BASE_PATH,
});

/** Absolute URL of the house default Featured Image. */
export function defaultFeaturedImageUrl(address: SiteAddress = siteAddress): string {
  return address.absoluteUrl(DEFAULT_FEATURED_IMAGE);
}
