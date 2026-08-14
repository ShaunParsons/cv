export const meta = {
  name: 'find-jobs-sweep',
  description: 'Fan out six job-search modalities, dedupe, verify each lead, apply the standing filters',
  phases: [
    { title: 'Sweep', detail: 'one searcher per modality', model: 'sonnet' },
    { title: 'Verify', detail: 'verifiers over the deduped leads', model: 'sonnet' },
  ],
}

// Everything time- or figure-dependent arrives via args, so this committed
// script carries neither. The repo is public; the stack filter lives in the
// user's memory and the salary floor in .env (CV_SALARY_FLOOR), and both
// pass through here at runtime only.
//   sweepDoc        absolute path to this skill's SWEEP.md
//   today           YYYY-MM-DD
//   sinceDate       YYYY-MM-DD - start of the posting window
//   windowLabel     human wording of the window, e.g. "the last 2 weeks"
//   brief           { titles: [], locationScope: "", stackKeywords: [], band: "" }
//   stackFilter     wording of the standing stack filter, or null
//   salaryFloorGbp  standing floor for permanent roles as a number, or null

// Tolerate args arriving JSON-encoded rather than as an object.
const input = typeof args === 'string' ? JSON.parse(args) : (args ?? {})
for (const k of ['sweepDoc', 'today', 'sinceDate', 'windowLabel', 'brief']) {
  if (input[k] == null) throw new Error(`missing args.${k}`)
}
const { sweepDoc, today, sinceDate, windowLabel, brief } = input

// The browser-fetch fallback lives beside this script; derive its path from
// sweepDoc so the prompts can name it absolutely.
const browserFetch = sweepDoc.replace(/\/SWEEP\.md$/, '/scripts/browser_fetch.mjs')

const LEADS_SCHEMA = {
  type: 'object',
  required: ['leads'],
  properties: {
    leads: {
      type: 'array',
      items: {
        type: 'object',
        required: ['company', 'title', 'url', 'source', 'location', 'working',
                   'salary', 'type', 'market', 'speculative', 'notes'],
        properties: {
          company: { type: 'string' },
          title: { type: 'string' },
          url: { type: 'string' },
          source: { type: 'string', description: 'board or site the lead was found through' },
          location: { type: 'string' },
          working: { enum: ['on-site', 'hybrid', 'remote', 'unknown'] },
          salary: { type: 'string', description: 'as stated in the result, or empty' },
          type: { enum: ['permanent', 'contract', 'unknown'] },
          market: { enum: ['board', 'hidden'] },
          speculative: { type: 'boolean', description: 'true only for a strong hiring signal with no live posting yet' },
          notes: { type: 'string' },
        },
      },
    },
  },
}

const VERDICTS_SCHEMA = {
  type: 'object',
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['url', 'live', 'confirmed', 'postedDate', 'locationOk', 'stackOk',
                   'seniorityOk', 'type', 'salaryMinGbp', 'salaryMaxGbp',
                   'working', 'notes'],
        properties: {
          url: { type: 'string', description: 'the lead url, unchanged, so verdicts join back to leads' },
          live: { type: 'boolean' },
          confirmed: { type: 'boolean', description: 'true when the live-or-dead call rests on a directly loaded page or an authoritative API response, false when inferred' },
          postedDate: { type: ['string', 'null'], description: 'YYYY-MM-DD, or null if the page shows no date' },
          locationOk: { type: 'boolean' },
          stackOk: { type: 'boolean' },
          seniorityOk: { type: 'boolean' },
          type: { enum: ['permanent', 'contract', 'unknown'] },
          salaryMinGbp: { type: ['number', 'null'] },
          salaryMaxGbp: { type: ['number', 'null'] },
          working: { enum: ['on-site', 'hybrid', 'remote', 'unknown'] },
          notes: { type: 'string' },
        },
      },
    },
  },
}

const MODALITIES = [
  { n: 1, key: 'boards', name: 'major boards' },
  { n: 2, key: 'startup', name: 'startup boards and threads' },
  { n: 3, key: 'ats', name: 'ATS-hosted careers pages' },
  { n: 4, key: 'signals', name: 'hiring signals' },
  { n: 5, key: 'recruiters', name: 'specialist recruiter boards' },
  { n: 6, key: 'remote', name: 'remote-first job boards' },
]

const searchPrompt = (m) => `You are one searcher in a fanned-out job sweep. ${MODALITIES.length} searchers run in
parallel, each on a different modality; yours is Modality ${m.n} (${m.name}).

Read ${sweepDoc} and follow its preamble plus ONLY the "Modality ${m.n}" section.

The brief:
- Titles: ${brief.titles.join('; ')} - and their common synonyms
- Location scope: ${brief.locationScope}
- Stack keywords: ${brief.stackKeywords.join(', ')}
- Seniority band: ${brief.band}
- Posting window: ${windowLabel}, i.e. posted on or after ${sinceDate}. Today is ${today}.

Use WebSearch and WebFetch - load them via ToolSearch first if they are not
already available. Where a page WebFetch cannot read (a 403, a hung
connection, an empty client-rendered shell) stands between you and a lead,
render it through the local browser instead, with Bash:
  node ${browserFetch} "<url>"
It prints JSON carrying the rendered page's text, final URL and HTTP status.
Return every candidate lead; do not filter on salary or on stack fit beyond
the keywords, because filtering happens downstream. A lead needs a URL you
actually saw in a result or on a page - never one you constructed or
recalled.`

