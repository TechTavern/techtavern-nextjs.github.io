/* @jest-environment node */

import robots from '@/app/robots';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: jest.fn(),
}));

const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('robots route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns sitemap and host derived from base URL', () => {
    getBaseUrlMock.mockReturnValue('https://example.com/base');

    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules?.userAgent).toBe('*');
    expect(rules?.allow).toBe('/');
    expect(result.sitemap).toBe('https://example.com/base/sitemap.xml');
    expect(result.host).toBe('https://example.com/base');
  });

  it('throws when base URL lookup fails', () => {
    getBaseUrlMock.mockImplementation(() => {
      throw new Error('base url missing');
    });

    expect(() => robots()).toThrow('base url missing');
  });
});
