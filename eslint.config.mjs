import { createRequire } from "module";
const require = createRequire(import.meta.url);

const nextConfig = require("eslint-config-next");

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "coverage/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "techtavern.github.io/**",
    ],
  },
  ...nextConfig,
  // Allow CommonJS in tooling scripts and Jest config
  {
    files: ["**/*.js", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // Site addresses: pages and components must build hrefs and absolute URLs
  // through `siteAddress` (src/lib/site.server.ts), never by hand.
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.name='env'][property.name=/^(SITE_URL|NEXT_PUBLIC_BASE_PATH)$/]",
          message: "Use siteAddress from '@/lib/site.server' instead of reading SITE_URL/basePath directly.",
        },
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env'][property.name=/^(SITE_URL|NEXT_PUBLIC_BASE_PATH)$/]",
          message: "Use siteAddress from '@/lib/site.server' instead of reading SITE_URL/basePath directly.",
        },
        {
          selector: "NewExpression[callee.name='URL'][arguments.length=2]",
          message: "Use siteAddress.absoluteUrl(path) instead of resolving URLs by hand.",
        },
        {
          selector: "TemplateLiteral > MemberExpression[property.name='baseUrl']",
          message: "Use siteAddress.absoluteUrl(path) instead of concatenating onto baseUrl.",
        },
      ],
    },
  },
];

export default eslintConfig;
