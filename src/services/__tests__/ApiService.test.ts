/**
 * Regression test for issue #69 — concurrent token-refresh race logs users out.
 *
 * When the access token expires and the user returns to an idle tab, the app
 * fires several requests at once. Each gets a 401 and previously triggered its
 * own POST /users/refresh_token. Because the backend rotates the refresh token,
 * the first refresh succeeded and the rest got 401 "Refresh token not found",
 * which cleared tokens + reset auth → forced logout.
 *
 * The fix adds a module-level single-flight: all concurrent 401s await one
 * shared refresh. These tests fire concurrent requests through SEPARATE
 * ApiService instances (mirroring how ChatService/chatActions/authActions each
 * create `new ApiService()`), so they fail if the dedup is instance-scoped or
 * removed entirely. Each request passes its OWN callbacks, so the tests also
 * pin that every caller applies the shared result (not just the one that won
 * the refresh race).
 */
import { fetch } from 'expo/fetch'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ApiService from '../ApiService'

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }))
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}))

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

const makeResponse = (status: number, body: unknown) =>
  ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  }) as unknown as Awaited<ReturnType<typeof fetch>>

const PROTECTED_URLS = ['threads', 'me', 'state'].map((p) => `https://api.test/${p}`)

// One distinct callback pair per concurrent request, mirroring heterogeneous
// callers (e.g. Redux dispatch vs. loadAuthState mutating local variables).
const makeCallers = () => PROTECTED_URLS.map(() => ({ reset: jest.fn(), refreshCb: jest.fn() }))

const fireConcurrentRequests = (callers: ReturnType<typeof makeCallers>) =>
  // A fresh ApiService per request — exactly how the app instantiates them.
  Promise.all(
    PROTECTED_URLS.map((url, i) =>
      new ApiService().fetchWithAuthRetry(url, { headers: {} }, callers[i].reset, callers[i].refreshCb),
    ),
  )

describe('ApiService concurrent token refresh (issue #69)', () => {
  let refreshCount: number

  beforeEach(() => {
    refreshCount = 0
    mockedFetch.mockReset()
    mockedAsyncStorage.getItem.mockResolvedValue('stored-refresh-token')
    mockedAsyncStorage.setItem.mockResolvedValue(undefined)
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined)
  })

  it('dedupes concurrent 401s into one /refresh_token call while each caller updates its own state', async () => {
    mockedFetch.mockImplementation(async (url, options: any = {}) => {
      if (String(url).includes('/users/refresh_token')) {
        refreshCount += 1
        return makeResponse(200, { status: 'success', access_token: 'new-access', refresh_token: 'new-refresh' })
      }
      // The retried original request carries skipRefresh + the new bearer token.
      if (options.skipRefresh) return makeResponse(200, { ok: true })
      // First hit on a protected endpoint: access token has expired.
      return makeResponse(401, { detail: 'token expired' })
    })

    const callers = makeCallers()
    const responses = await fireConcurrentRequests(callers)

    // Single-flight: only ONE refresh hit the backend despite 3 concurrent 401s.
    expect(refreshCount).toBe(1)
    // Every original request succeeded on retry, and the user was NOT logged out.
    responses.forEach((r) => expect(r.status).toBe(200))
    callers.forEach((c) => {
      // Each caller applied the shared result via its OWN callback.
      expect(c.refreshCb).toHaveBeenCalledTimes(1)
      expect(c.refreshCb).toHaveBeenCalledWith(expect.objectContaining({ access_token: 'new-access' }))
      expect(c.reset).not.toHaveBeenCalled()
    })
  })

  it('on refresh failure, resets each caller once and returns the original 401 to each', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockedFetch.mockImplementation(async (url, options: any = {}) => {
      if (String(url).includes('/users/refresh_token')) {
        refreshCount += 1
        return makeResponse(401, { detail: 'Refresh token not found' })
      }
      if (options.skipRefresh) return makeResponse(200, { ok: true })
      return makeResponse(401, { detail: 'token expired' })
    })

    const callers = makeCallers()
    const responses = await fireConcurrentRequests(callers)

    // Still a single refresh attempt shared by all callers...
    expect(refreshCount).toBe(1)
    // ...the original 401 is surfaced to each caller...
    responses.forEach((r) => expect(r.status).toBe(401))
    callers.forEach((c) => {
      // ...and each caller resets its own auth exactly once (no token update).
      expect(c.reset).toHaveBeenCalledTimes(1)
      expect(c.refreshCb).not.toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })
})
