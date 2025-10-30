'use client';

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

type GoogleBookingButtonProps = {
  bookingLink: string;
  label: string;
};

type GoogleSchedulingButton = {
  load: (config: {
    url: string;
    label?: string;
    color?: string;
    target: HTMLElement;
  }) => void;
};

type GoogleWindow = Window & {
  google?: {
    calendar?: {
      schedulingButton?: GoogleSchedulingButton;
    };
  };
};

export default function GoogleBookingButton({
  bookingLink,
  label,
}: GoogleBookingButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderWidget = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const googleCalendar = (window as GoogleWindow).google?.calendar?.schedulingButton;

    if (!googleCalendar || !containerRef.current) {
      return;
    }

    googleCalendar.load({
      url: bookingLink,
      color: "#2D6AE0",
      label,
      target: containerRef.current,
    });
  }, [bookingLink, label]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  return (
    <>
      <Script
        src="https://calendar.google.com/calendar/scheduling-button-script.js"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef}>
        <button
          type="button"
          onClick={() => {
            if (typeof window === "undefined") {
              return;
            }
            window.open(bookingLink, "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg"
        >
          {label}
        </button>
      </div>
    </>
  );
}
