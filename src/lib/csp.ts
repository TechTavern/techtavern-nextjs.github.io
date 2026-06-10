interface BuildCspOptions {
  includeUnsafeEval?: boolean;
}

const HUBSPOT_SCRIPT_HOSTS = [
  "https://js.hs-scripts.com",
  "https://js-na1.hs-scripts.com",
  "https://js-na2.hs-scripts.com",
  "https://js.hs-analytics.net",
  "https://js-na1.hs-analytics.net",
  "https://js-na2.hs-analytics.net",
  "https://js.hscollectedforms.net",
  "https://js-na1.hscollectedforms.net",
  "https://js-na2.hscollectedforms.net",
  "https://js.hs-banner.com",
  "https://js-na1.hs-banner.com",
  "https://js-na2.hs-banner.com",
];

const HUBSPOT_CONNECT_HOSTS = [
  "https://api-na1.hubspot.com",
  "https://api-na2.hubspot.com",
  "https://forms.hsforms.com",
  "https://api.hsforms.com",
  "https://track.hubspot.com",
  "https://track-na1.hubspot.com",
  "https://track-na2.hubspot.com",
  "https://forms.hscollectedforms.net",
  "https://forms-na1.hscollectedforms.net",
  "https://forms-na2.hscollectedforms.net",
];

const GOOGLE_BOOKING_HOST = "https://calendar.google.com";
const CALENDLY_SCRIPT_HOST = "https://assets.calendly.com";
const CALENDLY_APP_HOST = "https://calendly.com";
const HUBSPOT_MEETINGS_SCRIPT_HOST = "https://static.hsappstatic.net";
const HUBSPOT_MEETINGS_FRAME_HOST = "https://meetings.hubspot.com";

// DELIVERY LIMITATION: this policy is injected via <meta http-equiv> in
// src/app/layout.tsx because GitHub Pages cannot set HTTP response headers.
// Per the CSP spec, frame-ancestors, sandbox, and report-uri are IGNORED in
// meta-delivered policies, so clickjacking protection is not achievable on
// this host — they are deliberately omitted rather than silently broken.
export function buildContentSecurityPolicy({
  includeUnsafeEval = false,
}: BuildCspOptions = {}) {
  const scriptSrc = [
    "'self'",
    // ACCEPTED RISK: the GA bootstrap, JSON-LD blocks, and the Calendly/HubSpot
    // loaders all require inline scripts, and a static export cannot mint
    // nonces per-request. Removing this entry requires reworking every
    // third-party embed. Mitigation: all inline-interpolated values are
    // schema-validated in src/lib/env.ts.
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    GOOGLE_BOOKING_HOST,
    CALENDLY_SCRIPT_HOST,
    HUBSPOT_MEETINGS_SCRIPT_HOST,
    ...HUBSPOT_SCRIPT_HOSTS,
  ];

  if (includeUnsafeEval) {
    scriptSrc.push("'unsafe-eval'");
  }

  const connectSrc = [
    "'self'",
    "https://www.google-analytics.com",
    GOOGLE_BOOKING_HOST,
    CALENDLY_APP_HOST,
    ...HUBSPOT_CONNECT_HOSTS,
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "connect-src": connectSrc,
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'", CALENDLY_SCRIPT_HOST],
    "frame-src": [
      "'self'",
      "https://forms.hsforms.com",
      GOOGLE_BOOKING_HOST,
      CALENDLY_APP_HOST,
      HUBSPOT_MEETINGS_FRAME_HOST,
    ],
  };

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}
