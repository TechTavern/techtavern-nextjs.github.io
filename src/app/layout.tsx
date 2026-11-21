import "./globals.css";
import type { ReactNode } from "react";
import AnalyticsRoot from "@/components/analytics/AnalyticsRoot";
import { siteMeta, siteOrg } from "@/lib/site";
import { defaultFeaturedImageUrl, siteAddress } from "@/lib/site.server";
import { env } from "@/lib/env";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { buildContentSecurityPolicy } from "@/lib/csp";
// Same files Hero.module.css references; importing them yields the bundler's
// fingerprinted, assetPrefix-ed URL so the preloads match the CSS requests.
import heroImage375 from "../../public/images/richmond-station-view-375w.webp";
import heroImage768 from "../../public/images/richmond-station-view-768w.webp";
import heroImage1200 from "../../public/images/richmond-station-view-1200w.webp";

export const metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: "technology consulting, AI, data security, IT solutions, software development, DevOps",
  metadataBase: new URL(siteAddress.baseUrl),
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: 'website',
    siteName: siteMeta.title,
    url: siteAddress.baseUrl,
    images: [
      { url: defaultFeaturedImageUrl(), alt: siteMeta.title },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
    images: [defaultFeaturedImageUrl()],
  },
  alternates: {
    canonical: siteAddress.baseUrl,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const orgJsonLd = buildOrganizationJsonLd({
    name: siteOrg.name,
    address: siteAddress,
    logoPath: siteOrg.logoPath,
    email: siteOrg.email,
  });
  const measurementId = env.NEXT_PUBLIC_GA_ID;
  const hubspotPortalId = env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const hasAnalytics = Boolean(measurementId || hubspotPortalId);
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={siteAddress.href("/favicons/favicon.ico")} />
        <link rel="apple-touch-icon" sizes="180x180" href={siteAddress.href("/favicons/apple-icon-180x180.png")} />
        <link rel="icon" type="image/png" sizes="96x96" href={siteAddress.href("/favicons/favicon-96x96.png")} />
        <link rel="icon" type="image/png" sizes="32x32" href={siteAddress.href("/favicons/favicon-32x32.png")} />
        <link rel="icon" type="image/png" sizes="16x16" href={siteAddress.href("/favicons/favicon-16x16.png")} />
        <link rel="manifest" href={siteAddress.href("/site.webmanifest")} />
        <link rel="preload" as="image" href={heroImage375.src} type="image/webp" media="(max-width: 767px)" />
        <link rel="preload" as="image" href={heroImage768.src} type="image/webp" media="(min-width: 768px) and (max-width: 1199px)" />
        <link rel="preload" as="image" href={heroImage1200.src} type="image/webp" media="(min-width: 1200px)" />
        {/* Inline critical CSS removed; relying on globals.css and Tailwind utilities */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={buildContentSecurityPolicy({
            includeUnsafeEval: process.env.NODE_ENV === "development",
          })}
        />
        <script
          type="application/ld+json"
          // JSON-LD for Organization (site-wide)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {hasAnalytics ? (
          <AnalyticsRoot
            measurementId={measurementId}
            hubspotPortalId={hubspotPortalId}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
