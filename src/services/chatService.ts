import { ApplicationError, NotFoundError } from '../errors'
import { AddMessageRequest, Message, Thread, ThreadNameRequest } from '../store/types/chatTypes'
import { Helpers } from '../utils'

class ChatService {
  token: string | null
  isAuthenticated: boolean
  API_URL: string | undefined

  constructor(isAuthenticated: boolean, token: string | null) {
    this.isAuthenticated = isAuthenticated
    this.token = token
    this.API_URL = process.env.REACT_APP_API_V2_URL
  }

  private createHeaders = () => {
    if (!this.isAuthenticated || !this.token) throw new Error('Authentication token not found')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'X-Mobile-Ansari': 'ANSARI',
    }
  }

  async createThread(): Promise<Thread> {
    const response = await fetch(`${this.API_URL}/threads`, {
      method: 'POST',
      headers: this.createHeaders(),
    })
    if (!response.ok) {
      throw new Error('Error creating thread')
    }

    const data = await response.json()

    // The API returns { thread_id: 1 } and we need to convert it to the Thread type
    // No messages are returned in the creation response, so initializing with an empty array
    const thread: Thread = {
      id: String(data.thread_id), // Convert thread_id to a string to match the Thread interface
      name: 'New chat', // Initialize with 'New chat' since the API response doesn't include name
      messages: [], // Initialize with an empty array since the API response doesn't include messages
      date: new Date(),
    }

    return thread
  }

  async addMessage(threadId: string, message: AddMessageRequest, signal: AbortSignal) {
    const response = await fetch(`${this.API_URL}/threads/${threadId}`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(message),
      signal: signal, // Pass the signal for cancellation
    })
    if (!response.ok) {
      throw new Error('Error adding message')
    }
    // Handling stream response
    return response.body
  }

  async getThread(threadId: string): Promise<Thread> {
    const response = await fetch(`${this.API_URL}/threads/${threadId}`, {
      headers: this.createHeaders(),
    })
    if (!response.ok) {
      throw new ApplicationError('Error fetching thread ' + threadId)
    }
    const data = await response.json()

    if (Helpers.isBlank(data)) {
      throw new NotFoundError('Unable to load thread ' + threadId)
    } else {
      // The API returns { thread_id: 1 } and we need to convert it to the Thread type
      // No messages are returned in the creation response, so initializing with an empty array
      const thread: Thread = {
        id: String(threadId), // Convert thread_id to a string to match the Thread interface
        name: data.thread_name ?? 'New chat', // Initialize with 'New chat' since the API response doesn't include name
        messages: data.messages, // Initialize with an empty array since the API response doesn't include messages
      }
      return thread
    }
  }

  async getAllThreads(): Promise<Thread[]> {
    const response = await fetch(`${this.API_URL}/threads`, {
      headers: this.createHeaders(),
    })
    if (!response.ok) {
      throw new Error('Error fetching all threads')
    }
    const rawThreads = await response.json()

    // Convert rawThreads to an array of Thread objects
    type RawThread = {
      thread_id: number
      thread_name?: string | null
      updated_at?: string
      messages?: Message[]
    }
    const threads: Thread[] = rawThreads.map((rawThread: RawThread) => {
      return {
        id: String(rawThread.thread_id),
        name: rawThread.thread_name || 'New chat',
        messages: rawThread.messages || [],
        date: rawThread.updated_at ? new Date(rawThread.updated_at).toISOString() : undefined,
      }
    })
    return threads
  }

  async deleteThread(threadId: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/threads/${threadId}`, {
      method: 'DELETE',
      headers: this.createHeaders(),
    })
    if (!response.ok) {
      throw new Error('Error deleting thread')
    }
  }

  async setThreadName(threadId: string, name: ThreadNameRequest): Promise<void> {
    const response = await fetch(`${this.API_URL}/threads/${threadId}/name`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(name),
    })
    if (!response.ok) {
      throw new Error('Error setting thread name')
    }
  }
}

export default ChatService
