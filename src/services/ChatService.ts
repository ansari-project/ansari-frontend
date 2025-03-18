import { ApplicationError, NotFoundError } from '@/errors'
import { AddMessageRequest, FeedbackClass, Message, Thread, ThreadNameRequest } from '@/store'
import { RefreshTokenResponse, ShareThreadResponse } from '@/types'
import { Helpers } from '@/utils'
import { Dispatch, UnknownAction } from 'redux'
import ApiService from './ApiService'
import { resetAuth, refreshTokens } from '@/store/slices/authSlice'

class ChatService {
  accessToken: string | null
  isAuthenticated: boolean
  baseURL: string | undefined
  apiService: ApiService

  constructor(isAuthenticated: boolean, accessToken: string | null) {
    this.isAuthenticated = isAuthenticated
    this.accessToken = accessToken
    this.baseURL = process.env.EXPO_PUBLIC_API_V2_URL
    this.apiService = new ApiService()
  }

  private createHeaders = () => {
    if (!this.isAuthenticated || !this.accessToken) throw new ApplicationError('Authentication token not found')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }
  }

  async fetchWithAuthRetry(url: string, options: RequestInit, dispatch: Dispatch<UnknownAction>) {
    const response = await this.apiService.fetchWithAuthRetry(
      url,
      options,
      () => {
        dispatch(resetAuth())
      },
      (tokens: RefreshTokenResponse) => {
        dispatch(refreshTokens(tokens))
      },
    )

    return response
  }

  async createThread(dispatch: Dispatch<UnknownAction>): Promise<Thread> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads`,
      {
        method: 'POST',
        headers: this.createHeaders(),
      },
      dispatch,
    )
    if (!response.ok) {
      throw new Error('Error creating thread')
    }

    const data = await response.json()

    // The API returns { thread_id: 1 } and we need to convert it to the Thread type
    // No messages are returned in the creation response, so initializing with an empty array
    const thread: Thread = {
      id: String(data.thread_id), // Convert thread_id to a string to match the Thread interface
      name: null, // API response doesn't include name
      messages: [], // Initialize with an empty array since the API response doesn't include messages
      date: new Date(),
    }

    return thread
  }

  async addMessage(
    threadId: string,
    message: AddMessageRequest,
    signal: AbortSignal,
    dispatch: Dispatch<UnknownAction>,
  ) {
    const headers: any = this.createHeaders()
    headers['Accept'] = 'text/event-stream'

    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads/${threadId}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
        signal: signal, // Pass the signal for cancellation
      },
      dispatch,
    )
    if (!response.ok) {
      throw new Error('Error adding message')
    }
    // Handling stream response
    return response.body
  }

  async getThread(threadId: string, dispatch: Dispatch<UnknownAction>): Promise<Thread> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads/${threadId}`,
      {
        headers: this.createHeaders(),
      },
      dispatch,
    )
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
        name: data.thread_name ?? null, // API response doesn't include name
        messages: data.messages, // Initialize with an empty array since the API response doesn't include messages
      }
      return thread
    }
  }

  async getAllThreads(dispatch: Dispatch<UnknownAction>): Promise<Thread[]> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads`,
      {
        headers: this.createHeaders(),
      },
      dispatch,
    )
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
        name: rawThread.thread_name || null,
        messages: rawThread.messages || [],
        date: rawThread.updated_at ? new Date(rawThread.updated_at).toISOString() : undefined,
      }
    })
    return threads
  }

  async deleteThread(threadId: string, dispatch: Dispatch<UnknownAction>): Promise<void> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads/${threadId}`,
      {
        method: 'DELETE',
        headers: this.createHeaders(),
      },
      dispatch,
    )
    if (!response.ok) {
      throw new Error('Error deleting thread')
    }
  }

  async setThreadName(threadId: string, name: ThreadNameRequest, dispatch: Dispatch<UnknownAction>): Promise<void> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/threads/${threadId}/name`,
      {
        method: 'POST',
        headers: this.createHeaders(),
        body: JSON.stringify(name),
      },
      dispatch,
    )
    if (!response.ok) {
      throw new Error('Error setting thread name')
    }
  }

  async getShareThreadUUID(threadId: string, dispatch: Dispatch<UnknownAction>): Promise<ShareThreadResponse> {
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/share/${threadId}`,
      {
        method: 'POST',
        headers: this.createHeaders(),
        body: JSON.stringify({}),
      },
      dispatch,
    )

    if (!response.ok) {
      throw new Error('Error getting share uuid for a thread')
    }

    return await response.json()
  }

  async getSharedThread(sharedThreadUUID: string, dispatch: Dispatch<UnknownAction>): Promise<Thread> {
    // This is a public sharing endpoint which doesn't require an access token
    const response = await this.fetchWithAuthRetry(
      `${this.baseURL}/share/${sharedThreadUUID}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      dispatch,
    )
    if (!response.ok) {
      throw new ApplicationError('Error fetching shared thread ' + sharedThreadUUID)
    }
    const data = await response.json()

    if (Helpers.isBlank(data)) {
      throw new NotFoundError('Unable to load shared thread ' + sharedThreadUUID)
    } else {
      // The API returns { thread_id: 1 } and we need to convert it to the Thread type
      // No messages are returned in the creation response, so initializing with an empty array
      const thread: Thread = {
        id: String(sharedThreadUUID), // Convert thread_id to a string to match the Thread interface
        name: data.content.thread_name ?? null, // API response doesn't include name
        messages: data.content.messages, // Initialize with an empty array since the API response doesn't include messages
      }
      return thread
    }
  }

  async sendFeedback(
    threadId: string,
    messageId: string,
    feedbackClass: FeedbackClass,
    comment: string,
    dispatch: Dispatch<UnknownAction>,
  ): Promise<void> {
    /*
     * The server expects the following format for a request to /feedback:
     */
    const feedbackRequest = {
      /* eslint-disable camelcase */
      thread_id: threadId,
      message_id: messageId,
      feedback_class: feedbackClass,
      /* eslint-disable camelcase */
      comment: comment,
    }

    try {
      const response = await this.fetchWithAuthRetry(
        `${this.baseURL}/feedback`,
        {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify(feedbackRequest),
        },
        dispatch,
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      await response.json()
      // Handle success, e.g., show a confirmation message
    } catch (error) {
      console.error('Error sending feedback:', error)
      // Handle error, e.g., show an error message
    }
  }
}

export default ChatService
