// Minimal jest setup for pure utility tests (transforms run through the project babel config).
// Component tests would additionally need the jest-expo preset.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
