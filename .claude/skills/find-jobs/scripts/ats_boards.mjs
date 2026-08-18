// Modality 3's fetcher. Takes whatever ATS links a search turned up, works out
// which board each one belongs to, and asks that board's own API what is open
// today.
//
// The modality searches applicant tracking systems because that is where the
// hidden market lives: a company that never posts to a job board still hosts
// its vacancies on Greenhouse or Ashby, and those pages are indexed. What the
// index is not is current. A `site:boards.greenhouse.io` query returns the
// crawler's last snapshot, which is months old for a page that no longer
// exists at all - and a filled requisition is taken down without a redirect,
// so the lead survives in the index long after it stops being a lead. Run as
// index queries alone, this modality returned dead links two times in five.
//
// The fix is to split what the index is good at from what it is bad at. The
// board token in `boards.greenhouse.io/monzo/jobs/4512345` is durable: the
// requisition is gone, the company's board is not. So the index is used for
// discovery - which employers have a board at all - and the board's public
// API is used for the truth, which is live-only by construction and carries
// the company's own dates. A stale hit is no longer a dead lead; it is a
// company worth asking.
//
//   node ats_boards.mjs [--urls "url,url"] [--urls-file <path>] \
//                       [--exclude "term,term"] [--since YYYY-MM-DD] \
//                       [--locations "united kingdom,remote"] \
//                       [--not-locations "united states,india"]
//
// Input is ATS links, one per line or comma-separated, on `--urls`, in the
// file named by `--urls-file`, or on stdin - a JSON array of strings or a
// plain list, whichever is to hand. A bare `ats:token` pair ("greenhouse:monzo")
// is read too, for when a searcher knows the board without a link to it.
//
// Every shape of link to the same board collapses to one fetch, so twenty
// stale hits at one company cost one request. Prints the same JSON shape
// `companies.mjs` prints, gated through the same title, location and recency
// filters, so the two modalities hand their agents the same thing.

import { readFile } from 'node:fs/promises'
import { adapterFor, fetchBoard, pool, sift } from './companies.mjs'

// --- links in, endpoints out -----------------------------------------------

// Each ATS gets its posting list from one endpoint. Where a board has more
// than one home - Lever keeps a separate EU host - both are listed and tried
// in order, because which one a company sits on is not reliably visible in a
// link to it: a miss on the first costs one extra request, while a wrong guess
// with no fallback costs the whole company.
const BOARDS = {
  // Greenhouse serves its EU-hosted boards from the same API host as the rest:
  // a `boards.eu.greenhouse.io` page reads back from `boards-api.greenhouse.io`
  // under the same token, and there is no `boards-api.eu` to fall back to.
  greenhouse: (t) => [`https://boards-api.greenhouse.io/v1/boards/${t}/jobs`],
  ashby: (t) => [`https://api.ashbyhq.com/posting-api/job-board/${t}`],
  lever: (t) => [
    `https://api.lever.co/v0/postings/${t}?mode=json`,
    `https://api.eu.lever.co/v0/postings/${t}?mode=json`,
  ],
  workable: (t) => [`https://apply.workable.com/api/v1/widget/accounts/${t}?details=true`],
  smartrecruiters: (t) => [`https://api.smartrecruiters.com/v1/companies/${t}/postings?limit=100`],
  recruitee: (t) => [`https://${t}.recruitee.com/api/offers/`],
}

// A path segment that names a page rather than a company. `apply.workable.com`
// hosts a company at `/<account>/j/<code>` and a bare posting at `/j/<code>`,
// Greenhouse's `embed/job_app?token=...` names a single application form, and
// Ashby serves images from `app.ashbyhq.com/api/images/...` - three shapes on a
// known ATS host that carry no board token at all. Each is a link to leave
// unresolved rather than one to guess a token out of, so a token is only ever
// read from the first path segment, and only when that segment names a company.
const NOT_A_TOKEN = /^(j|jobs|job|o|careers|career|embed|job_app|job_board|search|images|user-content|assets|static|api|v\d+)$/i

// Two of these systems put customer boards on a subdomain of their own site,
// which is also where the vendor keeps its blog, its help centre and its own
// hiring. The host tells them apart: `acme.workable.com` is a board and
// `blog.workable.com` is a magazine, so the vendor's own subdomains are named
// and skipped rather than fetched as if a company were called "blog".
const VENDOR_SUBDOMAIN = /^(www|blog|help|support|resources|status|developers|marketplace|app|you)\./i

const after = (segs, name) => {
  const i = segs.findIndex((s) => s.toLowerCase() === name)
  return i === -1 ? null : (segs[i + 1] ?? null)
}

/**
 * Read one ATS link - or one `ats:token` pair - down to the board it belongs
 * to. Returns `{ ats, token }`, or null for anything not on a known system.
 */
