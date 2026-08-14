export const meta = {
  name: 'find-jobs-sweep',
  description: 'Fan out seven job-search modalities, dedupe, verify each lead, apply the standing filters',
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
//   brief           { titles: [], locationScope: "", stackKeywords: [], band: "",
//                     locationTerms: [] } - locationTerms is locationScope as
//                     matchable strings, e.g. ["united kingdom", "london",
//                     "remote"], for the gates that are arithmetic. Absent or
//                     empty allows any location.
//   stackFilter     wording of the standing stack filter, or null
//   salaryFloorGbp  standing floor for permanent roles as a number, or null
//   excludeTitleTerms  the same standing filter as matchable terms - used by
//                      the title gate, which is arithmetic and so cannot read
//                      the prose stackFilter carries. The terms themselves
//                      belong to the caller and are not written down here.
//                      Empty or absent applies no exclusion.
//   notLocations    places outside the scope, e.g. ["united states", "india"].
//                   "Remote" is a working pattern rather than a place and every
//                   board writes it beside one, so an out-of-scope country has
//                   to be read before "remote" can be believed.

// Tolerate args arriving JSON-encoded rather than as an object.
const input = typeof args === 'string' ? JSON.parse(args) : (args ?? {})
for (const k of ['sweepDoc', 'today', 'sinceDate', 'windowLabel', 'brief']) {
  if (input[k] == null) throw new Error(`missing args.${k}`)
}
const { sweepDoc, today, sinceDate, windowLabel, brief } = input

// The browser-fetch fallback lives beside this script; derive its path from
// sweepDoc so the prompts can name it absolutely.
const browserFetch = sweepDoc.replace(/\/SWEEP\.md$/, '/scripts/browser_fetch.mjs')
// The two standing lists are gitignored, so they are named rather than
// inlined: a searcher reads its own, and reports its absence rather than
// inventing entries to fill it.
const recruitersDoc = sweepDoc.replace(/\/SWEEP\.md$/, '/RECRUITERS.md')
const companiesDoc = sweepDoc.replace(/\/SWEEP\.md$/, '/COMPANIES.md')
// The title gate, and Modality 7's board fetcher which is built on it.
const titleFilter = sweepDoc.replace(/\/SWEEP\.md$/, '/scripts/title_filter.mjs')
const companiesScript = sweepDoc.replace(/\/SWEEP\.md$/, '/scripts/companies.mjs')

const excludeTerms = input.excludeTitleTerms ?? []
const notLocations = input.notLocations ?? []
const csv = (xs) => xs.join(',')

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
        required: ['url', 'live', 'confirmed', 'postedDate', 'locationOk', 'softwareRole',
                   'stackOk', 'seniorityOk', 'type', 'salaryMinGbp', 'salaryMaxGbp',
                   'working', 'applyUrl', 'notes'],
        properties: {
          url: { type: 'string', description: 'the lead url, unchanged, so verdicts join back to leads' },
          live: { type: 'boolean' },
          confirmed: { type: 'boolean', description: 'true when the live-or-dead call rests on a directly loaded page or an authoritative API response, false when inferred' },
          postedDate: { type: ['string', 'null'], description: 'YYYY-MM-DD, or null if the page shows no date' },
          locationOk: { type: 'boolean' },
          softwareRole: { type: 'boolean', description: 'software engineering, rather than engineering in one of the several other senses that share the word - mechanical, process, civil, or a sales or product role using the title' },
          stackOk: { type: 'boolean' },
          seniorityOk: { type: 'boolean' },
          type: { enum: ['permanent', 'contract', 'unknown'] },
          salaryMinGbp: { type: ['number', 'null'] },
          salaryMaxGbp: { type: ['number', 'null'] },
          working: { enum: ['on-site', 'hybrid', 'remote', 'unknown'] },
          applyUrl: { type: ['string', 'null'], description: "the same vacancy on the employer's own careers page or the ATS behind it, where the application should go; the lead's own url when it is already there; null when no match was found" },
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
  { n: 5, key: 'recruiters', name: 'specialist recruiter boards', doc: recruitersDoc },
  { n: 6, key: 'remote', name: 'remote-first job boards' },
  { n: 7, key: 'companies', name: 'target companies', doc: companiesDoc, script: true },
]

// Modality 7's list runs to hundreds of companies, so its boards are fetched
// and gated in plain code rather than one at a time by the agent - the same
// split as everywhere else here: arithmetic in a script, reading in an agent.
const companiesCommand = `node ${companiesScript} --companies ${companiesDoc} \\
    --exclude "${csv(excludeTerms)}" --since ${sinceDate} \\
    --locations "${csv(brief.locationTerms ?? [])}" \\
    --not-locations "${csv(notLocations)}"`

const searchPrompt = (m) => `You are one searcher in a fanned-out job sweep. ${MODALITIES.length} searchers run in
parallel, each on a different modality; yours is Modality ${m.n} (${m.name}).

Read ${sweepDoc} and follow its preamble plus ONLY the "Modality ${m.n}" section.
${m.doc && !m.script ? `\nYour modality works from a standing list, held outside the repo at\n  ${m.doc}\nRead it with the Read tool before you search. Where the file is missing or\nholds no entries, say so plainly in your notes and follow what your modality\nsection says to do about it - never substitute entries of your own.\n` : ''}${m.script ? `\nYour modality works from a standing list of companies, held outside the repo\nat\n  ${m.doc}\nIt runs to hundreds of entries, so do NOT read it and fetch the boards one by\none - you would run out of context long before the end of it. Run this first,\nwith Bash:\n\n  ${companiesCommand}\n\nIt reads every board on the list, discards the postings whose titles are out\nof band, name something ruled out, or sit outside the location scope, and\nprints what is left as JSON. That is your candidate set, and it is the whole\nlist's answer rather than a sample of it.\n\nThen do the reading the script cannot. Hold each match against the brief, and\nfetch the posting where the title alone does not settle it - every match\ncarries a \`match\` of \`strong\` or \`ambiguous\`, and the ambiguous ones are\nexactly the ones a fetch is for. Work the strong ones first.\n\nThree fields in its output are yours to act on, not to ignore:\n- \`needAgent\` lists companies whose row carries a careers page rather than an\n  API. The script cannot read those; you can. Fetch each one.\n- \`failed\` lists boards that errored. Report them in your notes.\n- \`note\` appears when the list is missing entirely, and means this modality\n  returns nothing. Say so - never substitute companies of your own.\n` : ''}

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

**Check the title before you spend a fetch on it.** A result list gives you
titles for nothing; a posting costs you a fetch and a slice of your context.
Grade a batch of titles first and fetch only what survives:
  echo '["<title>","<title>"]' | node ${titleFilter} --exclude "${csv(excludeTerms)}"
It returns a verdict per title. \`strong\` and \`ambiguous\` are both worth a
fetch - the second means the title names no discipline either way, like a bare
"Engineering Manager", and only the posting settles it. A null verdict is out
of band or names something ruled out, and is not worth your fetch. This is a
cheap pre-filter, not the decision: the same gate runs over every lead after
the sweep, so a title you are unsure about should be returned rather than
dropped.

Return every candidate lead that clears it; do not filter on salary or on
stack fit beyond the keywords, because that filtering happens downstream. A
lead needs a URL you actually saw in a result or on a page - never one you
constructed or recalled.`

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
band in GBP numbers and leave the floor comparison to the caller.

Then resolve the apply route, following the "Resolving the apply route"
section of that same document. Where the lead sits on a board or an
aggregator - LinkedIn above all - find the same vacancy on the employer's own
careers page or on the ATS behind it, and report that as applyUrl, matching
on title and location before accepting one. A lead already on an employer's
page or ATS takes its own url. Report null where no match is found; that is
not a failure and does not drop the lead.

A lead carrying \`titleUnsettled: true\` cleared the band on its title but named
no software surface either way - "Engineering Manager" reads identically at a
software house and at a turbine manufacturer. The page settles it: report
softwareRole against what the responsibilities actually describe, not against
the title. Answer softwareRole for every lead, not only the flagged ones.

Return one verdict per lead, carrying the same url unchanged.

Leads:
${JSON.stringify(chunk, null, 2)}`

phase('Sweep')
const sweeps = await parallel(MODALITIES.map((m) => () =>
  agent(searchPrompt(m), { label: `sweep:${m.key}`, phase: 'Sweep', model: 'sonnet', schema: LEADS_SCHEMA })))
// Barrier justified: the dedupe needs every searcher's results together.
// Tag each lead with the searcher that found it. The dedupe folds duplicates
// across modalities and the cap below spends its budget across them, so which
// one produced a lead has to survive the flatten.
const raw = sweeps.flatMap((r, i) => (r?.leads ?? []).map((l) => ({ ...l, modality: MODALITIES[i].key })))
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

// The title gate, applied once to every lead whatever modality found it. The
// searchers run it too, but as a pre-filter to save themselves a fetch; seven
// agents applying a rule by judgement is seven readings of it, and this is the
// reading that counts.
//
// It runs through an agent rather than inline because this script executes in
// the workflow sandbox, which has no filesystem: it cannot import
// title_filter.mjs, and a second copy of those rules here is how two copies
// drift apart. So the agent's whole job is to run one command and hand back
// what it printed - no judgement, and the rules stay in one file.
const GRADES_SCHEMA = {
  type: 'object',
  required: ['grades'],
  properties: {
    grades: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'verdict', 'reason'],
        properties: {
          title: { type: 'string' },
          verdict: { type: ['string', 'null'], description: 'strong, ambiguous, or null' },
          reason: { type: ['string', 'null'], description: 'band, excluded, discipline, or null' },
        },
      },
    },
  },
}

