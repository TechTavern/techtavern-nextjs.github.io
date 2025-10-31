import { buildContentSecurityPolicy } from "./csp";

describe("buildContentSecurityPolicy", () => {
  it("includes required script hosts", () => {
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("https://www.googletagmanager.com");
    expect(csp).toContain("https://js-na2.hscollectedforms.net");
    expect(csp).toContain("https://js-na2.hs-banner.com");
    expect(csp).toContain("https://js-na2.hs-analytics.net");
    expect(csp).toContain("https://calendar.google.com");
    expect(csp).toContain("https://assets.calendly.com");
    expect(csp).toContain("https://static.hsappstatic.net");
  });

  it("includes connect hosts for HubSpot APIs", () => {
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("https://api-na2.hubspot.com");
    expect(csp).toContain("https://forms.hsforms.com");
    expect(csp).toContain("https://api.hsforms.com");
    expect(csp).toContain("https://forms-na2.hscollectedforms.net");
    expect(csp).toContain("https://calendar.google.com");
    expect(csp).toContain("https://calendly.com");
  });

  it("adds unsafe-eval when requested", () => {
    const csp = buildContentSecurityPolicy({ includeUnsafeEval: true });
    expect(csp).toContain("'unsafe-eval'");
  });

  it("omits unsafe-eval by default", () => {
    const csp = buildContentSecurityPolicy();
    expect(csp).not.toContain("'unsafe-eval'");
  });
});
