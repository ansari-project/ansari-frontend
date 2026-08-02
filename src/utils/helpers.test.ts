/**
 * Guest auto-registration credentials vs. the hardened password policy
 * (issue #74 / backend PR #15: strength score >= 3, max length 128).
 *
 * Guest passwords are random 12-char strings guaranteed to contain an
 * uppercase letter, a digit, and a symbol. This test pins those guarantees so
 * a future tweak to generateGuestCredentials can't silently produce passwords
 * the backend now rejects.
 */
import Helpers from './helpers'

describe('generateGuestCredentials password policy (issue #74)', () => {
  it('always yields 12-char passwords with uppercase, digit, and symbol', () => {
    for (let i = 0; i < 200; i++) {
      const { email, password } = Helpers.generateGuestCredentials()
      expect(password).toHaveLength(12)
      expect(password.length).toBeLessThanOrEqual(128)
      expect(password).toMatch(/[A-Z]/)
      expect(password).toMatch(/[0-9]/)
      expect(password).toMatch(/[!@#$%^&*(){}|<>?]/)
      expect(email).toMatch(/^guest_[a-zA-Z0-9]{10}@ansari\.chat$/)
    }
  })
})
