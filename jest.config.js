const nextJest = require('next/jest');

// Provide the path to the Next.js app to load next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Keep tests fast and focused; extend as needed
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);