export function resolveBoard(raw) {
  // Links arrive pasted out of prose as often as out of a result list, so the
  // punctuation that ends a sentence rather than a URL comes off first.
  const s = String(raw ?? '').trim().replace(/^[`<(\[]+|[`>,.!;:)\]]+$/g, '')
  if (!s) return null

  const pair = /^([a-z]+)\s*:\s*([A-Za-z0-9._-]+)$/.exec(s)
  if (pair && BOARDS[pair[1].toLowerCase()]) {
    return { ats: pair[1].toLowerCase(), token: pair[2] }
  }

  let u
  try { u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`) } catch { return null }
  const host = u.hostname.toLowerCase()
  const segs = u.pathname.split('/').filter(Boolean)
  const head = segs[0] && !NOT_A_TOKEN.test(segs[0]) ? segs[0] : null

  if (/^(boards|job-boards|boards-api)(\.eu)?\.greenhouse\.io$/.test(host)) {
    // The embedded board carries its token in a query string rather than a
    // path: `boards.greenhouse.io/embed/job_board?for=monzo`.
    const token = after(segs, 'boards') ?? u.searchParams.get('for') ?? head
    return token ? { ats: 'greenhouse', token } : null
  }
  if (/^(jobs|api)\.ashbyhq\.com$/.test(host)) {
    const token = after(segs, 'job-board') ?? head
    return token ? { ats: 'ashby', token } : null
  }
  if (/^(jobs|api)(\.eu)?\.lever\.co$/.test(host)) {
    const token = after(segs, 'postings') ?? head
    return token ? { ats: 'lever', token } : null
  }
  if (/\.workable\.com$/.test(host) && !VENDOR_SUBDOMAIN.test(host)) {
    // Workable hosts a company on its own subdomain as well as under
    // `apply.workable.com/<token>`, and the account name is the same either way.
    const sub = host.replace(/\.workable\.com$/, '')
    const token = after(segs, 'accounts') ?? (sub === 'apply' || sub === 'www' ? head : sub)
    return token ? { ats: 'workable', token } : null
  }
  if (/^(jobs|careers|api)\.smartrecruiters\.com$/.test(host)) {
    const token = after(segs, 'companies') ?? head
    return token ? { ats: 'smartrecruiters', token } : null
  }
  if (/\.recruitee\.com$/.test(host) && !VENDOR_SUBDOMAIN.test(host)) {
    const sub = host.replace(/\.recruitee\.com$/, '')
    const token = sub === 'www' ? head : sub
    return token ? { ats: 'recruitee', token } : null
  }
  return null
}

/**
 * Ask one board for its live postings, trying each of its endpoints in turn.
 * The token stands in for the company name: a posting API returns the roles
 * and not the employer's own spelling of itself, and the agent reading the
 * matches names it properly from the posting.
 */
export async function fetchAtsBoard({ ats, token, why = '' }) {
  const urls = BOARDS[ats](token)
  let last = null
  for (const url of urls) {
    if (!adapterFor(url)) continue
    const board = await fetchBoard({ company: token, url, why })
    if (board.postings) return { ...board, ats, token }
    last = { ...board, ats, token }
  }
  return last ?? { company: token, ats, token, url: urls[0], postings: null, error: 'no endpoint' }
}

// --- CLI -------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2)
  const arg = (name, fallback = null) => {
    const i = argv.indexOf(`--${name}`)
    return i === -1 ? fallback : argv[i + 1]
  }

  const readStdin = async () => {
    if (process.stdin.isTTY) return ''
    let s = ''
    for await (const chunk of process.stdin) s += chunk
    return s
  }

  // Links arrive from a search agent, so they arrive in whatever shape the
  // agent had them: a JSON array, a comma-separated argument, or a pasted
  // column. All three are the same list, and none is worth an error.
  const split = (text) => {
    const t = String(text ?? '').trim()
    if (!t) return []
    if (t.startsWith('[')) {
      try { return JSON.parse(t).map(String) } catch { /* fall through */ }
    }
    return t.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean)
  }

  const fileArg = arg('urls-file')
  const raw = [
    ...split(arg('urls')),
    ...(fileArg ? split(await readFile(fileArg, 'utf8')) : []),
    ...split(await readStdin()),
  ]

  const unresolved = []
  const boards = new Map()
  for (const link of raw) {
    const b = resolveBoard(link)
    if (!b) { unresolved.push(link); continue }
    const key = `${b.ats}:${b.token}`
    if (!boards.has(key)) boards.set(key, { ...b, why: `found on ${b.ats}`, links: [] })
    boards.get(key).links.push(link)
  }

  if (!boards.size && !unresolved.length) {
    console.error('usage: node ats_boards.mjs --urls "url,url" | --urls-file <path> | <links on stdin>')
    process.exit(2)
  }

  const fetched = await pool([...boards.values()], fetchAtsBoard)
  const ok = fetched.filter((b) => b.postings)
  const failed = fetched.filter((b) => !b.postings)
    .map((b) => ({ ats: b.ats, token: b.token, url: b.url, error: b.error }))

  const csv = (name) => (arg(name) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const { matches, seen, dropped } = sift(ok, {
    exclude: csv('exclude'),
    since: arg('since'),
    locations: csv('locations'),
    notLocations: csv('not-locations'),
  })

  console.log(JSON.stringify({
    links: raw.length,
    boards: boards.size,
    asked: fetched.length,
    reachable: ok.length,
    postingsSeen: seen,
    // `company` is the board's token, not the employer's own name for itself:
    // a posting API returns roles rather than letterhead. Name the employer
    // from the posting when writing the lead up.
    matches,
    failed,
    // Links on an ATS this script has no endpoint for, or on none at all.
    // They are the agent's to open by hand - listed, not dropped.
    unresolved,
    dropped,
  }, null, 2))
}
