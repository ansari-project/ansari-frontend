/**
 * Tests for ApiService.register/login error surfacing (issue #74).
 *
 * Before this fix, register did `error.detail || error.error || error.message`,
 * so an object detail (weak-password 400 from backend PR #15) or an array
 * detail (422 validation) rendered as `[object Object]` on the register screen.
 */
import { fetch } from 'expo/fetch'
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

const makeResponse = (status: number, body: unknown) =>
  ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  }) as unknown as Awaited<ReturnType<typeof fetch>>

const registerRequest = {
  email: 'a@b.com',
  password: 'weak',
  // eslint-disable-next-line camelcase
  first_name: 'A',
  // eslint-disable-next-line camelcase
  last_name: 'B',
  // eslint-disable-next-line camelcase
  register_to_mail_list: false,
}

describe('ApiService register/login error surfacing (issue #74)', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
  })

  it('register surfaces the weak-password 400 message and suggestions verbatim', async () => {
    mockedFetch.mockResolvedValue(
      makeResponse(400, {
        detail: { message: 'Password is too weak. Add uppercase letters.', suggestions: ['Use a passphrase.'] },
      }),
    )

    await expect(new ApiService().register(registerRequest)).rejects.toThrow(
      'Password is too weak. Add uppercase letters.\nUse a passphrase.',
    )
  })

  it('register renders 422 array details readably (never [object Object])', async () => {
    mockedFetch.mockResolvedValue(
      makeResponse(422, {
        detail: [{ loc: ['body', 'password'], msg: 'String should have at most 128 characters' }],
      }),
    )

    const error = await new ApiService().register(registerRequest).catch((e) => e)
    expect(error.message).toBe('String should have at most 128 characters')
    expect(error.message).not.toContain('object Object')
  })

  it('register falls back when the error body is not JSON', async () => {
    mockedFetch.mockResolvedValue({
      status: 500,
      ok: false,
      json: async () => {
        throw new Error('not json')
      },
    } as unknown as Awaited<ReturnType<typeof fetch>>)

    await expect(new ApiService().register(registerRequest)).rejects.toThrow('Registration failed')
  })

  it('login surfaces a string detail unchanged', async () => {
    mockedFetch.mockResolvedValue(makeResponse(401, { detail: 'Invalid username or password' }))

    await expect(new ApiService().login({ email: 'a@b.com', password: 'x' })).rejects.toThrow(
      'Invalid username or password',
    )
  })
})
