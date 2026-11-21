/* @jest-environment node */

import robots from '@/app/robots';

jest.mock('@/lib/site.server', () => {
  const actual = jest.requireActual('@/lib/site.server');
  return { ...actual, siteAddress: actual.createSiteAddress({ siteUrl: 'https://example.com', basePath: '/base' }) };
});

describe('robots route', () => {
  it('returns sitemap and host derived from the site address (with basePath)', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules?.userAgent).toBe('*');
    expect(rules?.allow).toBe('/');
    expect(result.sitemap).toBe('https://example.com/base/sitemap.xml');
    expect(result.host).toBe('https://example.com/base');
  });
});
