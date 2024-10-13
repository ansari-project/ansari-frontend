/**
 * ApplicationError extends the built-in Error class to provide custom error handling.
 */
class ApplicationError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApplicationError
