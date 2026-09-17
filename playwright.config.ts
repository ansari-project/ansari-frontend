import { defineConfig, devices } from '@playwright/test'

const PORT = 8099
const BASE_URL = `http://localhost:${PORT}`

/**
 * End-to-end tests run against a production web export served as a static SPA.
 * The API base URL points at the same origin so tests can intercept every backend
 * route with page.route() (no CORS, no real backend, fully deterministic).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    locale: 'en-US',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx expo export --platform web --clear --output-dir dist-e2e && npx serve -s dist-e2e -l ${PORT} --no-clipboard`,
    url: BASE_URL,
    timeout: 300_000,
    // Always rebuild: a reused server could serve a stale bundle and mask a regression.
    reuseExistingServer: false,
    env: {
      EXPO_PUBLIC_API_V2_URL: `${BASE_URL}/api/v2`,
      EXPO_PUBLIC_ENABLE_SHARE: 'false',
    },
  },
})
