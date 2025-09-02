"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Send a pageview on route changes. Disable the automatic one to avoid double counts.
  useEffect(() => {
    const search = searchParams?.toString();
    const page_path = `${pathname}${search ? `?${search}` : ""}`;

    const send = () => {
      const gtag = (window as any).gtag as ((...args: any[]) => void) | undefined;
      if (!gtag) return false;
      gtag("config", measurementId, {
        page_path,
        page_title: document.title,
        page_location: window.location.href,
      });
      return true;
    };

    // Try immediately, then retry briefly if gtag isn't ready yet
    if (!send()) {
      const id = window.setInterval(() => {
        if (send()) window.clearInterval(id);
      }, 250);
      const timeout = window.setTimeout(() => window.clearInterval(id), 5000);
      return () => {
        window.clearInterval(id);
        window.clearTimeout(timeout);
      };
    }
  }, [pathname, searchParams, measurementId]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Disable automatic page view to prevent double-counting in SPA
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
