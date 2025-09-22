const nextJest = require('next/jest');

// Provide the path to the Next.js app to load next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  // Use explicit patterns compatible with Jest 30
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Keep tests fast and focused; extend as needed
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    'src/app/sitemap.ts',
    'src/app/rss.xml/route.ts',
    'src/app/robots.ts',
    '!src/lib/**/*.d.ts',
    '!src/lib/**/_*.{ts,tsx}',
    '!src/lib/**/*.test.{ts,tsx}',
    '!src/lib/variants.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      statements: 60,
      lines: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
