import { getEnv } from 'env'
import { MessageModel } from 'interfaces'

type MessageInput = {
  messages: MessageModel[]
}

const chatApiUrl = getEnv('API_URL')
let controller: AbortController

export const fetchMessagesStream = async (payload: MessageInput, timeout = getEnv('LOADING_MESSAGE_RESPONSE_TIMEOUT')) => {
  controller = new AbortController()
  const headers = {
    'Content-Type': 'application/json',
  }
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(chatApiUrl!, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))

  if (!response.ok || !response.body) {
    throw new Error(response.statusText)
  }

  return response.body
}

export { controller }