const uniqueTitles = [...new Set(deduped.map((l) => l.title))]
const graded = uniqueTitles.length
  ? await agent(`Run exactly this command with Bash and return what it prints, unchanged:

  echo ${JSON.stringify(JSON.stringify(uniqueTitles))} | node ${titleFilter} --exclude "${csv(excludeTerms)}"

It prints a JSON array of {title, verdict, reason, matched}. Return every
element, with title, verdict and reason carried through exactly as printed.
Do not add titles, drop titles, or re-grade anything yourself - the script is
the decision and you are relaying it. If the command fails, return an empty
array rather than grading by hand.`,
      { label: 'gate:titles', phase: 'Sweep', model: 'sonnet', schema: GRADES_SCHEMA })
  : { grades: [] }

const gradeByTitle = new Map((graded?.grades ?? []).map((g) => [g.title, g]))
const titleDrops = { band: 0, excluded: 0 }
const gated = []
for (const l of deduped) {
  const g = gradeByTitle.get(l.title)
  // No verdict means the gate could not be run. Keep the lead: an unread gate
  // is not a fail, and verification is the backstop.
  if (g && (g.reason === 'band' || g.reason === 'excluded')) {
    titleDrops[g.reason]++
    continue
  }
  // A `discipline` verdict means the title named no software surface either
  // way, which is a question rather than an answer. It rides through with a
  // flag, because a fetch settles it and a regex does not.
  gated.push(g?.reason === 'discipline' ? { ...l, titleUnsettled: true } : l)
}
if (titleDrops.band + titleDrops.excluded) {
  log(`title gate dropped ${titleDrops.band} out of band, ${titleDrops.excluded} on the standing filter`)
}

