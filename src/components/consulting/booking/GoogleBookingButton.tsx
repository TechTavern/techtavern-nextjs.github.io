'use client';

import type { BookingButtonProps } from "./types";

export default function GoogleBookingButton({
  bookingLink,
  label,
  color,
  className,
}: BookingButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.open(bookingLink, "_blank", "noopener,noreferrer");
        }
      }}
      className={className}
      style={color ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  );
}
