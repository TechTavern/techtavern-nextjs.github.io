'use client';

import { useCallback } from "react";
import Script from "next/script";

import type { BookingButtonProps } from "./types";

const HUBSPOT_SCRIPT_SRC = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

type HubSpotWindow = Window & {
  hbspt?: {
    meetings?: {
      create: (config: { embedCode: string; target: string }) => void;
    };
  };
};

export default function HubSpotBookingButton({
  bookingLink,
  label,
  color,
  className,
}: BookingButtonProps) {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const hubspotMeetings = (window as HubSpotWindow).hbspt?.meetings;

    if (hubspotMeetings?.create) {
      // Render the HubSpot meetings widget into an ephemeral container.
      const containerId = "hubspot-meetings-container";
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
      }
      // Percent-encode quotes so the URL cannot break out of the data-src
      // attribute in the HTML string HubSpot injects via innerHTML.
      const safeBookingSrc = bookingLink.replace(/"/g, '%22').replace(/'/g, '%27');
      hubspotMeetings.create({
        embedCode: `<div class="meetings-iframe-container" data-src="${safeBookingSrc}"></div>`,
        target: `#${containerId}`,
      });
      return;
    }

    window.open(bookingLink, "_blank", "noopener,noreferrer");
  }, [bookingLink]);

  return (
    <>
      <Script src={HUBSPOT_SCRIPT_SRC} strategy="afterInteractive" />
      <button
        type="button"
        onClick={handleClick}
        className={className}
        style={color ? { backgroundColor: color } : undefined}
      >
        {label}
      </button>
    </>
  );
}
