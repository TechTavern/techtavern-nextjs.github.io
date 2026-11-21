import type { MetadataRoute } from 'next';
import { siteAddress } from '@/lib/site.server';

// Ensure static generation for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = siteAddress.baseUrl;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: siteAddress.absoluteUrl('/sitemap.xml'),
    host: base,
  };
}

