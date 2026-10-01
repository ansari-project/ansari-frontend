import { Message, Thread, UserRole } from '@/store/types/chatTypes'
import { keepSessionImages, toMessages } from './messageImages'

const user = (id: string, extra: Partial<Message> = {}): Message => ({ id, role: UserRole.User, content: id, ...extra })
const assistant = (id: string): Message => ({ id, role: UserRole.Assistant, content: id })

describe('toMessages', () => {
  it('maps image_count to imageCount and leaves other messages unchanged', () => {
    // eslint-disable-next-line camelcase
    const result = toMessages([{ id: '1', role: UserRole.User, content: 'hi', image_count: 2 }, assistant('2')])
    expect(result).toEqual([{ id: '1', role: UserRole.User, content: 'hi', imageCount: 2 }, assistant('2')])
  })

  it('handles a missing message list', () => {
    expect(toMessages(undefined)).toEqual([])
  })
})

describe('keepSessionImages', () => {
  const previous: Thread = {
    id: 't1',
    messages: [user('local-1', { images: ['data:a'], imageCount: 1 }), assistant('local-2'), user('local-3')],
  }

  it('restores session images onto the matching fetched user messages', () => {
    const fetched: Thread = {
      id: 't1',
      messages: [user('server-1', { imageCount: 1 }), assistant('server-2'), user('server-3')],
    }
    const result = keepSessionImages(previous, fetched)
    expect(result.messages[0]).toEqual(user('server-1', { imageCount: 1, images: ['data:a'] }))
    expect(result.messages[2]).toEqual(user('server-3'))
  })

  it('returns the fetched thread untouched for a different thread', () => {
    const fetched: Thread = { id: 't2', messages: [user('server-1', { imageCount: 1 })] }
    expect(keepSessionImages(previous, fetched)).toBe(fetched)
  })

  it('does not guess when the user messages do not line up', () => {
    const fetched: Thread = { id: 't1', messages: [user('server-1', { imageCount: 1 })] }
    expect(keepSessionImages(previous, fetched)).toBe(fetched)
  })

  it('does not attach images to a message the backend says had none', () => {
    const fetched: Thread = { id: 't1', messages: [user('server-1'), assistant('server-2'), user('server-3')] }
    expect(keepSessionImages(previous, fetched).messages[0]).toEqual(user('server-1'))
  })
})
