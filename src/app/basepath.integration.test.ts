/* @jest-environment node */
// Exercises the real site-address helpers, real content, and real page
// metadata with a NON-EMPTY basePath (as the staging deploy uses).

jest.mock('@/lib/mdx-options', () => ({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
}));
// The build sets images.unoptimized, so next/image renders `src` unchanged.
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) =>
    jest.requireActual('react').createElement('img', { src, alt }),
}));
// Render the home variant of the header as the home route would.
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: () => '/',
}));
jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(async () => ({ content: null })),
}));

const BASE_PATH = '/techtavern-nextjs.github.io';
// next.config sets trailingSlash: true; the build inlines this for next/link (read per call).
process.env.__NEXT_TRAILING_SLASH = 'true';
const SITE_URL = 'https://example.github.io';

type Loaded = {
  posts: typeof import('@/lib/posts');
  articlePage: typeof import('@/app/articles/[year]/[month]/[day]/[slug]/page');
  consultingPage: typeof import('@/app/consulting/[slug]/page');
  profiles: typeof import('@/lib/profiles');
  sitemap: typeof import('@/app/sitemap');
  renderAssets: () => string;
  renderHomeNav: () => string;
  renderToStaticMarkup: (element: unknown) => string;
};

function loadWithEnv(siteUrl: string, basePath: string): Loaded {
  const prev = {
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    __NEXT_ROUTER_BASEPATH: process.env.__NEXT_ROUTER_BASEPATH,
  };
  process.env.SITE_URL = siteUrl;
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  // next.config's basePath, which the build inlines for next/link (read at module load).
  process.env.__NEXT_ROUTER_BASEPATH = basePath;
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    loaded = {
      posts: require('@/lib/posts'),
      articlePage: require('@/app/articles/[year]/[month]/[day]/[slug]/page'),
      consultingPage: require('@/app/consulting/[slug]/page'),
      profiles: require('@/lib/profiles'),
      sitemap: require('@/app/sitemap'),
      renderToStaticMarkup: require('react-dom/server').renderToStaticMarkup,
      renderHomeNav: (() => {
        const { createElement } = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const Header = require('@/components/ui/Header').default;
        return () => renderToStaticMarkup(createElement(Header, { variant: 'home' }));
      })(),
      renderAssets: (() => {
        const { createElement } = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const RootLayout = require('@/app/layout').default;
        const mdx = require('@/mdx-components').getMDXComponents();
        const sections = [
          require('@/components/sections/Profile').default,
          require('@/components/sections/Services').default,
          require('@/components/sections/Info').default,
          require('@/components/sections/Contact').default,
          require('@/components/ui/Header').default,
        ];
        return () =>
          [
            RootLayout({ children: null }),
            ...sections.map((C) => createElement(C, {})),
            mdx.img({ src: '/images/mdx-sample.webp', alt: '', width: 10, height: 10 }),
            mdx.img({ src: 'https://cdn.example.com/remote.webp', alt: '' }),
          ]
            .map((element) => renderToStaticMarkup(element))
            .join('\n');
      })(),
    };
  });
  process.env.SITE_URL = prev.SITE_URL;
  process.env.NEXT_PUBLIC_BASE_PATH = prev.NEXT_PUBLIC_BASE_PATH;
  if (prev.__NEXT_ROUTER_BASEPATH === undefined) delete process.env.__NEXT_ROUTER_BASEPATH;
  else process.env.__NEXT_ROUTER_BASEPATH = prev.__NEXT_ROUTER_BASEPATH;
  return loaded as Loaded;
}

function collectUrls(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    if (/^https?:\/\//.test(value)) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUrls(v, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectUrls(v, out));
  } else if (value instanceof URL) {
    out.push(value.toString());
  }
  return out;
}

