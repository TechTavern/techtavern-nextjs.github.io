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

export function buildContentSecurityPolicy({
  includeUnsafeEval = false,
}: BuildCspOptions = {}) {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    ...HUBSPOT_SCRIPT_HOSTS,
  ];

  if (includeUnsafeEval) {
    scriptSrc.push("'unsafe-eval'");
  }

  const connectSrc = [
    "'self'",
    "https://www.google-analytics.com",
    ...HUBSPOT_CONNECT_HOSTS,
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "connect-src": connectSrc,
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "frame-src": ["'self'", "https://forms.hsforms.com"],
  };

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}
