import { Suspense } from "react";
import GoogleAnalyticsRouterTracker from "./GoogleAnalyticsRouterTracker";
import GoogleAnalyticsScript from "./GoogleAnalyticsScript";
import HubspotScript from "./HubspotScript";

interface AnalyticsRootProps {
  measurementId?: string;
  hubspotPortalId?: string;
}

export default function AnalyticsRoot({
  measurementId,
  hubspotPortalId,
}: AnalyticsRootProps) {
  if (!measurementId && !hubspotPortalId) {
    return null;
  }

  return (
    <>
      {measurementId ? (
        <>
          <GoogleAnalyticsScript measurementId={measurementId} />
          <Suspense fallback={null}>
            <GoogleAnalyticsRouterTracker measurementId={measurementId} />
          </Suspense>
        </>
      ) : null}
      {hubspotPortalId ? (
        <HubspotScript portalId={hubspotPortalId} />
      ) : null}
    </>
  );
}
