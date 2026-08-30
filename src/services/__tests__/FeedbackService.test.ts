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

  it('maps ISO codes to our nonstandard Turkish and Tamil locale keys', async () => {
    const turkish = await fetchFeedbacksForLanguage('tur')
    const tamil = await fetchFeedbacksForLanguage('tml')
    const english = await fetchFeedbacksForLanguage('en')
    expect(turkish).not.toBe(english)
    expect(tamil).not.toBe(english)

    expect(await fetchFeedbacksForLanguage('tr')).toBe(turkish)
    expect(await fetchFeedbacksForLanguage('tr-TR')).toBe(turkish)
    expect(await fetchFeedbacksForLanguage('ta')).toBe(tamil)
    expect(await fetchFeedbacksForLanguage('ta-IN')).toBe(tamil)
  })

  it('falls back to English for unknown or missing languages', async () => {
    const english = await fetchFeedbacksForLanguage('en')
    expect(await fetchFeedbacksForLanguage('xx')).toBe(english)
    expect(await fetchFeedbacksForLanguage(undefined as unknown as string)).toBe(english)
  })
})
