import lkHadithLineMap from '@/data/lkHadithLineMap.json'

/**
 * Hadith citations in assistant answers carry an LK id (e.g. `LK id 2_38_5_5524`, format
 * collection_chapter_section_hadith) referencing the LK-Hadith-Corpus. These helpers turn LK ids
 * into links to the exact CSV row on GitHub, resolved through src/data/lkHadithLineMap.json
 * (regenerate with `npm run generate:lk-map` — see scripts/generateLkHadithLineMap.mjs).
 *
 * A link is only ever produced on an exact map hit; an LK id we cannot resolve with certainty is
 * left as plain text rather than linked to a guessed location.
 */

type LkHadithLineMap = {
  commit: string
  collections: Record<string, { folder: string; chapters: Record<string, number[][]> }>
}

const lineMap: LkHadithLineMap = lkHadithLineMap

const GITHUB_BASE_URL = `https://github.com/ShathaTm/LK-Hadith-Corpus/blob/${lineMap.commit}`

// Matches `LK id 2_38_5_5524` / `LK id: 2_38_5_5524` (collection_chapter_section_hadith; the
// section can be negative when the corpus row has none). The trailing \b keeps punctuation out of
// the match and rejects ids with extra `_n` parts; old-format plain-number ids (`LK id: 2106`)
// cannot match. Case-insensitive as defense — the backend emits `LK id` exactly.
const LK_ID_PATTERN = /\bLK id(?::\s*|\s+)(\d+)_(\d+)_(-?\d+)_(\d+)\b/gi

// <thinking> blocks are rendered as code fences by MessageBubble, where a markdown link would
// show as literal [text](url); `|$` covers a block still streaming in without its closing tag.
const THINKING_BLOCK_PATTERN = /(<thinking>[\s\S]*?(?:<\/thinking>|$))/

/**
 * Resolves an LK id (`collection_chapter_section_hadith`) to the GitHub URL of the exact corpus
 * CSV row, or null if any part of the id cannot be resolved with certainty.
 */
export const lkIdToUrl = (id: string): string | null => {
  const match = id.match(/^(\d+)_(\d+)_(-?\d+)_(\d+)$/)
  if (!match) return null
  const [, collectionNumber, chapter, , hadithText] = match
  const collection = lineMap.collections[collectionNumber]
  const runs = collection?.chapters[chapter]
  if (!runs) return null
  const hadith = Number(hadithText)
  for (const [startHadith, startLine, length] of runs) {
    if (hadith >= startHadith && hadith < startHadith + length) {
      return `${GITHUB_BASE_URL}/${collection.folder}/Chapter${chapter}.csv#L${startLine + (hadith - startHadith)}`
    }
  }
  return null
}

/**
 * Replaces every resolvable LK id in markdown text with a markdown link to its source row,
 * keeping the matched text verbatim as the link text. Unresolvable ids and ids inside
 * <thinking> blocks are left untouched.
 */
export const linkifyLkIds = (markdown: string): string =>
  markdown
    .split(THINKING_BLOCK_PATTERN)
    .map((segment) => {
      if (segment.startsWith('<thinking>')) return segment
      return segment.replace(LK_ID_PATTERN, (matched, collectionNumber, chapter, section, hadith) => {
        const url = lkIdToUrl(`${collectionNumber}_${chapter}_${section}_${hadith}`)
        return url ? `[${matched}](${url})` : matched
      })
    })
    .join('')
