// The title gate. One reading of a job title, shared by every stage that has
// to decide whether a posting is worth a fetch.
//
// A title is the cheapest thing a sweep ever sees and the only thing it sees
// for free: a board's search results, an ATS API's job list and a company's
// careers page all carry titles long before anything carries a description.
// Reading it first is what stops a searcher spending its context fetching
// "Lead Engineer - Cabin Interiors" to discover it is about an aircraft.
//
// Three gates, in the order that costs least:
//
//   1. Band.       Seniority, read off the title. Graduate and junior out at
//                  one end, VP and chief out at the other.
//   2. Excluded.   The caller's standing filters - technologies and
//                  disciplines it has already decided against. This file
//                  holds none of them; they arrive as `exclude`, because
//                  this repo is public and those are the user's own.
//   3. Discipline. Engineering in the software sense, or engineering in one
//                  of the several other senses that share the word.
//
// Gate 3 answers in three ways, not two, and the third is the important one.
// "Senior Platform Engineer" is software on its face. "Lead Process Engineer"
// is not. "Engineering Manager" is neither - it reads identically at a
// software house and at a turbine manufacturer, and no amount of staring at
// the title settles it. That returns `ambiguous`, which means *fetch it and
// look*, not *drop it*. A gate that answered only yes or no would have to
// choose between losing every unqualified lead title and letting through
// every non-software one; answering "unsettled" lets the caller spend a fetch
// where a fetch is what the question needs.
//
// So: drop on `band` and `excluded`, which are the user's own criteria read
// off the title; never drop on `discipline` alone.

// "Architect" is a band in its own right - nobody advertises a junior one, and
// the title carries no seniority word to read. Without it here, "Solutions
// Architect" and "Cloud Architect" are dropped as unbanded before a fetch.
const BAND = /\b(senior|snr|sr\.?|lead|leader|leading|principal|staff|head\s+of|director\s+of|manager|management|architect\w*)\b/i
const TOO_JUNIOR = /\b(graduate|junior|jnr|intern(ship)?|apprentice\w*|trainee|placement|mid[-\s]level|entry[-\s]level|associate)\b/i
const TOO_SENIOR = /\b(cto|chief|c\.t\.o|vp|vice\s+president|svp|evp|managing\s+director|founder|partner)\b/i

// Engineering in one of its other senses. These are the words that make a
// title mechanical, civil or commercial rather than software.
// Engineering in one of its other senses, plus the non-engineering roles that
// ride in on a single word - "Director of Product, ClickHouse Cloud" clears
// the band and names a software surface without being a software job.
const NON_SOFTWARE = /\b(workshop|mechanical|electrical|civil|structural|process|chemical|manufactur\w*|production|maintenance|plant|facilities|hvac|automotive|aerospace|marine|rail|highways|nuclear|petroleum|drilling|mining|construction|hse|health\s*&\s*safety|field\s+service|building\s+services|project\s+engineering|bid|proposal|pre[-\s]?sales|technical\s+services|(director|head|vp)\s+of\s+product|product\s+(manager|owner|designer|marketing|lead)|curriculum|instructor|trainer|technical\s+writer|designer|recruit\w*|account\s+(executive|manager)|sales|marketing|customer\s+success|partnerships?|finance|legal|people\s+(partner|operations)|procurement|category\s+manager|talent|(business|learning\s+and|leadership|commercial)\s+development)\b/i

// A software surface named outright - settles the discipline on its own.
// "Solutions Architect" and "Enterprise Architect" name no technology, but the
// compound is a software one wherever the non-software gate above has not
// already fired on a construction or building-services word.
const SOFTWARE = /\b(software|backend|back[\s-]?end|full[\s-]?stack|platform|cloud|devops|sre|site\s+reliability|infrastructure|api|microservice\w*|distributed\s+systems|node(\.?js)?|typescript|javascript|serverless|kubernetes|application\s+development|web\s+services|developer|development|(solutions?|enterprise|technical|technology|data|integration|systems?)\s+architect)\b/i

// A band title with no discipline in it. Kept, flagged, and settled by a
// fetch rather than by a guess.
//
// The core is the leadership vocabulary engineering shares with every other
// discipline - "Engineering Manager", "Tech Lead", "Engineering Team Lead" -
// and it may carry a qualifier in front of it. That qualifier is what an
// anchor allowing only a fixed list of seniority words gets wrong: "AI
// Technical Lead" is "Technical Lead" with a word in front and "Engineering
// Team Lead" is "Engineering Lead" with one in the middle, and both were being
// dropped as "no software surface named" - the one verdict a bare band title
// must never get. The qualifier is left open rather than enumerated, because
// by the time a title reaches this line the two gates that matter have already
// run: BAND has required a seniority word, so nothing unqualified gets here at
// all, and NON_SOFTWARE has removed the other senses of the word, so a
// "Mechanical Engineering Lead" or a "Sales Engineering Manager" is long gone.
// What is left over is a title that costs a fetch to settle, which is what
// `ambiguous` means.
// The cores split in two, because they can carry different prefixes. A core
// naming engineering outright - "Technical Lead", "Engineering Team Lead" -
// stays a band title whatever qualifies it, so the qualifier is open. A core
// that is only a shape - a bare "Team Lead", "Engineer", "Engineering" - takes
// its discipline from whatever sits in front of it, so only a seniority word
// may: "Pharmacy Team Lead" and "Game Operations Team Lead" are somebody
// else's job, and letting an open qualifier reach a bare core spends a fetch
// settling a title that reads perfectly clearly.
const AMBIGUOUS_NAMED = [
  '(?:engineering|engineer|technical|technology|tech)\\s+(?:team\\s+)?(?:lead|leader|manager|management)',
  'lead\\s+engineer',
  'member\\s+of\\s+technical\\s+staff',
].join('|')
const AMBIGUOUS_BARE = ['team\\s+lead(?:er)?', 'engineering', 'engineer'].join('|')
const SENIORITY_PREFIX = '(?:senior|snr|sr\\.?|staff|principal|lead|head\\s+of|director\\s+of|group|global)\\s+'
const AMBIGUOUS = new RegExp(
  `^(?:(?:[\\w&/+.'-]+\\s+){0,3}(?:${AMBIGUOUS_NAMED})|(?:${SENIORITY_PREFIX})*(?:${AMBIGUOUS_BARE}))\\s*$`, 'i')

