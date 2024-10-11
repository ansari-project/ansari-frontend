import ApplicationError from './ApplicationError'

/**
 * Represents an error related to failing token refresh operations.
 *
 * This custom error class extends the generic ApplicationError to provide
 * a specific error type for token refresh failures. It's used when a refresh
 * token is invalid, expired, or when the server encounters an issue that
 * prevents issuing a new access token.
 *
 * @extends ApplicationError
 */
class TokenRefreshError extends ApplicationError {
  /**
   * Constructs a new TokenRefreshError instance.
   *
   * @param {string} message - The error message. Defaults to "Token refresh failed"
   *                           to indicate a general token refresh failure.
   * @param {number} statusCode - The HTTP status code associated with the error.
   *                              Set to 401 Unauthorized to indicate that the
   *                              request has not been applied because it lacks
   *                              valid authentication credentials for the target
   *                              resource. This status code is used here to
   *                              suggest that the client needs to re-authenticate
   *                              (e.g., by logging in or obtaining a new token).
   */
  constructor(message: string = 'Token refresh failed') {
    super(message, 401) // Use 401 Unauthorized to indicate authentication issues.
  }
}

// Export the TokenRefreshError class for use throughout the application.
export default TokenRefreshError