describe.each([
  ['SITE_URL is the origin', SITE_URL],
  ['SITE_URL already includes the basePath (staging deploy)', `${SITE_URL}${BASE_PATH}`],
])('with a non-empty basePath (%s)', (_label, siteUrl) => {
  const m = loadWithEnv(siteUrl, BASE_PATH);
  const doubled = `${BASE_PATH}${BASE_PATH}`;

  it('Article Social Preview images and URLs contain the basePath exactly once', async () => {
    const [post] = await m.posts.getAllPosts();
    expect(post).toBeDefined();
    const meta = await m.articlePage.generateMetadata({
      params: Promise.resolve({ year: post.year, month: post.month, day: post.day, slug: post.slug }),
    });
    const urls = collectUrls({ og: meta.openGraph, tw: meta.twitter, alt: meta.alternates });
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      if (url.startsWith(SITE_URL)) {
        expect(url).not.toContain(doubled);
        expect(url.startsWith(`${SITE_URL}${BASE_PATH}/`)).toBe(true);
      }
    }
    const og = meta.openGraph as { images?: Array<{ url: string }>; url?: string };
    expect(og.url).toBe(`${SITE_URL}${BASE_PATH}${post.url}`);
  });

  it('Consultant Profile Canonical URL has the basePath once and a trailing slash', async () => {
    const [profile] = await m.profiles.getAllProfiles();
    const meta = await m.consultingPage.generateMetadata({ params: Promise.resolve({ slug: profile.slug }) });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}${BASE_PATH}/consulting/${profile.slug}/`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${SITE_URL}${BASE_PATH}/consulting/${profile.slug}/`);
  });

  it('sitemap entries contain the basePath exactly once', async () => {
    const entries = await m.sitemap.default();
    for (const entry of entries) {
      expect(entry.url.startsWith(`${SITE_URL}${BASE_PATH}/`)).toBe(true);
      expect(entry.url).not.toContain(doubled);
      expect(entry.url.endsWith('/')).toBe(true);
    }
  });

  it('public-folder asset hrefs (favicons, preloads, next/image src) carry the basePath once', () => {
    const html = m.renderAssets();
    const assetUrls = [...html.matchAll(/(?:href|src)="([^"]+\.(?:ico|png|webp|svg|jpg|webmanifest))"/g)].map(
      ([, url]) => url,
    );
    expect(assetUrls).toEqual(expect.arrayContaining([`${BASE_PATH}/favicons/favicon.ico`]));
    expect(assetUrls.some((u) => u.includes('/images/badges/'))).toBe(true);
    expect(assetUrls.some((u) => u.includes('/assets/img/logos/'))).toBe(true);
    expect(assetUrls).toContain(`${BASE_PATH}/images/mdx-sample.webp`);
    expect(assetUrls).toContain('https://cdn.example.com/remote.webp');
    // '/img.jpg' is next/jest's stub for bundler-imported images (the hero
    // preloads); the real build emits those under `${basePath}/_next/static/media/`.
    for (const url of assetUrls.filter((u) => u.startsWith('/') && u !== '/img.jpg')) {
      expect(url.startsWith(`${BASE_PATH}/`)).toBe(true);
      expect(url).not.toContain(doubled);
    }
  });

  it('home Navigation logo (client component) carries the basePath once', () => {
    const srcs = [...m.renderHomeNav().matchAll(/src="([^"]+)"/g)].map(([, src]) => src);
    expect(srcs).toEqual([`${BASE_PATH}/assets/img/logos/TechTavern_Logo_Inverted_Horizontal_X.svg`]);
  });

  it('home Navigation section links (including /#hash links) carry the basePath once', () => {
    const hrefs = [...m.renderHomeNav().matchAll(/href="([^"]+)"/g)].map(([, href]) => href);
    const rootRelative = hrefs.filter((h) => h.startsWith('/'));
    // next/link renders '/#Services' as `${basePath}#Services` (as the real build does).
    expect(rootRelative).toEqual(expect.arrayContaining([`${BASE_PATH}#Services`, `${BASE_PATH}#Contact`]));
    for (const href of rootRelative) {
      expect(href === BASE_PATH || /^[/#]/.test(href.slice(BASE_PATH.length))).toBe(true);
      expect(href.startsWith(BASE_PATH)).toBe(true);
      expect(href).not.toContain(doubled);
    }
  });

  it('Consultant Profile page images carry the basePath once', async () => {
    const [profile] = await m.profiles.getAllProfiles();
    const page = await m.consultingPage.default({ params: Promise.resolve({ slug: profile.slug }) });
    const srcs = [...m.renderToStaticMarkup(page).matchAll(/src="([^"]+)"/g)].map(([, src]) => src);
    expect(srcs).toContain(`${BASE_PATH}${profile.image}`);
    for (const src of srcs.filter((u) => u.startsWith('/'))) {
      expect(src.startsWith(`${BASE_PATH}/`)).toBe(true);
      expect(src).not.toContain(doubled);
    }
  });
});

describe('CSS asset references', () => {
  // Root-absolute url('/x') in CSS is emitted verbatim and ignores basePath.
  // Relative urls are resolved by the bundler, which fingerprints the file
  // under /_next/static/media/ and applies assetPrefix (= basePath).
  const fs = require('node:fs') as typeof import('node:fs');
  const path = require('node:path') as typeof import('node:path');
  const srcDir = path.join(process.cwd(), 'src');
  const cssFiles = (fs.readdirSync(srcDir, { recursive: true }) as string[])
    .filter((f) => f.endsWith('.css'))
    .map((f) => path.join(srcDir, f));
  const refs = cssFiles.flatMap((file) =>
    [...fs.readFileSync(file, 'utf8').matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map(([, url]) => ({ file, url })),
  );

  it('finds the CSS url() references', () => {
    expect(refs.length).toBeGreaterThan(0);
  });

  it.each(refs.map((r) => [path.relative(process.cwd(), r.file), r.url]))(
    '%s: %s is bundler-resolved and exists',
    (file, url) => {
      expect(url).not.toMatch(/^\//);
      if (/^(?:data:|https?:|#)/.test(url)) return;
      expect(fs.existsSync(path.resolve(path.dirname(file), url))).toBe(true);
    },
  );
});