// Most band titles carry the team or product after a dash, comma, paren or
// pipe - "Engineering Manager - Music", "Principal Engineer, Cluster
// Orchestration", "Staff Engineer (Client Ops)". The suffix names the domain,
// never the discipline, so it is stripped before AMBIGUOUS is tried a second
// time. Without this the anchor drops the title as "no software surface
// named", which is the one verdict a bare band title must never get.
const TEAM_SUFFIX = /\s*[-,(|].*$/

/**
 * Build a matcher for the caller's standing exclusions.
 *
 * Terms are matched whole, so "go" will not fire on "Django" or "Mongo" - but
 * neither will it fire usefully on a title that says only "Go". Supply an
 * ambiguous term in the form it takes in a title ("go developer", "go
 * engineer", "<name>lang") rather than bare.
 */
export function excludeMatcher(terms = []) {
  const parts = terms.filter(Boolean).map((raw) => {
    const t = String(raw).trim()
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    // \b is defined against word characters, so it does nothing next to "#"
    // or ".". Guard with a lookaround only on the sides that need one.
    const pre = /^[a-z0-9]/i.test(t) ? '(?<![a-z0-9])' : ''
    const post = /[a-z0-9]$/i.test(t) ? '(?![a-z0-9])' : ''
    return `${pre}${escaped}${post}`
  })
  return parts.length ? new RegExp(parts.join('|'), 'i') : null
}

/**
 * Grade one title.
 *
 * @param {string} title
 * @param {{exclude?: string[]|RegExp}} opts
 * @returns {{verdict: 'strong'|'ambiguous'|null, reason: string|null, matched: string|null}}
 */
export function gradeTitle(title, { exclude = [] } = {}) {
  // En and em dashes separate a title from its qualifier; the ASCII hyphen
  // binds a compound - "Full-Stack", "Back-End" - and must survive.
  const t = String(title ?? '').replace(/[–—]/g, ' - ').trim()
  if (!t) return { verdict: null, reason: 'band', matched: null }

  if (TOO_JUNIOR.test(t)) return { verdict: null, reason: 'band', matched: 'below the band' }
  if (TOO_SENIOR.test(t)) return { verdict: null, reason: 'band', matched: 'above the band' }
  if (!BAND.test(t)) return { verdict: null, reason: 'band', matched: 'no seniority in the title' }

  // `exclude` arrives three ways: a term list, a matcher already built by a
  // caller grading in bulk, or null from that same builder when the list was
  // empty. A default parameter only covers the first of those being absent,
  // and an empty exclusion list is the documented no-filter case.
  const rx = exclude == null ? null
    : exclude instanceof RegExp ? exclude
      : excludeMatcher(exclude)
  const hit = rx?.exec(t)
  if (hit) return { verdict: null, reason: 'excluded', matched: hit[0] }

  if (NON_SOFTWARE.test(t)) return { verdict: null, reason: 'discipline', matched: t.match(NON_SOFTWARE)[0] }
  if (SOFTWARE.test(t)) return { verdict: 'strong', reason: null, matched: t.match(SOFTWARE)[0] }
  if (AMBIGUOUS.test(t)) return { verdict: 'ambiguous', reason: null, matched: null }
  if (AMBIGUOUS.test(t.replace(TEAM_SUFFIX, '').trim())) return { verdict: 'ambiguous', reason: null, matched: null }
  return { verdict: null, reason: 'discipline', matched: 'no software surface named' }
}

/** True where the title is worth a fetch - strong or unsettled, not a drop. */
export function worthFetching(title, opts) {
  return gradeTitle(title, opts).verdict !== null
}

// CLI: grade titles from argv or from a JSON array on stdin. The exclusion
// terms are the caller's own and are not written down here - see the note on
// gate 2 above.
//   node title_filter.mjs --exclude "<term>,<term>" "Senior Backend Engineer"
//   echo '["Lead Engineer","Staff Backend Engineer"]' | node title_filter.mjs --exclude "<term>,<term>"
if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2)
  let exclude = []
  const titles = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--exclude') exclude = (argv[++i] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    else titles.push(argv[i])
  }
  if (!titles.length && !process.stdin.isTTY) {
    const raw = await new Promise((res) => {
      let b = ''
      process.stdin.on('data', (c) => { b += c })
      process.stdin.on('end', () => res(b))
    })
    if (raw.trim()) titles.push(...JSON.parse(raw))
  }
  const rx = excludeMatcher(exclude)
  console.log(JSON.stringify(
    titles.map((t) => ({ title: t, ...gradeTitle(t, { exclude: rx }) })), null, 2))
}
