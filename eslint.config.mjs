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
      "specs/**",
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
];

export default eslintConfig;
