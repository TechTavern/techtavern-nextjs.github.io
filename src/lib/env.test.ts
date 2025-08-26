describe('env schema', () => {
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

  it('loads with defaults when unset', () => {
    expect(() => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { env } = require('./env');
        expect(env.SITE_URL).toBeUndefined();
        expect(env.NEXT_PUBLIC_BASE_PATH).toBe('');
      });
    }).not.toThrow();
  });

  it('throws on invalid SITE_URL format', () => {
    process.env.SITE_URL = 'not-a-url';
    expect(() => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./env');
      });
    }).toThrow(/Invalid environment configuration/);
  });
});

