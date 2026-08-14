// Modality 7's fetcher. Reads the standing list of target companies, asks
// every board on it what is open, and prints the postings whose titles clear
// the gate.
//
// The modality is company-led rather than search-led, which is what makes it
// worth running - but it is also what makes it expensive. A hand-kept list of
// a dozen companies is an agent's afternoon; a list built from a market sweep
// runs to a couple of hundred, and an agent asked to fetch them one at a time
// exhausts its context somewhere in the Cs, having read a great many postings
// about roles it was never looking for.
//
// So the split is the one this repo uses everywhere: deterministic where it
// can be, judgement where it must be. Fetching two hundred JSON endpoints and
// discarding the postings whose titles are out of band is arithmetic, and it
// belongs in a script. Reading what survives against a brief is judgement, and
// it belongs in an agent. This is the first half; it hands the second half a
// few dozen postings instead of a few thousand.
//
//   node companies.mjs --companies <path to COMPANIES.md> \
//                      [--exclude "term,term"] [--since YYYY-MM-DD] \
//                      [--locations "united kingdom,remote"] [--all]
//
// Prints JSON on stdout: the matches, the companies that need an agent
// because they carry no API, and the failures. Everything it drops it counts.

import { readFile } from 'node:fs/promises'
import { gradeTitle, excludeMatcher } from './title_filter.mjs'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
const CONCURRENCY = 8

// --- the boards, and how each one names the same four things ---------------

const ADAPTERS = [
  {
    ats: 'greenhouse',
    match: /boards-api\.greenhouse\.io/i,
    rows: (d) => (d?.jobs ?? []).map((j) => ({
      title: j.title, location: j.location?.name ?? '',
      url: j.absolute_url, posted: (j.updated_at ?? j.first_published ?? '').slice(0, 10) || null,
    })),
  },
  {
    ats: 'ashby',
    match: /api\.ashbyhq\.com/i,
    rows: (d) => (d?.jobs ?? []).map((j) => ({
      title: j.title, location: j.location ?? '',
      url: j.jobUrl ?? j.applyUrl, posted: (j.publishedAt ?? '').slice(0, 10) || null,
    })),
  },
  {
    ats: 'lever',
    match: /api\.lever\.co/i,
    rows: (d) => (Array.isArray(d) ? d : []).map((j) => ({
      title: j.text, location: j.categories?.location ?? '',
      url: j.hostedUrl, posted: j.createdAt ? new Date(j.createdAt).toISOString().slice(0, 10) : null,
    })),
  },
  {
    ats: 'workable',
    match: /apply\.workable\.com/i,
    rows: (d) => (d?.jobs ?? []).map((j) => ({
      title: j.title, location: [j.location?.city, j.location?.country].filter(Boolean).join(', '),
      url: j.url ?? j.application_url, posted: (j.published_on ?? '').slice(0, 10) || null,
    })),
  },
  {
    ats: 'smartrecruiters',
    match: /api\.smartrecruiters\.com/i,
    rows: (d) => (d?.content ?? []).map((j) => ({
      title: j.name, location: [j.location?.city, j.location?.country].filter(Boolean).join(', '),
      url: `https://jobs.smartrecruiters.com/${j.company?.identifier ?? ''}/${j.id}`,
      posted: (j.releasedDate ?? '').slice(0, 10) || null,
    })),
  },
  {
    ats: 'recruitee',
    match: /\.recruitee\.com/i,
    rows: (d) => (d?.offers ?? []).map((j) => ({
      title: j.title, location: j.location ?? '',
      url: j.careers_url ?? j.careers_apply_url, posted: (j.published_at ?? '').slice(0, 10) || null,
    })),
  },
]

const adapterFor = (url) => ADAPTERS.find((a) => a.match.test(url)) ?? null

// --- the list --------------------------------------------------------------

/**
 * Parse COMPANIES.md. One row per company: name, an endpoint or careers page,
 * and the line saying what put it there. The endpoint may be bare, wrapped in
 * backticks, wrapped in angle brackets, or prefixed with its ATS name - all
 * four shapes appear in a hand-edited file, and all four are read here.
 */
