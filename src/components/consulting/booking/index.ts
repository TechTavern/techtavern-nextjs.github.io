import type { ReactElement } from "react";
import GoogleBookingButton from "./GoogleBookingButton";
import CalendlyBookingButton from "./CalendlyBookingButton";
import HubSpotBookingButton from "./HubSpotBookingButton";
import type { BookingButtonProps } from "./types";
export type { BookingButtonProps } from "./types";
import type { BookingComponentId, BookingProvider } from "@/lib/profiles";

export type BookingComponentType = (props: BookingButtonProps) => ReactElement;

const DEFAULT_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg";

const PROVIDER_COMPONENT_MAP: Record<BookingProvider, BookingComponentType> = {
  "google-booking": GoogleBookingButton,
  calendly: CalendlyBookingButton,
  hubspot: HubSpotBookingButton,
};

const COMPONENT_ID_MAP: Record<BookingComponentId, BookingComponentType> = {
  GoogleBookingButton,
  CalendlyBookingButton,
  HubSpotBookingButton,
};

export function resolveBookingComponent(
  provider: BookingProvider,
  componentId?: BookingComponentId,
): BookingComponentType | null {
  if (componentId) {
    return COMPONENT_ID_MAP[componentId] ?? null;
  }
  return PROVIDER_COMPONENT_MAP[provider] ?? null;
}

export function buildBookingButtonProps(
  props: Omit<BookingButtonProps, "className">,
): BookingButtonProps {
  return {
    ...props,
    className: DEFAULT_BUTTON_CLASSES,
  };
}
