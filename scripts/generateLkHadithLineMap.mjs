/**
 * Generates src/data/lkHadithLineMap.json — a run-length-compressed map from LK hadith ids
 * (collection_chapter_section_hadith, as cited by the Ansari backend) to the physical line number
 * of the matching CSV row in the LK-Hadith-Corpus (https://github.com/ShathaTm/LK-Hadith-Corpus),
 * so the frontend can hyperlink citations to the exact source row on GitHub (#L anchors).
 *
 * Also writes scripts/lkHadithLineMap.unresolved.md — a report of every corpus row the map
 * cannot resolve (unparseable hadith numbers, duplicate hadith numbers within a chapter), each
 * linked to its exact line on GitHub.
 *
 * Usage:
 *   npm run generate:lk-map                                  # fetches the corpus at PINNED_SHA into a temp dir
 *   node scripts/generateLkHadithLineMap.mjs --corpus <dir>  # uses a local clone (HEAD must equal PINNED_SHA)
 *
 * Line numbers are only valid for the corpus at PINNED_SHA; if the corpus ever updates, bump
 * PINNED_SHA and rerun — the map, the embedded commit, and the generated links update together.
 * The script self-verifies by round-tripping every (hadith -> line) pair through the compressed
 * map before writing, and asserts the known anchor 2_38_5_5524 -> Muslim/Chapter38.csv#L32.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const PINNED_SHA = 'c45fa64aa40bf1d4a34b9b35359640a583b02881'
const CORPUS_REPO_URL = 'https://github.com/ShathaTm/LK-Hadith-Corpus.git'
const CORPUS_BLOB_BASE = `https://github.com/ShathaTm/LK-Hadith-Corpus/blob/${PINNED_SHA}`
const COLLECTIONS = { 1: 'Bukhari', 2: 'Muslim', 3: 'AbuDaud', 4: 'IbnMaja', 5: 'Nesai', 6: 'Tirmizi' }
const OUTPUT_PATH = 'src/data/lkHadithLineMap.json'
const UNRESOLVED_PATH = 'scripts/lkHadithLineMap.unresolved.md'
const HADITH_NUMBER_HEADER = /^hadith[_ ]?number$/i

/**
 * A Hadith_number cell is either a single number (possibly float-formatted, e.g. "1228.0") or a
 * dash-separated run of consecutive numbers for merged narrations (e.g. "1241-1242",
 * "3450-3451-3452") — every number in the run belongs to that row. Anything else (including
 * non-consecutive "ranges", which exist in the corpus as data errors) returns null: we never
 * guess, unresolvable rows are reported instead.
 */
const parseHadithNumbers = (rawValue) => {
  if (/^\d+(\.\d+)?$/.test(rawValue)) return [Math.trunc(parseFloat(rawValue))]
  if (/^\d+(\s*-\s*\d+)+$/.test(rawValue)) {
    const numbers = rawValue.split('-').map((part) => Number(part.trim()))
    if (numbers.every((n, k) => k === 0 || n === numbers[k - 1] + 1)) return numbers
  }
  return null
}

/**
 * Parses RFC4180 CSV text and returns one entry per record: the record's fields and the 1-based
 * physical line on which the record starts. Newlines inside quoted fields advance the physical
 * line counter (GitHub #L anchors count physical lines) without ending the record.
 */
const parseCsvWithLineNumbers = (text) => {
  const records = []
  let fields = []
  let field = ''
  let inQuotes = false
  let line = 1
  let recordStartLine = 1
  let recordHasContent = false

  const endField = () => {
    fields.push(field)
    field = ''
  }
  const endRecord = () => {
    endField()
    records.push({ fields, startLine: recordStartLine })
    fields = []
    recordHasContent = false
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (!recordHasContent && ch !== '\n' && ch !== '\r') {
      recordStartLine = line
      recordHasContent = true
    }
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        if (ch === '\n') line++
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      endField()
    } else if (ch === '\n') {
      line++
      if (recordHasContent) endRecord()
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (recordHasContent) endRecord()
  return records
}

const parseArgs = () => {
  const args = process.argv.slice(2)
  const corpusFlag = args.indexOf('--corpus')
  if (corpusFlag !== -1) {
    const dir = args[corpusFlag + 1]
    if (!dir) throw new Error('--corpus requires a path argument')
    return { corpusDir: dir, isTemp: false }
  }
  const dir = mkdtempSync(join(tmpdir(), 'lk-hadith-corpus-'))
  console.log(`Fetching LK-Hadith-Corpus at ${PINNED_SHA} into ${dir} ...`)
  execFileSync('git', ['init', '--quiet'], { cwd: dir })
  execFileSync('git', ['remote', 'add', 'origin', CORPUS_REPO_URL], { cwd: dir })
  execFileSync('git', ['fetch', '--quiet', '--depth', '1', 'origin', PINNED_SHA], { cwd: dir })
  execFileSync('git', ['checkout', '--quiet', 'FETCH_HEAD'], { cwd: dir })
  return { corpusDir: dir, isTemp: true }
}

const verifyCorpusSha = (corpusDir) => {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: corpusDir }).toString().trim()
  if (head !== PINNED_SHA) {
    throw new Error(`Corpus at ${corpusDir} is at ${head}, expected ${PINNED_SHA} — line numbers would be wrong`)
  }
}