const speculative = gated.filter((l) => l.speculative)
log(`${raw.length} raw leads -> ${deduped.length} deduped -> ${gated.length} in band (${speculative.length} speculative)`)

// Verification is capped, so the cap's ordering decides what a quiet run
// looks like. Two rules, in this order.
//
// Round-robin across the modalities first. A modality working a standing list
// of a couple of hundred employers returns leads by the hundred while a
// search-led one returns a dozen, and a flat sort would let the largest
// single modality take the whole budget - which would quietly turn a
// seven-angle sweep into a one-angle one, and the whole point of fanning out
// is that one search angle does not find everything.
//
// Within a modality, hidden-market leads go first: the hidden market is what
// this skill exists for, so where a modality's own share is what bites, it
// bites on the board leads.
const queues = new Map()
for (const l of gated) {
  if (l.speculative) continue
  const k = l.modality ?? 'unknown'
  if (!queues.has(k)) queues.set(k, [])
  queues.get(k).push(l)
}
for (const q of queues.values()) q.sort((a, b) => (a.market === 'board' ? 1 : 0) - (b.market === 'board' ? 1 : 0))
const ordered = []
for (let i = 0; ordered.length < gated.length; i++) {
  let any = false
  for (const q of queues.values()) {
    if (i < q.length) { ordered.push(q[i]); any = true }
  }
  if (!any) break
}

const CAP = 120
const unverifiedOverflow = ordered.slice(CAP)
if (unverifiedOverflow.length) {
  const byModality = {}
  for (const l of unverifiedOverflow) byModality[l.modality ?? 'unknown'] = (byModality[l.modality ?? 'unknown'] ?? 0) + 1
  log(`verification capped at ${CAP} leads - ${unverifiedOverflow.length} left unverified (${Object.entries(byModality).map(([k, n]) => `${k} ${n}`).join(', ')})`)
}
const toVerify = ordered.slice(0, CAP)

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
  if (v.softwareRole === false) return 'discipline'
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
  // `dropped` counts what verification threw out; `titleDropped` counts what
  // never reached it. The report reconciles across both, so a lead dropped on
  // its title is as visible as one dropped on its spec.
  stats: { raw: raw.length, perModality, deduped: deduped.length, titleDropped: titleDrops, dropped },
}