export function parseCompanies(md) {
  const out = []
  for (const line of md.split('\n')) {
    const l = line.trim()
    if (!l.startsWith('|') || /^\|\s*-+/.test(l)) continue
    const cells = l.slice(1, l.endsWith('|') ? -1 : undefined).split(/(?<!\\)\|/).map((c) => c.trim())
    if (cells.length < 2) continue
    const [company, board, why = ''] = cells
    if (!company || /^company$/i.test(company)) continue
    const url = board.replace(/^[a-z]+:\s*/i, '').replace(/^[`<]|[`>]$/g, '').trim()
    if (!/^https?:\/\//i.test(url)) { out.push({ company, url: null, why }); continue }
    out.push({ company, url, why })
  }
  return out
}

// --- fetching --------------------------------------------------------------

async function fetchBoard(entry) {
  const adapter = adapterFor(entry.url)
  if (!adapter) return { ...entry, ats: null, postings: null, error: 'no adapter - not a known ATS API' }
  try {
    const res = await fetch(entry.url, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return { ...entry, ats: adapter.ats, postings: null, error: `HTTP ${res.status}` }
    const rows = adapter.rows(await res.json())
      .filter((r) => r.title)
      .map((r) => ({ ...r, title: String(r.title).trim() }))
    return { ...entry, ats: adapter.ats, postings: rows, error: null }
  } catch (e) {
    return { ...entry, ats: adapter.ats, postings: null, error: String(e?.message ?? e) }
  }
}

async function pool(items, worker, limit = CONCURRENCY) {
  const out = new Array(items.length)
  let next = 0
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await worker(items[i], i)
    }
  }))
  return out
}

// --- the gates -------------------------------------------------------------

// Locations match on the same whole-token rule as the title exclusions, which
// is what makes a short one safe to write. A board says "Remote - US" and
// "Remote - CA" as often as it says "United States", and a substring match on
// "us" would fire inside "Australia" while one on "ca" would fire inside
// "Cambridge" - so the useful tokens are exactly the ones a substring match
// cannot express.
const locationMatcher = excludeMatcher

export function sift(boards, { exclude = [], since = null, locations = [], notLocations = [] } = {}) {
  const rx = excludeMatcher(exclude)
  const loc = locationMatcher(locations)
  // "Remote" is a working pattern, not a place, and every board writes it
  // beside one: "United States (Remote)" matches a bare "remote" allow-list
  // and is no use to anyone in the UK. So an out-of-scope place is read
  // first, and settles the location whatever else the string says.
  const notLoc = locationMatcher(notLocations)
  const matches = []
  const dropped = { band: 0, excluded: 0, discipline: 0, location: 0, stale: 0 }
  let seen = 0

  for (const b of boards) {
    if (!b.postings) continue
    for (const p of b.postings) {
      seen++
      const g = gradeTitle(p.title, { exclude: rx })
      if (!g.verdict) { dropped[g.reason]++; continue }
      // A posting with no location is not dropped for one - plenty of boards
      // omit it, and a fetch settles it. Only a stated mismatch drops.
      if (notLoc && p.location && notLoc.test(p.location)) { dropped.location++; continue }
      if (loc && p.location && !loc.test(p.location)) { dropped.location++; continue }
      if (since && p.posted && p.posted < since) { dropped.stale++; continue }
      matches.push({
        company: b.company, ats: b.ats, title: p.title, location: p.location,
        url: p.url, posted: p.posted, match: g.verdict, why: b.why,
      })
    }
  }
  // Ambiguous titles last: they are the ones an agent has to settle with a
  // fetch, and a caller working down the list should spend its budget on the
  // ones that already read as software.
  matches.sort((a, b) => (a.match === b.match ? 0 : a.match === 'strong' ? -1 : 1))
  return { matches, seen, dropped }
}

// --- CLI -------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2)
  const arg = (name, fallback = null) => {
    const i = argv.indexOf(`--${name}`)
    return i === -1 ? fallback : argv[i + 1]
  }
  const list = arg('companies')
  if (!list) {
    console.error('usage: node companies.mjs --companies <path to COMPANIES.md> [--exclude "a,b"] [--since YYYY-MM-DD] [--locations "united kingdom,remote"]')
    process.exit(2)
  }

  let md
  try {
    md = await readFile(list, 'utf8')
  } catch {
    // A missing list is the documented case, not an error: Modality 7 has no
    // generic fallback, and says so rather than inventing companies.
    console.log(JSON.stringify({
      companies: 0, matches: [], needAgent: [], failed: [],
      note: `no companies file at ${list} - Modality 7 has nothing to ask and returns nothing`,
    }, null, 2))
    process.exit(0)
  }

  const entries = parseCompanies(md)
  const withApi = entries.filter((e) => e.url && adapterFor(e.url))
  const needAgent = entries.filter((e) => !e.url || !adapterFor(e.url))

  const boards = await pool(withApi, fetchBoard)
  const ok = boards.filter((b) => b.postings)
  const failed = boards.filter((b) => !b.postings)
    .map((b) => ({ company: b.company, url: b.url, error: b.error }))

  const csv = (name) => (arg(name) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const { matches, seen, dropped } = sift(ok, {
    exclude: csv('exclude'),
    since: arg('since'),
    locations: csv('locations'),
    notLocations: csv('not-locations'),
  })

  console.log(JSON.stringify({
    companies: entries.length,
    asked: withApi.length,
    reachable: ok.length,
    postingsSeen: seen,
    matches,
    // These carry a careers page rather than an API, so they cannot be read
    // here. They are the agent's to fetch by hand - listed, not dropped.
    needAgent: needAgent.map(({ company, url, why }) => ({ company, url, why })),
    failed,
    dropped,
  }, null, 2))
}
