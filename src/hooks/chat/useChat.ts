import { addMessage, AppDispatch, createThread, RootState, setActiveThread, Thread } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface UseChatReturn {
  isLoading: boolean
  activeThread: Thread | null
  inputText: string
  // eslint-disable-next-line no-unused-vars
  setInputText: (text: string) => void
  isSending: boolean
  sendNewMessage: (
    // eslint-disable-next-line no-unused-vars
    content: string,
    // eslint-disable-next-line no-unused-vars
    threadId?: string,
  ) => Promise<{ threadId: string | undefined }>
  abortRequest: () => void
}

/**
 * A custom hook to manage chat functionalities including sending messages and managing the active thread.
 *
 * @returns An object containing:
 * - isLoading: Boolean indicating if a chat-related request is in progress.
 * - activeThread: The currently active thread or null if no thread is active.
 * - sendNewMessage: Function to send a new message to a thread. It handles thread creation if necessary.
 * - abortRequest: Function to abort the ongoing message send request.
 */
export function useChat(): UseChatReturn {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((state: RootState) => state.chat.loading)
  const activeThread = useSelector((state: RootState) => state.chat.activeThread)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [inputText, setInputText] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)

  /**
   * Sends a new message to the specified thread or creates a new thread if none is specified.
   *
   * @param content The content of the message to be sent.
   * @param currentThreadId Optional. The ID of the thread to send the message to. If not provided, a new thread is created.
   * @returns A promise that resolves when the message has been sent or the operation has been aborted.
   */
  const sendNewMessage = async (
    content: string,
    currentThreadId?: string,
  ): Promise<{ threadId: string | undefined; error?: Error }> => {
    setIsSending(true)
    abortControllerRef.current = new AbortController()
    let threadId = currentThreadId
    // Proceed to send the message if thread ID is available and content is not just whitespace
    try {
      if (!threadId) {
        // Create a new thread if no current thread ID is provided
        const resultAction = await dispatch(createThread()).unwrap()
        if (resultAction) {
          dispatch(setActiveThread(resultAction))
          threadId = resultAction.id
        }
      }
      if (threadId && content.trim()) {
        await dispatch(
          addMessage({
            threadId: threadId,
            content: content,
            signal: abortControllerRef.current.signal,
          }),
        ).unwrap()
        return { threadId } // Plus any additional success feedback
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsSending(false)
      return { threadId: undefined, error } // Include error feedback
    } finally {
      setInputText('') // Clear input text on successful send
      setIsSending(false)
      abortControllerRef.current = null
    }
    return { threadId } // Return the thread ID
  }

  /**
   * Aborts the current message sending request, if any.
   */
  const abortRequest = (): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  // Cleanup function to abort pending requests when the hook unmounts or a component using this hook unmounts
  useEffect(() => {
    return () => {
      abortRequest()
    }
  }, [])

  return {
    isLoading,
    activeThread,
    inputText,
    setInputText,
    isSending,
    sendNewMessage,
    abortRequest,
  }
}
