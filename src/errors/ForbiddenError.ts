import ApplicationError from './ApplicationError'

/**
 * ForbiddenError represents an HTTP 403 error, indicating that the request was valid
 * but the server is refusing action. The user might not have the necessary permissions
 * for a resource, or may need an account of some sort.
 */
class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export default ForbiddenError
