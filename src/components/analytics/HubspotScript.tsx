import Script from "next/script";

interface HubspotScriptProps {
  portalId: string;
}

export default function HubspotScript({ portalId }: HubspotScriptProps) {
  return (
    <Script
      id="hs-script-loader"
      async
      defer
      strategy="afterInteractive"
      src={`https://js-na2.hs-scripts.com/${portalId}.js`}
    />
  );
}
