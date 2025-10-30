import "./globals.css";
import type { ReactNode } from "react";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import { DEFAULT_FEATURED_IMAGE, siteMeta, siteOrg } from "@/lib/site";
import { getBaseUrl, withBasePath } from "@/lib/site.server";
import { env } from "@/lib/env";
import { buildOrganizationJsonLd } from "@/lib/seo";

export const metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: "technology consulting, AI, data security, IT solutions, software development, DevOps",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: 'website',
    siteName: siteMeta.title,
    url: getBaseUrl(),
    images: [
      { url: new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString(), alt: siteMeta.title },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
    images: [new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString()],
  },
  alternates: {
    canonical: getBaseUrl(),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const baseUrl = getBaseUrl();
  const orgJsonLd = buildOrganizationJsonLd({
    name: siteOrg.name,
    baseUrl,
    logoPath: siteOrg.logoPath,
    email: siteOrg.email,
  });
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" as="image" href="/images/richmond-station-view-375w.webp" type="image/webp" media="(max-width: 767px)" />
        <link rel="preload" as="image" href="/images/richmond-station-view-768w.webp" type="image/webp" media="(min-width: 768px) and (max-width: 1199px)" />
        <link rel="preload" as="image" href="/images/richmond-station-view-1200w.webp" type="image/webp" media="(min-width: 1200px)" />
        {/* Inline critical CSS removed; relying on globals.css and Tailwind utilities */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; connect-src 'self' https://www.google-analytics.com; img-src 'self' data: https:; font-src 'self'; style-src 'self' 'unsafe-inline';`}
        />
        <script
          type="application/ld+json"
          // JSON-LD for Organization (site-wide)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {env.NEXT_PUBLIC_GA_ID ? (
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        ) : null}
        {children}
      </body>
    </html>
  );
}
