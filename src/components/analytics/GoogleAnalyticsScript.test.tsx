import React from "react";
import { render, screen } from "@testing-library/react";
import GoogleAnalyticsScript from "./GoogleAnalyticsScript";

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ id, children, ...props }: { id?: string; children?: React.ReactNode }) => (
    <script data-testid={id ? `script-${id}` : "script-loader"} {...props}>
      {children}
    </script>
  ),
}));

describe("GoogleAnalyticsScript", () => {
  it("renders loader and inline config scripts", () => {
    render(<GoogleAnalyticsScript measurementId="G-123" />);

    expect(screen.getByTestId("script-loader")).toHaveAttribute(
      "src",
      "https://www.googletagmanager.com/gtag/js?id=G-123"
    );
    expect(screen.getByTestId("script-google-analytics")).toBeInTheDocument();
  });
});
