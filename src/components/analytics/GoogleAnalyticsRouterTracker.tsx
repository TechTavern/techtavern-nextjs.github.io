"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Gtag = (...args: unknown[]) => void;

interface GoogleAnalyticsRouterTrackerProps {
  measurementId: string;
}

export default function GoogleAnalyticsRouterTracker({
  measurementId,
}: GoogleAnalyticsRouterTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Send a pageview on route changes. Disable the automatic one to avoid double counts.
  useEffect(() => {
    const search = searchParams?.toString();
    const page_path = `${pathname}${search ? `?${search}` : ""}`;

    const send = () => {
      const gtag = (window as Window & { gtag?: Gtag }).gtag;
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
    return undefined;
  }, [pathname, searchParams, measurementId]);

  return null;
}
