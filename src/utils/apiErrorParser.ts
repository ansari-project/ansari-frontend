/**
 * Turns a backend error-response body into a human-readable message.
 *
 * Current contract (confirmed on iaser-ai/ansari PR #15): every error body
 * from the auth routes is a flat string detail — `{ detail: 'Password is too
 * weak. ...' }` — including password-policy 400s and length 422s.
 *
 * The remaining shapes are compatibility hedging, not the contract; framework
 * defaults could reintroduce them and they must degrade readably:
 * - `{ detail: { message, suggestions } }` — structured policy errors
 *   (message rendered verbatim, suggestions appended)
 * - `{ detail: [{ msg | message, ... }] }` — FastAPI/Zod-style issue arrays
 * - `{ error: '...' }` / `{ message: '...' }` — legacy shapes
 *
 * Anything unrecognized falls back to the provided default so the user never
 * sees `[object Object]`.
 */
const extractApiErrorMessage = (body: unknown, fallback: string): string => {
  const fromDetail = (detail: unknown): string | null => {
    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (typeof item === 'string') return item
          if (item && typeof item === 'object') {
            const record = item as Record<string, unknown>
            if (typeof record.msg === 'string') return record.msg
            if (typeof record.message === 'string') return record.message
          }
          return null
        })
        .filter((message): message is string => Boolean(message))
      return messages.length > 0 ? messages.join('\n') : null
    }

    if (detail && typeof detail === 'object') {
      const record = detail as Record<string, unknown>
      if (typeof record.message === 'string' && record.message.trim().length > 0) {
        const suggestions = Array.isArray(record.suggestions)
          ? record.suggestions.filter((suggestion): suggestion is string => typeof suggestion === 'string')
          : []
        return [record.message, ...suggestions].join('\n')
      }
    }

    return null
  }

  if (typeof body === 'string' && body.trim().length > 0) {
    return body
  }

  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    for (const key of ['detail', 'error', 'message']) {
      const message = fromDetail(record[key])
      if (message) return message
    }
  }

  return fallback
}

export default extractApiErrorMessage
