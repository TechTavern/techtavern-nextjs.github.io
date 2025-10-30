import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@/components/analytics/AnalyticsRoot', () =>
  jest.fn(({ measurementId, hubspotPortalId }: { measurementId?: string; hubspotPortalId?: string }) => (
    <div
      data-testid="analytics-root"
      data-measurement-id={measurementId ?? ''}
      data-hubspot-portal-id={hubspotPortalId ?? ''}
    />
  )),
);

describe('RootLayout', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    delete process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
    delete process.env.SITE_URL;
    jest.resetModules();
    jest.clearAllMocks();
  });

  async function loadLayout() {
    return import('./layout');
  }

  it('omits the analytics component when GA id is not configured', async () => {
    const { default: RootLayout } = await loadLayout();

    const html = renderToStaticMarkup(
      <RootLayout>
        <div>content</div>
      </RootLayout>,
    );

    expect(html).not.toContain('data-testid="analytics-root"');
  });

  it('renders Google Analytics when GA id is provided', async () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST';
    process.env.SITE_URL = 'https://example.com';

    const { default: RootLayout } = await loadLayout();

    const html = renderToStaticMarkup(
      <RootLayout>
        <div>content</div>
      </RootLayout>,
    );

    expect(html).toContain('data-testid="analytics-root"');
    expect(html).toContain('data-measurement-id="G-TEST"');
    expect(html).toContain('data-hubspot-portal-id=""');
  });

  it('passes HubSpot portal id when configured', async () => {
    process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID = '244237198';
    process.env.SITE_URL = 'https://example.com';

    const { default: RootLayout } = await loadLayout();

    const html = renderToStaticMarkup(
      <RootLayout>
        <div>content</div>
      </RootLayout>,
    );

    expect(html).toContain('data-testid="analytics-root"');
    expect(html).toContain('data-measurement-id=""');
    expect(html).toContain('data-hubspot-portal-id="244237198"');
  });

  it('exposes metadata with canonical URLs derived from the base URL', async () => {
    process.env.SITE_URL = 'https://example.com';
    const { metadata } = await loadLayout();

    expect(metadata.title).toBe('Tech Tavern');
    expect(metadata.alternates?.canonical).toBe('https://example.com');
    expect(metadata.openGraph?.images?.[0]?.url).toBe('https://example.com/images/tech-tavern-default-featured.webp');
  });
});
