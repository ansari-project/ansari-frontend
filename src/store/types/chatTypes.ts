/* eslint-disable no-unused-vars */
// Enum for defining the roles in the chat
export enum UserRole {
  User = 'user',
  Assistant = 'assistant',
}
/* eslint-disable no-unused-vars */

// Represents the request payload for adding a message to a thread
export interface AddMessageRequest {
  role: UserRole.User // The role of the sender, restricted to 'user'
  content: string // The content of the message
}

// Represents the response structure for a thread
export interface Thread {
  id: string // Unique identifier for the thread
  name?: string // Thread name
  messages: Message[] // Array of messages in the thread
  created?: Date | number | null // Creation timestamp
}

// Represents a single message in a thread
export interface Message {
  id?: string // Unique identifier for the message
  role: UserRole // The role of the sender, using UserRole enum
  content: string // Content of the message
  timestamp?: string // Timestamp of when the message was sent
}

// Represents the request payload for setting a thread's name
export interface ThreadNameRequest {
  name: string // New name for the thread
}
