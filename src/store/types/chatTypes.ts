/* eslint-disable no-unused-vars */
/**
 * Represents the role of a user in the chat.
 */
export enum UserRole {
  User = 'user',
  Assistant = 'assistant',
}

/**
 * Enum representing different feedback classes.
 */
export enum FeedbackClass {
  ThumbsUp = 'thumbsup',
  ThumbsDown = 'thumbsdown',
  RedFlag = 'redflag',
}

/* eslint-disable no-unused-vars */

/**
 * Represents a request to add a message.
 */
export interface AddMessageRequest {
  /**
   * The role of the sender, restricted to 'user'.
   */
  role: UserRole.User

  /**
   * The content of the message.
   */
  content: string
}

/**
 * Represents a thread in the chat.
 */
export interface Thread {
  id: string // Unique identifier for the thread
  name?: string | null // Thread name
  messages: Message[] // Array of messages in the thread
  date?: Date | number | null // Creation/Update timestamp
}

/**
 * Represents a chat message.
 */
export interface Message {
  /**
   * Unique identifier for the message.
   */
  id: string
  /**
   * The role of the sender, using UserRole enum.
   */
  role: UserRole
  /**
   * Content of the message.
   */
  content: string
  /**
   * Timestamp of when the message was sent.
   */
  timestamp?: string
}

/**
 * Represents a request to change the name of a thread.
 */
export interface ThreadNameRequest {
  name: string // New name for the thread
}

/**
 * Represents a feedback request.
 */
export interface FeedbackRequest {
  /**
   * The ID of the thread.
   */
  threadId: string
  /**
   * The ID of the message.
   */
  messageId: string
  /**
   * The class of feedback.
   */
  feedbackClass: FeedbackClass
  /**
   * Additional comments for the feedback.
   */
  comment: string
}
