import { parseEnv } from './env';

describe('env schema', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.NEXT_PUBLIC_GA_ID;
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

  it('normalizes NEXT_PUBLIC_BASE_PATH by trimming and removing trailing slash', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ' /preview/ ';
    const env = parseEnv();
    expect(env.NEXT_PUBLIC_BASE_PATH).toBe('/preview');
  });

  it('rejects NEXT_PUBLIC_BASE_PATH without leading slash', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = 'preview';
    expect(() => parseEnv()).toThrow(/NEXT_PUBLIC_BASE_PATH must be empty or start with a single leading slash/);
  });

  it('rejects NEXT_PUBLIC_BASE_PATH with duplicate leading slashes', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '//bad';
    expect(() => parseEnv()).toThrow(/NEXT_PUBLIC_BASE_PATH must be empty or start with a single leading slash/);
  });
});
