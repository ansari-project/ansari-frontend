/* eslint-disable camelcase -- mocked API payloads use the backend's snake_case fields */
import { expect, Page, Route, test } from '@playwright/test'

/**
 * Regression test for issue #84: after every sent message the chat swapped the
 * message list for a full-screen spinner and remounted it scrolled to the top.
 *
 * Every backend route is intercepted, so the test is deterministic and never
 * touches a real API.
 */

const THREAD_ID = '1'
const QUESTION = 'What is the e2e regression question?'
const ANSWER_END = 'END-OF-E2E-ANSWER'
const ANSWER = Array.from(
  { length: 12 },
  (_, i) => `Answer paragraph ${i + 1}. ${'Lorem ipsum dolor sit amet. '.repeat(8)}`,
)
  .concat(ANSWER_END)
  .join('\n\n')

// Latencies that mimic a real network; without them the spinner swap is too brief to observe.
const THREAD_LIST_LATENCY_MS = 300
const ANSWER_LATENCY_MS = 1500
// The app refetches the thread list right after the answer and again 2s later.
const OBSERVATION_WINDOW_MS = 3500

type ApiMessage = { id: string; role: 'user' | 'assistant'; content: string }

const uuid = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const json = (route: Route, body: unknown): Promise<void> =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })

/**
 * Installs a stateful fake backend: a long thread that gains a question/answer pair when a message is posted.
 */
async function mockBackend(page: Page): Promise<void> {
  const messages: ApiMessage[] = Array.from({ length: 30 }, (_, i) => ({
    id: uuid(i),
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: `Seed message ${i + 1}. ${'Some earlier conversation text. '.repeat(10)}`,
  }))

  // Nothing may leave the machine: abort everything that is not the app itself.
  await page.route(
    (url) => url.hostname !== 'localhost',
    (route) => route.abort(),
  )

  await page.route('**/api/v2/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace('/api/v2', '')
    const method = request.method()

    if (method === 'GET' && path === '/users/me') {
      return json(route, { user_id: 'e2e-user', first_name: 'E2E', last_name: 'User', email: 'e2e@example.com' })
    }
    if (method === 'GET' && path === '/threads') {
      await sleep(THREAD_LIST_LATENCY_MS)
      return json(route, [{ thread_id: 1, thread_name: 'Long thread', updated_at: '2026-01-01T00:00:00Z' }])
    }
    if (method === 'GET' && path === `/threads/${THREAD_ID}`) {
      return json(route, { thread_name: 'Long thread', messages })
    }
    if (method === 'POST' && path === `/threads/${THREAD_ID}`) {
      await sleep(ANSWER_LATENCY_MS)
      // The real backend persists the turn before closing the stream.
      messages.push(
        { id: uuid(messages.length), role: 'user', content: QUESTION },
        { id: uuid(messages.length + 1), role: 'assistant', content: ANSWER },
      )
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ANSWER })
    }
    throw new Error(`Unmocked API call: ${method} ${path}`)
  })
}

type ProbeResult = { spinnerSeen: boolean; listUnmounted: boolean; minScrollTop: number; finalScrollTop: number }

test('sending a message keeps the message list mounted and its scroll position', async ({ page }) => {
  await mockBackend(page)
  await page.addInitScript(() => {
    window.localStorage.setItem('ac-at', 'e2e-access-token')
    window.localStorage.setItem('ac-rt', 'e2e-refresh-token')
  })

  await page.goto(`/chat/${THREAD_ID}`)
  const list = page.getByTestId('message-list-scroll')
  await expect(list.getByText('Seed message 30.')).toBeVisible()
  // Let the initial thread-list fetch settle so the test only observes the send flow.
  await expect(page.getByTestId('message-list-loading')).toHaveCount(0)
  await page.waitForTimeout(THREAD_LIST_LATENCY_MS * 2)
  await expect(list).toBeVisible()

  await page.locator('textarea').fill(QUESTION)
  await page.locator('textarea').press('Enter')
  await expect(list.getByText(QUESTION)).toBeVisible()

  // While the answer is pending, scroll down like a reader would and start sampling every frame.
  const scrolledTo = await page.evaluate(() => {
    const getList = (): HTMLElement | null => document.querySelector('[data-testid="message-list-scroll"]')
    const list = getList()!
    // On web the list grows to its content height and an ancestor scrolls, so find whichever element really scrolls.
    let scroller: HTMLElement = list
    while (
      scroller.parentElement &&
      !(/auto|scroll/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight + 1)
    ) {
      scroller = scroller.parentElement
    }
    scroller.scrollTop = scroller.scrollHeight
    const probe = {
      spinnerSeen: false,
      listUnmounted: false,
      minScrollTop: scroller.scrollTop,
      finalScrollTop: scroller.scrollTop,
    }
    ;(window as any).__scrollProbe = probe
    const sample = (): void => {
      if (document.querySelector('[data-testid="message-list-loading"]')) probe.spinnerSeen = true
      if (getList() !== list) probe.listUnmounted = true
      probe.minScrollTop = Math.min(probe.minScrollTop, scroller.scrollTop)
      probe.finalScrollTop = scroller.scrollTop
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    return scroller.scrollTop
  })
  expect(scrolledTo).toBeGreaterThan(1000) // the thread must actually be long enough to scroll

  await expect(page.getByText(ANSWER_END)).toBeAttached({ timeout: 15_000 })
  await page.waitForTimeout(OBSERVATION_WINDOW_MS)

  const probe: ProbeResult = await page.evaluate(() => (window as any).__scrollProbe)
  expect.soft(probe.spinnerSeen, 'a full-screen spinner replaced the message list').toBe(false)
  expect.soft(probe.listUnmounted, 'the message list ScrollView was remounted').toBe(false)
  expect.soft(probe.minScrollTop, 'the scroll offset was reset towards the top').toBeGreaterThanOrEqual(scrolledTo - 5)
  expect
    .soft(probe.finalScrollTop, 'the list ended up scrolled away from where the reader was')
    .toBeGreaterThanOrEqual(scrolledTo - 5)
})
