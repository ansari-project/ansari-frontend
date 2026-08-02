/**
 * Tests for UserService error surfacing (issue #74).
 *
 * Before this fix, updatePassword threw a hardcoded 'Failed to update password'
 * on ANY non-2xx, so the backend's password-policy message (backend PR #15)
 * never reached the reset-password screen. These tests pin that the server's
 * error body is parsed into the thrown ApplicationError, with the real status.
 * The confirmed contract is a flat-string `{ detail }`; the object/array
 * bodies here exercise the parser's compatibility hedging.
 */
import { ApplicationError } from '@/errors'
import { userService } from '../UserService'

const makeResponse = (status: number, body: unknown) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
})

describe('UserService error surfacing (issue #74)', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    global.fetch = jest.fn()
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('updatePassword surfaces the weak-password 400 message and suggestions', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue(
      makeResponse(400, {
        detail: { message: 'Password is too weak. Add uppercase letters.', suggestions: ['Use a longer password.'] },
      }),
    )

    const error = await userService.updatePassword('token', 'weak').catch((e) => e)
    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.message).toBe('Password is too weak. Add uppercase letters.\nUse a longer password.')
    expect(error.statusCode).toBe(400)
  })

  it('updatePassword renders 422 array details readably (never [object Object])', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue(
      makeResponse(422, {
        detail: [{ loc: ['body', 'new_password'], msg: 'String should have at most 128 characters' }],
      }),
    )

    const error = await userService.updatePassword('token', 'x'.repeat(129)).catch((e) => e)
    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.message).toBe('String should have at most 128 characters')
    expect(error.message).not.toContain('object Object')
    expect(error.statusCode).toBe(422)
  })

  it('updatePassword falls back when the error body is not JSON', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      status: 500,
      ok: false,
      json: async () => {
        throw new Error('not json')
      },
    })

    const error = await userService.updatePassword('token', 'password').catch((e) => e)
    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.message).toBe('Failed to update password')
  })

  it('requestPasswordReset surfaces the server error detail', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue(makeResponse(429, { detail: 'Too many requests' }))

    const error = await userService.requestPasswordReset('a@b.com').catch((e) => e)
    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.message).toBe('Too many requests')
    expect(error.statusCode).toBe(429)
  })
})
