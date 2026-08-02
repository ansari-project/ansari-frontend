/**
 * Tests for extractApiErrorMessage (issue #74).
 *
 * Backend PR #15 (auth hardening) introduces error bodies the frontend never
 * handled: weak-password 400s with `{detail: {message, suggestions}}` and
 * validation 422s with an array detail. These tests pin that every known shape
 * produces a readable message — and never `[object Object]`.
 */
import extractApiErrorMessage from './apiErrorParser'

const FALLBACK = 'Something failed'

describe('extractApiErrorMessage', () => {
  it('returns a plain string detail verbatim', () => {
    expect(extractApiErrorMessage({ detail: 'Account not found' }, FALLBACK)).toBe('Account not found')
  })

  it('renders weak-password 400 message with suggestions appended', () => {
    const body = {
      detail: {
        message: 'Password is too weak. Add uppercase letters, numbers, or symbols.',
        suggestions: ['Add another word or two.', 'Avoid common passwords.'],
      },
    }
    expect(extractApiErrorMessage(body, FALLBACK)).toBe(
      'Password is too weak. Add uppercase letters, numbers, or symbols.\n' +
        'Add another word or two.\nAvoid common passwords.',
    )
  })

  it('renders a detail object with message but no suggestions', () => {
    expect(extractApiErrorMessage({ detail: { message: 'Password is too weak.' } }, FALLBACK)).toBe(
      'Password is too weak.',
    )
  })

  it('renders 422 array details (msg field, FastAPI style)', () => {
    const body = {
      detail: [{ type: 'string_too_long', loc: ['body', 'password'], msg: 'String should have at most 128 characters' }],
    }
    expect(extractApiErrorMessage(body, FALLBACK)).toBe('String should have at most 128 characters')
  })

  it('renders 422 array details (message field, Zod style) and joins multiple issues', () => {
    const body = {
      detail: [
        { code: 'too_big', path: ['password'], message: 'Password must be at most 128 characters' },
        { code: 'invalid_string', path: ['email'], message: 'Invalid email' },
      ],
    }
    expect(extractApiErrorMessage(body, FALLBACK)).toBe(
      'Password must be at most 128 characters\nInvalid email',
    )
  })

  it('supports legacy error/message keys and plain string bodies', () => {
    expect(extractApiErrorMessage({ error: 'Bad request' }, FALLBACK)).toBe('Bad request')
    expect(extractApiErrorMessage({ message: 'Nope' }, FALLBACK)).toBe('Nope')
    expect(extractApiErrorMessage('Plain failure', FALLBACK)).toBe('Plain failure')
  })

  it('falls back on unrecognized shapes instead of stringifying objects', () => {
    const unrecognized = [null, undefined, {}, { detail: {} }, { detail: [{ loc: ['body'] }] }, { detail: 42 }, '']
    unrecognized.forEach((body) => {
      const message = extractApiErrorMessage(body, FALLBACK)
      expect(message).toBe(FALLBACK)
      expect(message).not.toContain('object Object')
    })
  })
})