const verifyPrompt = (chunk) => `Verify these job leads one by one. Read the "Verification checklist"
section of ${sweepDoc} first and hold every lead against every item.

Today is ${today}. The posting window is ${windowLabel} - it opened ${sinceDate}.
Location scope: ${brief.locationScope}
Seniority band: ${brief.band}
Standing stack filter: ${input.stackFilter ?? 'none supplied'}

For each lead, fetch its URL with WebFetch (load it via ToolSearch if needed)
and report what the page actually shows. Where WebFetch is refused (403),
times out, or returns an empty client-rendered shell, and no ATS public API
covers the page, render it through the local browser instead, with Bash:
  node ${browserFetch} "<url>"
It prints JSON carrying the rendered page's text, final URL and HTTP status -
treat that as a directly loaded page when calling confirmed. A rendered
bot-check or consent interstitial with no job content settles nothing, and
the lead stays unconfirmed. Extract rather than decide: report any salary
band in GBP numbers and leave the floor comparison to the caller. Return one
verdict per lead, carrying the same url unchanged.

Leads:
${JSON.stringify(chunk, null, 2)}`

phase('Sweep')
const sweeps = await parallel(MODALITIES.map((m) => () =>
  agent(searchPrompt(m), { label: `sweep:${m.key}`, phase: 'Sweep', model: 'sonnet', schema: LEADS_SCHEMA })))
// Barrier justified: the dedupe needs every searcher's results together.
const raw = sweeps.filter(Boolean).flatMap((r) => r.leads)
const perModality = Object.fromEntries(MODALITIES.map((m, i) => [m.key, sweeps[i]?.leads.length ?? 0]))

// Dedupe on normalised company + title - the same role surfacing through
// several modalities is one vacancy, and the extra sightings are a signal.
const dedupeKey = (l) => `${l.company} ${l.title}`.toLowerCase()
  .replace(/\b(ltd|limited|inc|plc|llc)\b/g, '')
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const byKey = new Map()
for (const l of raw) {
  const k = dedupeKey(l)
  const seen = byKey.get(k)
  if (!seen) byKey.set(k, { ...l, alsoVia: [] })
  else if (l.source !== seen.source && !seen.alsoVia.includes(l.source)) seen.alsoVia.push(l.source)
}
const deduped = [...byKey.values()]
const speculative = deduped.filter((l) => l.speculative)
// Hidden-market leads verify first, so if the cap ever bites it falls on
// board leads - the hidden list is the one this skill exists for.
let toVerify = deduped.filter((l) => !l.speculative)
  .sort((a, b) => (a.market === 'board' ? 1 : 0) - (b.market === 'board' ? 1 : 0))
log(`${raw.length} raw leads -> ${deduped.length} deduped (${speculative.length} speculative)`)

const CAP = 120
const unverifiedOverflow = toVerify.slice(CAP)
if (unverifiedOverflow.length) log(`verification capped at ${CAP} leads - ${unverifiedOverflow.length} left unverified`)
toVerify = toVerify.slice(0, CAP)

phase('Verify')
const CHUNK = 4
const chunks = []
for (let i = 0; i < toVerify.length; i += CHUNK) chunks.push(toVerify.slice(i, i + CHUNK))
const verdictSets = await parallel(chunks.map((c, i) => () =>
  agent(verifyPrompt(c), { label: `verify:${i + 1}/${chunks.length}`, phase: 'Verify', model: 'sonnet', schema: VERDICTS_SCHEMA })))
const verdictByUrl = new Map()
for (const set of verdictSets.filter(Boolean)) for (const v of set.verdicts) verdictByUrl.set(v.url, v)

// ISO dates compare correctly as strings, so no Date construction is needed.
const dropReason = (v) => {
  if (!v) return 'unverified'
  if (!v.live) return v.confirmed ? 'dead' : 'unconfirmed'
  if (v.postedDate && v.postedDate < sinceDate) return 'stale'
  if (!v.locationOk) return 'location'
  if (!v.stackOk) return 'stack'
  if (!v.seniorityOk) return 'seniority'
  if (v.type === 'permanent' && input.salaryFloorGbp != null
      && v.salaryMaxGbp != null && v.salaryMaxGbp < input.salaryFloorGbp) return 'salary'
  return null
}

const shortlist = []
const unconfirmed = []
const dropped = {}
for (const l of toVerify) {
  const v = verdictByUrl.get(l.url)
  const reason = dropReason(v)
  if (reason) {
    dropped[reason] = (dropped[reason] ?? 0) + 1
    if (reason === 'unconfirmed') unconfirmed.push({ ...l, ...v })
    continue
  }
  shortlist.push({ ...l, ...v })
}
log(`${shortlist.length} leads survive verification (${unconfirmed.length} unconfirmed)`)

return {
  shortlist,
  unconfirmed,
  speculative,
  unverifiedOverflow,
  stats: { raw: raw.length, perModality, deduped: deduped.length, dropped },
}
