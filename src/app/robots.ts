import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site.server';

// Ensure static generation for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

