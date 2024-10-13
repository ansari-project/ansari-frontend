import ApplicationError from './ApplicationError'

/**
 * NotFoundError represents an HTTP 404 error, indicating that the requested resource
 * was not found on the server. This can be used when a resource does not exist or
 * if there was an attempt to fetch data that is not available.
 */
class NotFoundError extends ApplicationError {
  constructor(message: string = 'Not Found') {
    super(message, 404)
  }
}

export default NotFoundError
