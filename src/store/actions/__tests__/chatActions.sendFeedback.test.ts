import { sendFeedback } from '@/store/actions/chatActions'
import { setError, setLoading } from '@/store/slices/chatSlice'
import { FeedbackClass, FeedbackRequest } from '@/store/types/chatTypes'

const mockSendFeedback = jest.fn()

jest.mock('@/services/', () => ({
  ChatService: jest.fn().mockImplementation(() => ({
    sendFeedback: (...args: unknown[]) => mockSendFeedback(...args),
  })),
}))

const feedbackRequest: FeedbackRequest = {
  threadId: 'thread-1',
  messageId: 'message-1',
  feedbackClass: FeedbackClass.ThumbsDown,
  comment: 'Not comprehensive - missing citations',
}

const runSendFeedbackThunk = async (): Promise<jest.Mock> => {
  const dispatch = jest.fn()
  const getState = jest.fn(() => ({ auth: { isAuthenticated: true, accessToken: 'token' } }))
  await sendFeedback({ feedbackRequest })(dispatch, getState, undefined)
  return dispatch
}

const dispatchedTypes = (dispatch: jest.Mock): string[] => dispatch.mock.calls.map(([action]) => action?.type)

describe('sendFeedback thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does not toggle the global chat loading flag (issue #77)', async () => {
    mockSendFeedback.mockResolvedValueOnce(undefined)
    const dispatch = await runSendFeedbackThunk()

    expect(dispatchedTypes(dispatch)).not.toContain(setLoading(true).type)
  })

  it('sends the feedback payload to ChatService', async () => {
    mockSendFeedback.mockResolvedValueOnce(undefined)
    await runSendFeedbackThunk()

    expect(mockSendFeedback).toHaveBeenCalledWith(
      'thread-1',
      'message-1',
      FeedbackClass.ThumbsDown,
      'Not comprehensive - missing citations',
      expect.any(Function),
    )
  })

  it('dispatches setError on failure without toggling the loading flag', async () => {
    mockSendFeedback.mockRejectedValueOnce(new Error('network down'))
    const dispatch = await runSendFeedbackThunk()

    const types = dispatchedTypes(dispatch)
    expect(types).toContain(setError('').type)
    expect(types).not.toContain(setLoading(true).type)
  })
})