const main = () => {
  const { corpusDir, isTemp } = parseArgs()
  try {
    verifyCorpusSha(corpusDir)

    const collections = {}
    const rawPairs = [] // [collectionNumber, chapter, hadith, line] for round-trip verification
    const unparseable = [] // rows whose Hadith_number is not a number
    const shadowed = [] // rows whose hadith number already appeared earlier in the same chapter
    let totalRows = 0

    for (const [collectionNumber, folder] of Object.entries(COLLECTIONS)) {
      const chapters = {}
      const files = readdirSync(join(corpusDir, folder))
        .map((name) => ({ name, match: name.match(/^Chapter(\d+)\.csv$/) }))
        .filter(({ match }) => match)
        .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))

      for (const { name, match } of files) {
        const chapter = match[1]
        const text = readFileSync(join(corpusDir, folder, name), 'utf8').replace(/^\uFEFF/, '')
        const records = parseCsvWithLineNumbers(text)
        if (records.length === 0) continue
        const hadithColumn = records[0].fields.findIndex((header) => HADITH_NUMBER_HEADER.test(header.trim()))
        if (hadithColumn === -1) throw new Error(`No Hadith_number column in ${folder}/${name}`)

        const seen = new Map() // hadith number -> first line
        const runs = []
        for (const { fields, startLine } of records.slice(1)) {
          totalRows++
          const rawValue = (fields[hadithColumn] ?? '').trim()
          const hadithNumbers = parseHadithNumbers(rawValue)
          if (!hadithNumbers) {
            unparseable.push({ folder, chapter, line: startLine, rawValue })
            continue
          }
          for (const hadith of hadithNumbers) {
            if (seen.has(hadith)) {
              shadowed.push({ folder, chapter, hadith, line: startLine, firstLine: seen.get(hadith) })
              continue
            }
            seen.set(hadith, startLine)
            rawPairs.push([collectionNumber, chapter, hadith, startLine])
            const lastRun = runs[runs.length - 1]
            if (lastRun && hadith === lastRun[0] + lastRun[2] && startLine === lastRun[1] + lastRun[2]) {
              lastRun[2]++
            } else {
              runs.push([hadith, startLine, 1])
            }
          }
        }
        if (runs.length > 0) chapters[chapter] = runs
      }
      collections[collectionNumber] = { folder, chapters }
    }

    const map = { commit: PINNED_SHA, collections }

    // Self-verification: every collected (hadith -> line) pair must round-trip through the runs.
    const lookup = (collectionNumber, chapter, hadith) => {
      const runs = map.collections[collectionNumber]?.chapters[chapter] ?? []
      for (const [startHadith, startLine, length] of runs) {
        if (hadith >= startHadith && hadith < startHadith + length) return startLine + (hadith - startHadith)
      }
      return null
    }
    for (const [collectionNumber, chapter, hadith, line] of rawPairs) {
      const resolved = lookup(collectionNumber, chapter, hadith)
      if (resolved !== line) {
        throw new Error(
          `Round-trip failed for ${collectionNumber}_${chapter}_?_${hadith}: got ${resolved}, expected ${line}`,
        )
      }
    }
    const anchor = lookup('2', '38', 5524)
    if (anchor !== 32) throw new Error(`Anchor check failed: 2_38_5_5524 resolved to line ${anchor}, expected 32`)

    mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(map)}\n`)

    const rowLink = ({ folder, chapter, line }) => `${CORPUS_BLOB_BASE}/${folder}/Chapter${chapter}.csv#L${line}`
    const report = [
      '# LK-Hadith-Corpus rows not resolvable by the LK id line map',
      '',
      `Generated by \`scripts/generateLkHadithLineMap.mjs\` against corpus commit \`${PINNED_SHA}\`.`,
      'LK ids pointing at these rows render as plain text (never as a link we are not certain about).',
      '',
      `## Rows with an unparseable \`Hadith_number\` (${unparseable.length})`,
      '',
      'These rows have no usable hadith number (empty, `nan`, or a non-consecutive number "range" that',
      'looks like a data error), so no LK id can be mapped to them with certainty.',
      '',
      ...unparseable.map(
        (row) =>
          `- [${row.folder}/Chapter${row.chapter}.csv line ${row.line}](${rowLink(row)}) — \`Hadith_number\` is \`${row.rawValue || '(empty)'}\``,
      ),
      '',
      `## Rows shadowed by a duplicate hadith number in the same chapter (${shadowed.length})`,
      '',
      'The same hadith number appears more than once in the chapter file; the map keeps the first',
      'occurrence, so LK ids resolve to the first row and these later duplicates are unreachable.',
      '',
      ...shadowed.map(
        (row) =>
          `- [${row.folder}/Chapter${row.chapter}.csv line ${row.line}](${rowLink(row)}) — hadith ${row.hadith} already mapped to [line ${row.firstLine}](${rowLink({ ...row, line: row.firstLine })})`,
      ),
      '',
    ]
    writeFileSync(UNRESOLVED_PATH, `${report.join('\n')}\n`)

    const runCount = Object.values(collections).reduce(
      (total, { chapters }) => total + Object.values(chapters).reduce((sum, runs) => sum + runs.length, 0),
      0,
    )
    console.log(`Rows scanned:        ${totalRows}`)
    console.log(`Hadith mapped:       ${rawPairs.length} (round-trip verified, anchor 2_38_5_5524 -> L32 OK)`)
    console.log(`Runs:                ${runCount}`)
    console.log(`Unparseable rows:    ${unparseable.length}`)
    console.log(`Shadowed duplicates: ${shadowed.length}`)
    console.log(`Wrote ${OUTPUT_PATH} and ${UNRESOLVED_PATH}`)
  } finally {
    if (isTemp) rmSync(corpusDir, { recursive: true, force: true })
  }
}

main()
