'use client';

import { useCallback, useEffect } from "react";
import Script from "next/script";

import type { BookingButtonProps } from "./types";

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_STYLESHEET_HREF = "https://assets.calendly.com/assets/external/widget.css";
const STYLESHEET_ID = "calendly-widget-stylesheet";

type CalendlyWindow = Window & {
  Calendly?: {
    initPopupWidget: (config: { url: string }) => void;
  };
};

function ensureCalendlyStylesheet() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLESHEET_ID)) return;

  const existing = document.querySelector<HTMLLinkElement>(`link[href="${CALENDLY_STYLESHEET_HREF}"]`);
  if (existing) {
    existing.id = STYLESHEET_ID;
    return;
  }

  const link = document.createElement("link");
  link.id = STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = CALENDLY_STYLESHEET_HREF;
  document.head.appendChild(link);
}

export default function CalendlyBookingButton({
  bookingLink,
  label,
  color,
  className,
}: BookingButtonProps) {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const calendly = (window as CalendlyWindow).Calendly;
    if (calendly?.initPopupWidget) {
      calendly.initPopupWidget({ url: bookingLink });
      return;
    }
    window.open(bookingLink, "_blank", "noopener,noreferrer");
  }, [bookingLink]);

  useEffect(() => {
    ensureCalendlyStylesheet();
  }, []);

  return (
    <>
      <Script src={CALENDLY_SCRIPT_SRC} strategy="afterInteractive" />
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
