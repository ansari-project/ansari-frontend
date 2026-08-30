import turPrompts from '@/i18n/locales/tur/prompts.json'
import tmlPrompts from '@/i18n/locales/tml/prompts.json'
import enPrompts from '@/i18n/locales/en/prompts.json'
import fetchPromptsForLanguage from '../PromptsService'

describe('fetchPromptsForLanguage', () => {
  // Prompt ids are shared across locales, so compare the localized titles
  const turkishTitles = turPrompts.dua.map((prompt) => prompt.title)
  const tamilTitles = tmlPrompts.dua.map((prompt) => prompt.title)
  const englishTitles = enPrompts.dua.map((prompt) => prompt.title)

  it('maps ISO codes and region tags to our nonstandard locale keys (issue #77)', async () => {
    expect(turkishTitles).not.toEqual(englishTitles)

    expect(turkishTitles).toContain((await fetchPromptsForLanguage('tr')).dua[0].title)
    expect(turkishTitles).toContain((await fetchPromptsForLanguage('tr-TR')).dua[0].title)
    expect(turkishTitles).toContain((await fetchPromptsForLanguage('tur')).dua[0].title)
    expect(tamilTitles).toContain((await fetchPromptsForLanguage('ta')).dua[0].title)
  })
})
