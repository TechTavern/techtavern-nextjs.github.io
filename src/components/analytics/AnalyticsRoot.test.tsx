import React from "react";
import { render, screen } from "@testing-library/react";
import AnalyticsRoot from "./AnalyticsRoot";

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ id, children, ...props }: { id?: string; children?: React.ReactNode }) => (
    <script data-testid={id ? `script-${id}` : "script-loader"} {...props}>
      {children}
    </script>
  ),
}));

jest.mock("./GoogleAnalyticsRouterTracker", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./HubspotScript", () => ({
  __esModule: true,
  default: ({ portalId }: { portalId: string }) => (
    <div data-testid="hubspot-script" data-portal-id={portalId} />
  ),
}));

describe("AnalyticsRoot", () => {
  it("returns null when no analytics ids are provided", () => {
    const { container } = render(<AnalyticsRoot />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Google Analytics scripts when measurement id is provided", () => {
    render(<AnalyticsRoot measurementId="G-123" />);

    expect(screen.getByTestId("script-loader")).toHaveAttribute(
      "src",
      "https://www.googletagmanager.com/gtag/js?id=G-123"
    );
    expect(screen.getByTestId("script-google-analytics")).toBeInTheDocument();
  });

  it("renders Hubspot script when portal id is provided", () => {
    render(<AnalyticsRoot hubspotPortalId="244237198" />);

    expect(screen.getByTestId("hubspot-script")).toHaveAttribute(
      "data-portal-id",
      "244237198"
    );
  });
});
