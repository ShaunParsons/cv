export const meta = {
  name: 'find-jobs-verify',
  description: 'Verify-only pass over a supplied list of job leads',
  phases: [
    { title: 'Verify', detail: 'verifiers over the supplied leads', model: 'sonnet' },
  ],
}

// Same args contract as sweep.mjs, minus the searcher fields, plus `leads`:
// the lead objects to verify, in the shape sweep.mjs's searchers return.
// Time- and figure-dependent values arrive at runtime only; nothing committed
// carries them.

const input = typeof args === 'string' ? JSON.parse(args) : (args ?? {})
for (const k of ['sweepDoc', 'today', 'sinceDate', 'windowLabel', 'brief', 'leads']) {
  if (input[k] == null) throw new Error(`missing args.${k}`)
}
const { sweepDoc, today, sinceDate, windowLabel, brief, leads } = input

// The browser-fetch fallback lives beside this script; derive its path from
// sweepDoc so the prompts can name it absolutely.
const browserFetch = sweepDoc.replace(/\/SWEEP\.md$/, '/scripts/browser_fetch.mjs')

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
          postedDate: { type: ['string', 'null'], description: 'YYYY-MM-DD, or null if no date is shown' },
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

phase('Verify')
const CHUNK = 4
const chunks = []
for (let i = 0; i < leads.length; i += CHUNK) chunks.push(leads.slice(i, i + CHUNK))
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
const droppedLeads = []
const dropped = {}
for (const l of leads) {
  const v = verdictByUrl.get(l.url)
  const reason = dropReason(v)
  if (reason) {
    dropped[reason] = (dropped[reason] ?? 0) + 1
    const entry = { ...l, ...(v ?? {}), dropReason: reason }
    if (reason === 'unconfirmed') unconfirmed.push(entry)
    else droppedLeads.push(entry)
    continue
  }
  shortlist.push({ ...l, ...v })
}
log(`${shortlist.length} of ${leads.length} leads survive (${unconfirmed.length} unconfirmed)`)

return { shortlist, unconfirmed, droppedLeads, stats: { verified: leads.length, dropped } }
