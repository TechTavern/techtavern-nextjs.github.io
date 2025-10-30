import Script from "next/script";

interface GoogleAnalyticsScriptProps {
  measurementId: string;
}

export default function GoogleAnalyticsScript({
  measurementId,
}: GoogleAnalyticsScriptProps) {
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
