import { parseEnv } from './env';

describe('env schema', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.NEXT_PUBLIC_GA_ID;
    delete process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
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

  it('accepts a numeric HubSpot portal id', () => {
    process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID = ' 244237198 ';
    const env = parseEnv();
    expect(env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID).toBe('244237198');
  });

  it('trims a trailing .js from the HubSpot portal id', () => {
    process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID = '244237198.js';
    const env = parseEnv();
    expect(env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID).toBe('244237198');
  });

  it('rejects a non-numeric HubSpot portal id', () => {
    process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID = 'abc123';
    expect(() => parseEnv()).toThrow(/must be the numeric HubSpot portal ID/);
  });

  it('rejects a malformed NEXT_PUBLIC_GA_ID', () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-123'); alert(1); //";
    expect(() => parseEnv()).toThrow(/NEXT_PUBLIC_GA_ID/);
  });

  it('accepts a valid GA4 measurement ID', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-ABC123XYZ0';
    expect(parseEnv().NEXT_PUBLIC_GA_ID).toBe('G-ABC123XYZ0');
  });
});
