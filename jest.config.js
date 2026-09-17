module.exports = {
  preset: 'jest-expo',
  // Playwright specs live in e2e/ and run via `npm run test:e2e`
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
