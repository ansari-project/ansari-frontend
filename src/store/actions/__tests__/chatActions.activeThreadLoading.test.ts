import { fetchThread, fetchThreads } from '@/store/actions/chatActions'
import { setActiveThreadLoading } from '@/store/slices/chatSlice'
import { Thread } from '@/store/types/chatTypes'

const mockGetThread = jest.fn()
const mockGetAllThreads = jest.fn()

jest.mock('@/services/', () => ({
  ChatService: jest.fn().mockImplementation(() => ({
    getThread: (...args: unknown[]) => mockGetThread(...args),
    getAllThreads: (...args: unknown[]) => mockGetAllThreads(...args),
  })),
}))

const thread: Thread = { id: 'thread-1', name: 'Thread', messages: [] }

const stateWithActiveThread = (activeThread: Thread | null): jest.Mock =>
  jest.fn(() => ({ auth: { isAuthenticated: true, accessToken: 'token' }, chat: { activeThread } }))

const activeThreadLoadingValues = (dispatch: jest.Mock): boolean[] =>
  dispatch.mock.calls
    .map(([action]) => action)
    .filter((action) => action?.type === setActiveThreadLoading(true).type)
    .map((action) => action.payload)

describe('activeThreadLoading (issue #84)', () => {
  beforeEach(() => {
    mockGetThread.mockReset()
    mockGetAllThreads.mockReset()
  })

  it('is raised while opening a thread that is not on screen yet', async () => {
    mockGetThread.mockResolvedValueOnce(thread)
    const dispatch = jest.fn()
    await fetchThread('thread-1')(dispatch, stateWithActiveThread(null), undefined)

    expect(activeThreadLoadingValues(dispatch)).toEqual([true, false])
  })

  it('is raised when switching from another thread', async () => {
    mockGetThread.mockResolvedValueOnce(thread)
    const dispatch = jest.fn()
    await fetchThread('thread-1')(dispatch, stateWithActiveThread({ ...thread, id: 'thread-2' }), undefined)

    expect(activeThreadLoadingValues(dispatch)).toEqual([true, false])
  })

  it('is never raised when refetching the thread that is already on screen', async () => {
    mockGetThread.mockResolvedValueOnce(thread)
    const dispatch = jest.fn()
    await fetchThread('thread-1')(dispatch, stateWithActiveThread(thread), undefined)

    expect(activeThreadLoadingValues(dispatch)).toEqual([])
  })

  it('is not cleared by a same-thread refetch that finishes while a thread switch is in flight', async () => {
    let resolveSwitch: (value: Thread) => void = () => undefined
    mockGetThread.mockImplementation((threadId: string) =>
      threadId === 'thread-2'
        ? new Promise<Thread>((resolve) => {
            resolveSwitch = resolve
          })
        : Promise.resolve(thread),
    )
    const dispatch = jest.fn()
    const getState = stateWithActiveThread(thread)

    const switching = fetchThread('thread-2')(dispatch, getState, undefined)
    await fetchThread('thread-1')(dispatch, getState, undefined)
    expect(activeThreadLoadingValues(dispatch)).toEqual([true])

    resolveSwitch({ ...thread, id: 'thread-2' })
    await switching
    expect(activeThreadLoadingValues(dispatch)).toEqual([true, false])
  })

  it('is cleared when opening a thread fails', async () => {
    mockGetThread.mockRejectedValueOnce(new Error('network down'))
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const dispatch = jest.fn()
    await fetchThread('thread-1')(dispatch, stateWithActiveThread(null), undefined)

    expect(activeThreadLoadingValues(dispatch)).toEqual([true, false])
  })

  it('is not touched by a thread-list refresh', async () => {
    mockGetAllThreads.mockResolvedValueOnce([thread])
    const dispatch = jest.fn()
    await fetchThreads()(dispatch, stateWithActiveThread(thread), undefined)

    expect(activeThreadLoadingValues(dispatch)).toEqual([])
  })
})
