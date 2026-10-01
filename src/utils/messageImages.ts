import { Message, Thread, UserRole } from '@/store/types/chatTypes'

/**
 * A message as returned by the backend's thread endpoints.
 */
export interface ApiMessage extends Omit<Message, 'imageCount'> {
  // eslint-disable-next-line camelcase
  image_count?: number
}

/**
 * Converts messages returned by the backend into the app's Message type.
 *
 * @param apiMessages - The messages returned by the backend.
 * @returns The converted messages.
 */
export const toMessages = (apiMessages: ApiMessage[] | undefined): Message[] =>
  (apiMessages ?? []).map(({ image_count: imageCount, ...message }) =>
    imageCount ? { ...message, imageCount } : message,
  )

/**
 * Copies images attached in this session onto the matching messages of a freshly fetched thread.
 * The backend does not store images, so without this they would disappear as soon as the thread is re-fetched.
 *
 * @param previous - The thread currently in the store.
 * @param fetched - The thread returned by the backend.
 * @returns The fetched thread, with session images restored where the user messages line up.
 */
export const keepSessionImages = (previous: Thread | null, fetched: Thread): Thread => {
  if (!previous || previous.id !== fetched.id || !previous.messages.some((m) => m.images?.length)) {
    return fetched
  }

  const previousUserMessages = previous.messages.filter((m) => m.role === UserRole.User)
  const fetchedUserMessages = fetched.messages.filter((m) => m.role === UserRole.User)
  if (previousUserMessages.length !== fetchedUserMessages.length) {
    return fetched
  }

  let userIndex = 0
  const messages = fetched.messages.map((message) => {
    if (message.role !== UserRole.User) return message

    const images = previousUserMessages[userIndex++].images
    return images?.length && images.length === message.imageCount ? { ...message, images } : message
  })
  return { ...fetched, messages }
}
