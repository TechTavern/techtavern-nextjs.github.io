import { parseEnv } from './env';

describe('env schema', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('loads with defaults when unset', () => {
    const env = parseEnv();
    expect(env.SITE_URL).toBeUndefined();
    expect(env.NEXT_PUBLIC_BASE_PATH).toBe('');
  });

  it('throws on invalid SITE_URL format', () => {
    process.env.SITE_URL = 'not-a-url';
    expect(() => parseEnv()).toThrow(/Invalid environment configuration/);
  });
});
