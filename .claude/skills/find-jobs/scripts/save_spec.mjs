#!/usr/bin/env node
// Save one job posting's text to a file, verbatim.
//
// A listing is taken down within weeks, and a verifier that reads a posting
// and reports six booleans about it has thrown away the only copy there will
// ever be. This writes that copy to disk at the moment the posting is read,
// so the record keeps the spec rather than a memory of it.
//
//   node save_spec.mjs <url> --out <path> [--force] [--timeout <ms>]
//   node save_spec.mjs <url> --applications <dir> --company <c> --role <r>
//
// The second form derives the path, and with it the record's directory name:
// `<dir>/<company>-<role>/spec.txt`, lower case with hyphens. That rule lives
// here and only here. The sweep, the verify-only pass and the main loop all
// name a lead's directory by running this and reading back `slug`, so a
// record cannot end up written to one directory and its spec to another.
//
// Within one run that was always true. Across runs it was not, because
// `company` and `role` are free text an agent writes afresh each sweep -
// "Formula Recruitment" one week and "Formula Recruitment - well-established,
// product-led consumer platform business (access & account management
// domain), remote UK" the next, for the same vacancy at the same URL. Two
// wordings, two slugs, two directories, one posting. So the slug is not the
// identity: the posting is. Before deriving anything this indexes the records
// already on disk by posting - the ATS org and id where the URL carries them,
// a normalised URL otherwise - and reuses the directory a matching record
// already occupies. Identity is read from `spec.meta.json`, which this writes
// beside every spec, and from the URLs in an `application.md`'s front matter,
// which is what makes the fix reach records written before it existed.
//
// The same index makes the opposite error visible. Two genuinely different
// vacancies can slug identically - an agency's clients are anonymised, so two
// of its "Engineering Manager" postings collide - and the refusal to
// overwrite then quietly reported another role's spec as this one's. Where
// the derived directory is already held by a different posting, the slug
// takes a short suffix from the posting key rather than landing on top of it.
//
// stdout on success: one JSON object -
//   { url, finalUrl, slug, path, chars, source, postingKey, identity,
//     reusedFrom?, possibleDuplicates? }
// where source is one of: greenhouse, lever, ashby, smartrecruiters,
// workable, fetch, browser, existing; identity is `matched` when an existing
// record was recognised as this posting, `disambiguated` when the derived
// name was already held by a different one, `unverified` when it was held by
// a record carrying no URL to check against, and `derived` otherwise;
// reusedFrom carries the name this run would have used had it not matched.
// Exit 1 with JSON { error, url } on stderr when nothing could be read.
//
// The extraction is deterministic on purpose. An agent that has the page in
// its context could write the file itself, but what lands is then a
// re-transcription - paraphrased, truncated, or silently summarised - and
// "verbatim" is the whole property this file exists to hold.

import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
const url = argv.find((a) => !a.startsWith('--'))
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : null
}
const force = argv.includes('--force')
const timeout = Number(flag('timeout') ?? 30_000)

// `montu-uk-tech-lead` - company then role, lower case, hyphens for
// everything else. Capped because some boards write a whole sentence into the
// title field and a 200-character directory name helps nobody.
const slugify = (...parts) => parts
  .filter(Boolean)
  .join(' ')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 90)
  .replace(/-+$/, '')

// ------------------------------------------------------- posting identity
//
// What makes two leads the same lead. The ATS ones are exact - an org and a
// requisition id, stable however the board around them words the title. The
// rest normalise the URL: host without `www.`, path without its trailing
// slash, query dropped entirely, because a board rewrites its tracking
// parameters on every impression and the same posting arrives with a
// different query string each time it is found.

