import fetchFeedbacksForLanguage from '../FeedbackService'

describe('fetchFeedbacksForLanguage', () => {
  it('resolves region-tagged locales to their base language (issue #77)', async () => {
    const arabic = await fetchFeedbacksForLanguage('ar')
    const english = await fetchFeedbacksForLanguage('en')
    expect(arabic).not.toBe(english)

    expect(await fetchFeedbacksForLanguage('ar-EG')).toBe(arabic)
    expect(await fetchFeedbacksForLanguage('en-US')).toBe(english)
  })

  it('returns the exact match for base language codes', async () => {
    const turkish = await fetchFeedbacksForLanguage('tur')
    expect(turkish.good).toBeDefined()
    expect(turkish.bad).toBeDefined()
  })

  it('falls back to English for unknown languages', async () => {
    const english = await fetchFeedbacksForLanguage('en')
    expect(await fetchFeedbacksForLanguage('xx')).toBe(english)
  })
})
