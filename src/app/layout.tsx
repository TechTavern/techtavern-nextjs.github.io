import "./globals.css";
import type { ReactNode } from "react";
import Navigation from "@/components/ui/Navigation";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import { DEFAULT_FEATURED_IMAGE, getBaseUrl, siteMeta, withBasePath } from "@/lib/site";
import { analytics } from "@/data/site";

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
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" as="image" href="/images/richmond-station-view-375w.webp" type="image/webp" media="(max-width: 767px)" />
        <link rel="preload" as="image" href="/images/richmond-station-view-768w.webp" type="image/webp" media="(min-width: 768px) and (max-width: 1199px)" />
        <link rel="preload" as="image" href="/images/richmond-station-view-1200w.webp" type="image/webp" media="(min-width: 1200px)" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - Above-fold content */
            html { scroll-behavior: smooth; }
            body { 
              min-height: 100vh; 
              font-family: 'Lato', ui-sans-serif, system-ui, sans-serif; 
              -webkit-font-smoothing: antialiased; 
              margin: 0; 
            }
            h1, h2, h3, h4, h5, h6 { 
              font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; 
            }
            
            /* Hero background - responsive */
            .bg-hero {
              background-image: url('/images/richmond-station-view-375w.webp');
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            
            @media (min-width: 768px) {
              .bg-hero { background-image: url('/images/richmond-station-view-768w.webp'); }
            }
            
            @media (min-width: 1200px) {
              .bg-hero { background-image: url('/images/richmond-station-view-1200w.webp'); }
            }
            
            /* Navigation */
            nav {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 50;
              transition: all 0.3s;
            }
            
            /* Brand gradient */
            .gradient-brand {
              background: linear-gradient(135deg, rgb(38, 1, 1) 0%, rgb(115, 2, 2) 100%);
            }
            
            /* Utility classes for above-fold */
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .text-light { color: #f2f7ff; }
            .text-dark { color: #232326; }
            .glass { 
              backdrop-filter: blur(8px); 
              background-color: rgba(38, 1, 1, 0.2); 
              border-radius: 0.5rem; 
              padding: 2rem; 
            }
            
            @media (max-width: 768px) {
              .container { padding: 0 1rem; }
              .glass { padding: 1.5rem; }
            }
          `
        }} />
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; connect-src 'self' https://www.google-analytics.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; font-src 'self'; style-src 'self' 'unsafe-inline';`}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {analytics.gaMeasurementId ? (
          <GoogleAnalytics measurementId={analytics.gaMeasurementId} />
        ) : null}
        <Navigation />
        {children}
      </body>
    </html>
  );
}