const POSTING_PATTERNS = {
  greenhouse: /(?:job-boards|boards)\.greenhouse\.io\/([^/]+)\/jobs\/(\d+)/,
  lever: /jobs\.lever\.co\/([^/]+)\/([0-9a-f-]{8,})/i,
  ashby: /jobs\.ashbyhq\.com\/([^/]+)\/([0-9a-f-]{8,})/i,
  smartrecruiters: /jobs\.smartrecruiters\.com\/([^/]+)\/(\d+)/,
  workable: /apply\.workable\.com\/([^/]+)\/j\/([0-9A-F]+)/i,
  // LinkedIn writes the id into the slug and again into the query, and the
  // two forms of the URL are otherwise nothing alike.
  linkedin: /linkedin\.com\/jobs\/(?:view\/(?:[^/?#]*-)?(\d{6,})|search-results\/?\?.*?currentJobId=(\d+))/i,
}

const postingKey = (u) => {
  if (!u) return null
  for (const [name, re] of Object.entries(POSTING_PATTERNS)) {
    const m = String(u).match(re)
    if (m) {
      const parts = m.slice(1).filter(Boolean).map((x) => x.toLowerCase())
      return `${name}:${parts.join(':')}`
    }
  }
  try {
    const { hostname, pathname } = new URL(u)
    return `url:${hostname.replace(/^www\./, '').toLowerCase()}:${pathname.replace(/\/+$/, '').toLowerCase()}`
  } catch {
    return `url:${String(u).toLowerCase()}`
  }
}

const shortKey = (key) => createHash('sha1').update(key).digest('hex').slice(0, 6)

// Every record on disk, indexed by every posting it can be shown to be about.
// Two sources, because neither alone covers the folder: `spec.meta.json` is
// what this script writes and is authoritative, and the URLs in an
// `application.md`'s front matter are what the records written before it
// carry. Records rebuilt with an empty `links:` carry no identity at all and
// cannot be matched by anything - they are named in `possibleDuplicates`
// instead, on the title, for a human to settle.
const indexRecords = (dir) => {
  const byKey = new Map()
  const byCompanyRole = []
  let entries = []
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return { byKey, byCompanyRole } }
  for (const e of entries) {
    if (!e.isDirectory()) continue
    const keys = new Set()
    try {
      const meta = JSON.parse(readFileSync(join(dir, e.name, 'spec.meta.json'), 'utf8'))
      for (const k of [meta.postingKey, postingKey(meta.url), postingKey(meta.finalUrl)]) if (k) keys.add(k)
    } catch { /* no meta, or unreadable - fall through to the front matter */ }
    let front = ''
    try {
      const text = readFileSync(join(dir, e.name, 'application.md'), 'utf8')
      const end = text.indexOf('\n---', 4)
      front = text.startsWith('---') && end > 0 ? text.slice(0, end) : text.slice(0, 2000)
    } catch { /* a directory with a spec and no record yet */ }
    for (const [u] of front.matchAll(/https?:\/\/\S+/g)) {
      const k = postingKey(u.replace(/[)>,'"\]]+$/, ''))
      if (k) keys.add(k)
    }
    for (const k of keys) if (!byKey.has(k)) byKey.set(k, e.name)
    const line = (name) => (front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm')) ?? [])[1]
    byCompanyRole.push({ slug: e.name, company: line('company') ?? '', role: line('role') ?? '', keys })
  }
  return { byKey, byCompanyRole }
}

const norm = (t) => String(t ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const firstWords = (t, n) => norm(t).split(' ').slice(0, n).join(' ')

const applications = flag('applications')
const company = flag('company')
const role = flag('role')
const key = postingKey(url)

let slug = applications ? slugify(company, role) : null
let reusedFrom = null
let identity = 'derived'
let possibleDuplicates = []

if (applications && slug) {
  const { byKey, byCompanyRole } = indexRecords(applications)

  const match = key ? byKey.get(key) : null
  if (match) {
    // The same posting is already recorded. Its directory is the answer,
    // whatever this run happens to be calling the company today.
    if (match !== slug) reusedFrom = slug
    slug = match
    identity = 'matched'
  } else {
    // A different posting may already hold this name. Two anonymised agency
    // clients slug identically, and landing on top of one would report its
    // spec as this lead's.
    const holder = byCompanyRole.find((r) => r.slug === slug)
    if (holder && holder.keys.size && key && !holder.keys.has(key)) {
      slug = `${slug.slice(0, 83)}-${shortKey(key)}`
      identity = 'disambiguated'
    } else if (holder && !holder.keys.size && existsSync(join(applications, slug, 'spec.txt'))) {
      // A record with no URL anywhere in it - one of the ones rebuilt after
      // the folder was lost - already holds this name and already holds a
      // spec. It cannot be shown to be this posting and it cannot be shown
      // not to be, so the directory is reused as before and the answer says
      // it is unverified rather than implying a match that was never made.
      identity = 'unverified'
    }
  }

  // Advisory only, and never allowed to move anything: same company, same
  // opening words of the title, no shared identity. That is the shape of a
  // duplicate whose other half predates the identity index, and of two
  // genuinely distinct requisitions with near-identical titles. A script
  // cannot tell those apart, so it says so rather than guessing.
  if (identity !== 'matched') {
    possibleDuplicates = byCompanyRole
      .filter((r) => r.slug !== slug
        && firstWords(r.company, 2) && firstWords(r.company, 2) === firstWords(company, 2)
        && firstWords(r.role, 3) && firstWords(r.role, 3) === firstWords(role, 3)
        && !(key && r.keys.has(key)))
      .map((r) => r.slug)
  }
}

const out = flag('out') ?? (slug ? join(applications, slug, 'spec.txt') : null)

if (!url || !out) {
  console.error(JSON.stringify({
    error: 'usage: save_spec.mjs <url> (--out <path> | --applications <dir> --company <c> --role <r>) [--force]',
  }))
  process.exit(2)
}
if (applications && !slug) {
  console.error(JSON.stringify({ error: '--company and --role are required with --applications', url }))
  process.exit(2)
}

// Written beside every spec, so the next run matches this posting on its
// identity rather than on how an agent worded the company that day.
const writeMeta = (extra) => {
  if (!applications) return
  try {
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(join(dirname(out), 'spec.meta.json'),
      `${JSON.stringify({ url, postingKey: key, company, role, slug, ...extra }, null, 2)}\n`, 'utf8')
  } catch { /* the spec is the deliverable; the index is a convenience */ }
}

const MIN_CHARS = 400   // below this it is a consent wall or an empty shell, not a spec
const MAX_CHARS = 60_000

// ---------------------------------------------------------------- text

// ATS payloads are routinely double-escaped - `&amp;nbsp;` in the JSON, which
// one unescape pass turns into a literal `&nbsp;` sitting in the saved file.
// Unescape until it stops changing.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '-', mdash: '-', hellip: '...', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', pound: '£', euro: '€', bull: '-',
}
const unescapeOnce = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
const unescapeAll = (s) => {
  let prev
  do { prev = s; s = unescapeOnce(s) } while (s !== prev)
  return s
}

const stripTags = (s) => String(s)
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|li|tr|h[1-6]|ul|ol|section|article)>/gi, '\n\n')
  .replace(/<li\b[^>]*>/gi, '- ')
  .replace(/<[^>]+>/g, '')

// Strip and unescape alternately rather than once each. A JSON-LD JobPosting
// carries its description as *escaped* markup, so stripping first finds no
// tags and unescaping then leaves literal `<p>` in the saved file - the same
// ordering bug as the double-escaped ATS payloads, arriving from the other
// side. Repeat until it stops changing, bounded so a pathological input
// cannot spin.
const htmlToText = (html) => {
  let t = String(html)
  for (let i = 0; i < 3; i++) {
    const next = unescapeAll(stripTags(t))
    if (next === t) break
    t = next
  }
  return tidy(t)
}

const tidy = (t) => {
  const lines = String(t)
    .replace(/ /g, ' ')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const get = async (u, headers = {}) => {
  const res = await fetch(u, {
    headers: { 'user-agent': UA, 'accept-language': 'en-GB,en;q=0.9', ...headers },
    signal: AbortSignal.timeout(timeout),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

// ---------------------------------------------------------------- ATS APIs
//
// Each returns the posting's text, or null to fall through to the next
// strategy. A wrong guess about an API's shape must degrade rather than
// fail: the plain fetch and the browser render are behind all of these.

const ats = [
  {
    name: 'greenhouse',
    match: POSTING_PATTERNS.greenhouse,
    async read([, board, id]) {
      const r = await get(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${id}`)
      const j = await r.json()
      if (!j?.content) return null
      const head = [j.title, j.location?.name].filter(Boolean).join('\n')
      return `${head}\n\n${htmlToText(j.content)}`
    },
  },
  {
    name: 'lever',
    match: POSTING_PATTERNS.lever,
    async read([, org, id]) {
      const r = await get(`https://api.lever.co/v0/postings/${org}/${id}`)
      const j = await r.json()
      const parts = [
        [j.text, j.categories?.location, j.categories?.commitment].filter(Boolean).join('\n'),
        j.descriptionPlain ?? (j.description ? htmlToText(j.description) : ''),
        ...(j.lists ?? []).map((l) => `${l.text}\n${htmlToText(l.content ?? '')}`),
        j.additionalPlain ?? (j.additional ? htmlToText(j.additional) : ''),
      ].filter((p) => p && p.trim())
      return parts.length ? parts.join('\n\n') : null
    },
  },
  {
    name: 'ashby',
    match: POSTING_PATTERNS.ashby,
    async read([, org, id]) {
      const r = await get(
        `https://api.ashbyhq.com/posting-api/job-board/${org}?includeCompensation=true`)
      const j = await r.json()
      const post = (j?.jobs ?? []).find((p) => p.id === id || p.jobUrl?.includes(id))
      if (!post) return null
      const head = [post.title, post.location, post.employmentType].filter(Boolean).join('\n')
      const body = post.descriptionPlain
        ?? (post.descriptionHtml ? htmlToText(post.descriptionHtml) : '')
      return body ? `${head}\n\n${body}` : null
    },
  },
  {
    name: 'smartrecruiters',
    match: POSTING_PATTERNS.smartrecruiters,
    async read([, company, id]) {
      const r = await get(`https://api.smartrecruiters.com/v1/companies/${company}/postings/${id}`)
      const j = await r.json()
      const secs = j?.jobAd?.sections ?? {}
      const body = ['companyDescription', 'jobDescription', 'qualifications', 'additionalInformation']
        .map((k) => secs[k]?.text).filter(Boolean).map(htmlToText).join('\n\n')
      return body ? `${j.name ?? ''}\n${j.location?.city ?? ''}\n\n${body}` : null
    },
  },
  {
    name: 'workable',
    match: POSTING_PATTERNS.workable,
    async read([, org, shortcode]) {
      const r = await get(
        `https://apply.workable.com/api/v1/accounts/${org}/jobs/${shortcode}`,
        { accept: 'application/json' })
      const j = await r.json()
      const body = [j.description, j.requirements, j.benefits]
        .filter(Boolean).map(htmlToText).join('\n\n')
      return body ? `${j.title ?? ''}\n${j.location?.city ?? ''}\n\n${body}` : null
    },
  },
]

// ---------------------------------------------------------------- strategies

const plainFetch = async () => {
  const r = await get(url)
  const html = await r.text()
  // Prefer the JSON-LD JobPosting where the page carries one: it is the
  // employer's own structured copy, without the board's chrome around it.
  const ld = [...html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
  for (const [, raw] of ld) {
    try {
      const items = [].concat(JSON.parse(raw.trim()))
      for (const it of items) {
        if (it?.['@type'] === 'JobPosting' && it.description) {
          const head = [it.title, it.jobLocation?.address?.addressLocality,
            it.hiringOrganization?.name].filter(Boolean).join('\n')
          return { text: `${head}\n\n${htmlToText(it.description)}`, finalUrl: r.url }
        }
      }
    } catch { /* a malformed block is not a reason to stop */ }
  }
  return { text: htmlToText(html), finalUrl: r.url }
}

const browserRender = () => {
  const script = fileURLToPath(new URL('./browser_fetch.mjs', import.meta.url))
  const stdout = execFileSync('node', [script, url, '--timeout', String(timeout)], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: timeout + 30_000,
  })
  const j = JSON.parse(stdout)
  return { text: tidy(j.text ?? ''), finalUrl: j.finalUrl ?? url }
}

// ---------------------------------------------------------------- run

const report = (extra) => JSON.stringify({
  url, slug, path: out, postingKey: key, identity,
  ...(reusedFrom ? { reusedFrom } : {}),
  ...(possibleDuplicates.length ? { possibleDuplicates } : {}),
  ...extra,
})

if (!force && existsSync(out) && statSync(out).size > MIN_CHARS) {
  // The first capture is the posting as it stood when the lead was found, and
  // that is the one worth keeping. Overwriting needs --force and a reason.
  // The identity file is backfilled even so: a record that predates it is
  // exactly the one the next run needs to be able to match.
  if (applications && !existsSync(join(dirname(out), 'spec.meta.json'))) writeMeta({ backfilled: true })
  console.log(report({ chars: statSync(out).size, source: 'existing' }))
  process.exit(0)
}

const attempts = []
let text = null
let finalUrl = url
let source = null

for (const a of ats) {
  const m = url.match(a.match)
  if (!m) continue
  try {
    const t = await a.read(m)
    if (t && t.length >= MIN_CHARS) { text = t; source = a.name; break }
    attempts.push(`${a.name}: ${t ? `${t.length} chars, too short` : 'no content'}`)
  } catch (e) {
    attempts.push(`${a.name}: ${e.message}`)
  }
}

if (!text) {
  for (const [name, fn] of [['fetch', plainFetch], ['browser', browserRender]]) {
    try {
      const r = await fn()
      if (r.text && r.text.length >= MIN_CHARS) {
        text = r.text; finalUrl = r.finalUrl ?? url; source = name; break
      }
      attempts.push(`${name}: ${r.text ? `${r.text.length} chars, too short` : 'empty'}`)
    } catch (e) {
      attempts.push(`${name}: ${e.message}`)
    }
  }
}

if (!text) {
  // The slug goes out with the failure too. A verifier that cannot save the
  // spec still has to name the lead's directory, and deriving one by hand at
  // that point is the second derivation this script exists to prevent.
  console.error(JSON.stringify({ error: 'nothing readable at this url', url, slug, postingKey: key, attempts }))
  process.exit(1)
}

if (text.length > MAX_CHARS) text = `${text.slice(0, MAX_CHARS)}\n\n[truncated at ${MAX_CHARS} characters]`

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${text}\n`, 'utf8')
writeMeta({ finalUrl, source })
console.log(report({ finalUrl, chars: text.length, source }))
