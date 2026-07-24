import { linkifyLkIds, lkIdToUrl } from './lkCitations'

const CORPUS_BASE = 'https://github.com/ShathaTm/LK-Hadith-Corpus/blob/c45fa64aa40bf1d4a34b9b35359640a583b02881'

describe('lkIdToUrl', () => {
  it('resolves an LK id to the exact corpus row', () => {
    // Muslim, chapter 38, hadith 5524 — the row is physical line 32 of the chapter CSV
    expect(lkIdToUrl('2_38_5_5524')).toBe(`${CORPUS_BASE}/Muslim/Chapter38.csv#L32`)
    expect(lkIdToUrl('3_6_469_1239')).toBe(`${CORPUS_BASE}/AbuDaud/Chapter6.csv#L4`)
  })

  it('ignores the section component, which can be -1 when the corpus row has none', () => {
    expect(lkIdToUrl('4_7_-1_1650')).toBe(`${CORPUS_BASE}/IbnMaja/Chapter7.csv#L14`)
    expect(lkIdToUrl('4_7_999_1650')).toBe(`${CORPUS_BASE}/IbnMaja/Chapter7.csv#L14`)
  })

  it('resolves every hadith number of a merged-narration row to the same line', () => {
    // Bukhari/Chapter23.csv line 6 covers hadith 1241-1242
    expect(lkIdToUrl('1_23_3_1241')).toBe(`${CORPUS_BASE}/Bukhari/Chapter23.csv#L6`)
    expect(lkIdToUrl('1_23_3_1242')).toBe(`${CORPUS_BASE}/Bukhari/Chapter23.csv#L6`)
  })

  it('returns null for anything that is not an exact map hit', () => {
    expect(lkIdToUrl('9_1_1_5')).toBeNull() // unknown collection
    expect(lkIdToUrl('2_999_1_5')).toBeNull() // unknown chapter
    expect(lkIdToUrl('2_38_5_99999')).toBeNull() // hadith not in the chapter
    expect(lkIdToUrl('2106')).toBeNull() // old plain-number format
    expect(lkIdToUrl('2_38_5')).toBeNull()
    expect(lkIdToUrl('')).toBeNull()
  })
})

describe('linkifyLkIds', () => {
  it('linkifies the space-separated form, keeping surrounding punctuation outside the link', () => {
    const input = 'Hadith 5524, LK id 2_38_5_5524 (Grade: Sahih - Authentic):'
    expect(linkifyLkIds(input)).toBe(
      `Hadith 5524, [LK id 2_38_5_5524](${CORPUS_BASE}/Muslim/Chapter38.csv#L32) (Grade: Sahih - Authentic):`,
    )
  })

  it('linkifies the colon form', () => {
    const input = 'Collection: Abu Dawud LK id: 3_6_469_1239 Narrated Aishah'
    expect(linkifyLkIds(input)).toBe(
      `Collection: Abu Dawud [LK id: 3_6_469_1239](${CORPUS_BASE}/AbuDaud/Chapter6.csv#L4) Narrated Aishah`,
    )
  })

  it('linkifies ids with a negative section', () => {
    const input = 'Collection: IbnMaja Chapter: 7 Hadith: 1650 LK id: 4_7_-1_1650 It was narrated'
    expect(linkifyLkIds(input)).toBe(
      `Collection: IbnMaja Chapter: 7 Hadith: 1650 [LK id: 4_7_-1_1650](${CORPUS_BASE}/IbnMaja/Chapter7.csv#L14) It was narrated`,
    )
  })

  it('linkifies multiple ids in one message', () => {
    const output = linkifyLkIds('First LK id 2_38_5_5524 and second LK id: 4_7_-1_1650.')
    expect(output).toContain(`[LK id 2_38_5_5524](${CORPUS_BASE}/Muslim/Chapter38.csv#L32)`)
    expect(output).toContain(`[LK id: 4_7_-1_1650](${CORPUS_BASE}/IbnMaja/Chapter7.csv#L14)`)
  })

  it('tolerates casing differences', () => {
    expect(linkifyLkIds('lk ID 2_38_5_5524')).toBe(`[lk ID 2_38_5_5524](${CORPUS_BASE}/Muslim/Chapter38.csv#L32)`)
  })

  it('leaves the old plain-number format untouched', () => {
    const input = 'Collection: Muslim LK id: 2106 something'
    expect(linkifyLkIds(input)).toBe(input)
  })

  it('leaves malformed and unresolvable ids untouched', () => {
    const fivePart = 'LK id 1_2_3_4_5 end'
    expect(linkifyLkIds(fivePart)).toBe(fivePart)
    const unknownCollection = 'LK id 9_1_1_5 end'
    expect(linkifyLkIds(unknownCollection)).toBe(unknownCollection)
    const unknownHadith = 'LK id 2_38_5_99999 end'
    expect(linkifyLkIds(unknownHadith)).toBe(unknownHadith)
  })

  it('does not touch ids inside thinking blocks, which render as code fences', () => {
    const input = '<thinking>checking LK id 2_38_5_5524</thinking> Answer: LK id 2_38_5_5524'
    expect(linkifyLkIds(input)).toBe(
      `<thinking>checking LK id 2_38_5_5524</thinking> Answer: [LK id 2_38_5_5524](${CORPUS_BASE}/Muslim/Chapter38.csv#L32)`,
    )
  })

  it('does not touch ids inside a thinking block that is still streaming in', () => {
    const input = 'Intro <thinking>checking LK id 2_38_5_5524'
    expect(linkifyLkIds(input)).toBe(input)
  })
})
