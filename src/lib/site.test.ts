import { getBaseUrlWith } from './site';

describe('getBaseUrl', () => {
  it('combines SITE_URL and NEXT_PUBLIC_BASE_PATH', () => {
    const url = getBaseUrlWith({ SITE_URL: 'https://example.com/', NEXT_PUBLIC_BASE_PATH: '/myapp/' });
    expect(url).toBe('https://example.com/myapp');
  });

  it('defaults to localhost when SITE_URL is missing', () => {
    const url = getBaseUrlWith({ NEXT_PUBLIC_BASE_PATH: '' });
    expect(url).toBe('http://localhost:3000');
  });
});
