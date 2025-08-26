describe('getBaseUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('combines SITE_URL and NEXT_PUBLIC_BASE_PATH', () => {
    process.env.SITE_URL = 'https://example.com/';
    process.env.NEXT_PUBLIC_BASE_PATH = '/myapp/';
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getBaseUrl } = require('./site');
      expect(getBaseUrl()).toBe('https://example.com/myapp');
    });
  });

  it('defaults to localhost when SITE_URL is missing', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '';
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getBaseUrl } = require('./site');
      expect(getBaseUrl()).toBe('http://localhost:3000');
    });
  });
});
