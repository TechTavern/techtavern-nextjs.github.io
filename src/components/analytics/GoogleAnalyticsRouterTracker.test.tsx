import React from "react";
import { render, waitFor } from "@testing-library/react";
import GoogleAnalyticsRouterTracker from "./GoogleAnalyticsRouterTracker";

const mockUsePathname = jest.fn<string, []>();
const mockUseSearchParams = jest.fn<URLSearchParams | null, []>();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("GoogleAnalyticsRouterTracker", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/articles");
    mockUseSearchParams.mockReturnValue(new URLSearchParams("ref=hero"));
    document.title = "Articles | Tech Tavern";
  });

  it("sends pageview updates when gtag is available", async () => {
    const gtag = jest.fn();
    (window as typeof window & { gtag?: typeof gtag }).gtag = gtag;

    render(<GoogleAnalyticsRouterTracker measurementId="G-123" />);

    await waitFor(() => {
      expect(gtag).toHaveBeenCalledWith(
        "config",
        "G-123",
        expect.objectContaining({
          page_path: "/articles?ref=hero",
          page_title: "Articles | Tech Tavern",
        })
      );
    });
  });

  it("retries sending when gtag is not immediately available", async () => {
    jest.useFakeTimers();
    mockUseSearchParams.mockReturnValueOnce(null);
    delete (window as typeof window & { gtag?: jest.Mock }).gtag;

    render(<GoogleAnalyticsRouterTracker measurementId="G-456" />);

    const gtag = jest.fn();
    jest.advanceTimersByTime(250);
    (window as typeof window & { gtag?: typeof gtag }).gtag = gtag;
    jest.advanceTimersByTime(250);

    await waitFor(() => {
      expect(gtag).toHaveBeenCalledWith(
        "config",
        "G-456",
        expect.objectContaining({ page_path: "/articles" })
      );
    });

    jest.useRealTimers();
  });
});
