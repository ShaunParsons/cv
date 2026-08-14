# The sweep

Six modalities, one agent each, all running the same brief: titles, location scope, stack keywords, standing filters. Each returns leads in the shape `SKILL.md` defines and nothing else - no prose, no recommendations. Judgement happens after the dedupe, not inside a searcher.

Every modality searches with the brief's posting window in mind: a posting is worth returning if it was listed or re-confirmed inside the window the brief states. When a search result carries no date, return it and let verification decide.

## Modality 1 - major boards

The open market. Search via `WebSearch` with site-scoped queries rather than fetching board search pages directly - logged-out board results are throttled and reordered, while the index is not.

- `site:linkedin.com/jobs "<title>" <location or remote> uk`
- `site:uk.indeed.com "<title>" <stack keyword>`
- `site:reed.co.uk` / `site:totaljobs.com` / `site:cwjobs.co.uk` with the same shapes
- `"<title>" jobs <city>` bare, for boards the list above misses

Run each title in the brief against each board. Prefer postings that name a salary band - boards require it inconsistently, and a stated band saves a verification round-trip.

## Modality 2 - startup boards and threads

Smaller boards with better signal-to-noise for product and startup roles.

- Welcome to the Jungle (formerly Otta) - search via `site:welcometothejungle.com "<title>" uk`
- Work at a Startup and Wellfound - both skew US; include only UK or remote-UK-eligible results. Y Combinator's own board - <https://www.ycombinator.com/jobs>, and the role paths under it such as `/jobs/role/software-engineer/remote` - is the logged-out view of Work at a Startup and reads without an account, company and salary included, so start there and follow through to the workatastartup.com posting for the detail
- `site:workinstartups.com "<title>"`
- The latest "Ask HN: Who is hiring?" thread - find it through `hn.algolia.com` by recency, then search within it for the stack keywords and REMOTE or UK markers. Threads run monthly; only the current one counts.

## Modality 3 - ATS-hosted careers pages

The core of the hidden market. Companies that hire without posting to boards still host their vacancies on an applicant tracking system, and those pages are indexed. Search each ATS domain directly:

- `site:boards.greenhouse.io "<title>" uk OR remote`
- `site:jobs.lever.co "<title>" uk OR remote`
- `site:jobs.ashbyhq.com "<title>" uk OR remote`
- `site:apply.workable.com "<title>" uk OR remote`
- `site:jobs.smartrecruiters.com "<title>" uk OR remote`

Vary the title synonyms here more than anywhere else - ATS pages carry the company's own title, not a board's normalised one, so "Engineering Lead", "Lead Engineer", "Head of Software" and the brief's titles all earn a pass.

## Modality 4 - hiring signals

Companies hiring before, or instead of, posting anywhere. Signals, then the follow-up that turns a signal into a lead:

- **Funding announcements.** Search UK tech press - Sifted, UKTN, TechCrunch - for seed through Series B rounds announced in the last three months in companies whose stack or sector fits the brief. A raise at that stage is a hiring plan, so the signal window stays at three months whatever the posting window - any vacancy it leads to still has to pass verification on its own date. Follow up on the company's own careers page.
- **Pre-funding and accelerator startups.** Companies ahead of their first round hire before there is any press to find. Search the current cohorts of the UK-relevant accelerators - Y Combinator's latest batch through workatastartup.com, Techstars London, Seedcamp, Entrepreneur First, Antler UK - plus `"founding engineer" uk OR remote` and `"first engineer" "<stack keyword>"`. A cohort listing is a signal, not a lead; the company's own careers page or a live posting is what converts it, the same as every other signal here. Titles run junior to the label - a founding engineer post at a two-person company can carry head-of-engineering scope - so match on scope, not title.
- **Direct careers pages.** `"we're hiring" "<stack keyword>" <city>` and `"join us" "<title>"` scoped to the brief's window, for companies posting only on their own site or on social channels.
- **Team-growth signals.** A company's engineering blog announcing a new team, product line or office in scope. Follow up the same way - the careers page decides whether the signal is a lead.

A signal with no live vacancy behind it is not a lead and is not returned. If the careers page shows nothing but the signal is strong and recent, the agent may return it with `"speculative": true`, an empty salary, and the signal in `"notes"` - the pipeline routes it around verification and the report lists it separately rather than folding it into the shortlist.

## Modality 5 - specialist recruiter boards

Agencies that recruit exactly this profile's ground - AWS and cloud, senior
backend, technical lead through head of engineering - carry roles on their
own boards before, or instead of, the major ones, and often with the client
unnamed. The list below is vetted: every site and jobs page was fetched and
its specialism confirmed on the page. Work through all of them, every run.

For each recruiter, fetch the jobs page and read the listings against the
brief's titles and stack keywords. Boards marked † show an empty shell or a
403 to a plain fetch - for those, go straight to the browser fetcher named
in your prompt, or search the index with `site:<domain> "<title>"` and fetch
only the hits. Agency boards also recycle filled roles as candidate bait, so
prefer ads carrying a posting date - verification drops the stale ones either
way.

| Recruiter | Focus | Jobs page |
|---|---|---|
| [Jefferson Frank](https://www.jeffersonfrank.com/) | Dedicated AWS recruitment (Tenth Revolution Group) | <https://www.jeffersonfrank.com/aws-jobs> |
| [Franklin Fitch](https://www.franklinfitch.com/uk/) | Infrastructure, cloud and DevOps, engineer to CTO | <https://www.franklinfitch.com/uk/job-search/> † |
| [iO Associates](https://www.ioassociates.co.uk/) | Cloud (AWS/Azure/GCP) and tech, Bristol | <https://www.ioassociates.co.uk/search-jobs/> |
| [Fruition Group](https://www.fruitiongroup.com/) | Cloud and DevOps practice, Leeds, UK-wide | <https://www.fruitiongroup.com/job-search/> † |
| [Trust in SODA](https://www.trustinsoda.com/) | DevOps, cloud and software engineering, London and Manchester | <https://www.trustinsoda.com/jobs> † |
| [Explore Group](https://www.explore-group.com/) | Cloud, DevOps and Node.js desks, London | <https://www.explore-group.com/jobs/28/> † |
| [Burns Sheehan](https://www.burnssheehan.co.uk/) | Engineering, platform and tech leadership for scale-ups | <https://www.burnssheehan.co.uk/tech-jobs/> † |
| [Understanding Recruitment](https://www.understandingrecruitment.com/) | Software engineering with a JavaScript/Node vertical, St Albans | <https://www.understandingrecruitment.com/job-search/> † |
| [Client Server](https://www.client-server.com/) | Backend, DevOps and senior/management tiers, London | <https://www.client-server.com/jobs> |
| [La Fosse](https://www.lafosse.com/) | Software engineering incl. TypeScript/Node, London and Birmingham | <https://www.lafosse.com/jobs/> † |
| [Formula Recruitment](https://www.formularecruitment.co.uk/) | Engineering and EM-band roles for scaling businesses | <https://www.formularecruitment.co.uk/open-roles/> |
| [Stott and May](https://www.stottandmay.com/) | Software engineering, EM through VP placements | <https://find.stottandmay.com/jobs> † |
| [Xpertise Recruitment](https://www.xpertise-recruitment.com/) | Software, cloud and tech leadership, Derby and the Midlands | <https://www.xpertise-recruitment.com/jobs> † |
| [Searchability](https://searchability.co.uk/) | Software engineering nationwide, Chester | <https://searchability.co.uk/tech-jobs/> |
| [Corecom Consulting](https://www.corecomconsulting.co.uk/) | Software engineering and leadership, Leeds | <https://www.corecomconsulting.co.uk/jobs/> |
| [Adria Solutions](https://www.adriasolutions.co.uk/) | Software, cloud and data, North West and Midlands | <https://jobs.adriasolutions.co.uk/> |
| [Rebel Recruiters](https://www.rebelrecruiters.co.uk/) | East Midlands tech incl. engineering managers, Nottingham | <https://www.rebelrecruiters.co.uk/find-a-job/> † |
| [Applause IT](https://applauseit.co.uk/) | TypeScript/JavaScript desk within Midlands IT, Birmingham | <https://applauseit.co.uk/jobs> |
| [Spectrum IT](https://www.spectrumit.co.uk/) | Software incl. remote-UK Node/TypeScript, Southampton | <https://www.spectrumit.co.uk/job-search/> † |
| [ADLIB](https://www.adlib-recruitment.co.uk/) | South West tech for startups and scale-ups, Bristol | <https://www.adlib-recruitment.co.uk/job-search> |

Recruiter ads often anonymise the client. Where no company is named, return
the recruiter plus a distinguishing phrase from the ad as `company` - "via
Jefferson Frank - fintech scale-up, Birmingham" - so the dedupe does not fold
two different anonymous clients into one lead; an ad that names its client
dedupes naturally against the same vacancy found direct. Set `source` to the
recruiter's name and `market` to `board`.

## Modality 6 - remote-first job boards

Boards carrying remote roles only. They overlap the major boards on the
largest employers and diverge sharply below that: a remote board's
UK-eligible list holds companies that never post to a UK board at all,
because they are not hiring in a UK city - they are hiring in a time zone.
Fully remote is in scope for this profile, so these are leads rather than
background. The list is vetted the way the recruiter list above is: every
site was fetched and its access model confirmed on the page.

The location check bites harder here than anywhere else. Most of these boards
are US-centred and "Remote" on them means remote-US unless the posting says
otherwise. A lead needs the posting to state UK, Europe, EMEA or worldwide
eligibility; a role pinned to US hours or requiring US work authorisation
fails the location check, and returning it only spends a verification slot to
learn that.

| Board | What it carries | Where to look |
|---|---|---|
| [Himalayas](https://himalayas.app/) | Large remote board, country-filtered, dated to the minute | <https://himalayas.app/jobs/countries/united-kingdom>, plus `/jobs/countries/united-kingdom/<skill>` |
| [4 Day Week](https://4dayweek.io/) | Reduced-hours and flexible roles, salary stated on the listing | <https://4dayweek.io/job-search?country=United+Kingdom&remote=true> † ‡ |
| [Arc](https://arc.dev/) | Remote board and talent marketplace, scoped by skill | `https://arc.dev/remote-jobs/<skill>` - e.g. `/remote-jobs/nodejs` ‡ |
| [DailyRemote](https://dailyremote.com/) | Aggregator, dated, filterable to the UK | <https://dailyremote.com/remote-jobs-in-united-kingdom> § |
| [JustRemote](https://justremote.co/) | Small curated board, UK eligibility stated per listing | <https://justremote.co/remote-jobs-in-united-kingdom> ‡ |
| [FlexJobs](https://www.flexjobs.com/) | Subscription board, US-weighted | index only ✦ - `site:flexjobs.com/publicjobs "<title>"` |
| [Remote.co](https://remote.co/) | Curated remote board carrying UK postings | index only ✦ - `site:remote.co/job-details "<title>" united kingdom` |

† Client-rendered - a plain fetch returns an empty shell, so go straight to
the browser fetcher named in your prompt. It also geolocates by IP and
pre-fills a near-location filter, which sorts its results by distance from
this machine and mixes in local hybrid and on-site roles; set the remote
filter explicitly and read past them.

‡ Part of the board sits behind a paid tier. 4 Day Week holds back the last
48 hours' postings and hides some employers' names outright; Arc shows a
subset before a signup wall; JustRemote keeps its "Power Search" listings
back. Read what is free and return that. A listing whose employer is withheld
is not a lead - there is nothing to dedupe on and nothing to verify against.

§ An aggregator rather than a source: its apply links route through its own
portal. Return the original posting's URL where the listing names it, and
otherwise treat the entry as a signal and convert it on the employer's own
careers page, exactly as Modality 4 does.

✦ Both of these refuse automation outright - a plain fetch and a headless
browser alike get an HTTP/2 error or a connection held open until it times
out - and FlexJobs additionally charges a subscription to read a posting. So
neither can produce a verifiable lead from its own page, and a lead that
cannot be verified is not one. Use the search index instead: the result
snippets name the employer and the title, which is a signal in the sense
Modality 4 means. Convert it on the employer's own careers page or ATS and
return *that* URL, with the board named in `notes`. Never return a
flexjobs.com or remote.co URL as a lead.

Set `source` to the board's name and `market` to `board` - except where a
converted signal turns out to live only on the employer's own careers page,
which is `hidden`.

## Verification checklist

For each deduped lead, fetch the URL and confirm every line. One failure drops the lead; the report counts drops by reason class.

1. **Live.** The page loads and shows this vacancy - not a 404, not a "position filled" notice, not a board's "similar jobs" fallback page. An empty client-rendered shell, a blocked fetch or a redirect proves nothing either way: before calling a lead dead, try the ATS's public API - Greenhouse, Lever, Ashby and Workable all expose one - then the browser fetcher, `scripts/browser_fetch.mjs` run with Node via Bash, which renders the page through headless Chromium and gets past the 403 walls, hung connections and client-rendered shells a plain fetch cannot read. Its rendered text counts as a directly loaded page. Two limits on it: a rendered bot-check or consent interstitial with no job content still settles nothing, and some dead signals need no browser at all - an HTTP 410, a Greenhouse redirect to the generic board page, a LinkedIn redirect to `expired_jd_redirect` are authoritative as they are. Report `confirmed` accordingly: true when the live-or-dead call rests on a directly loaded or browser-rendered page or an authoritative API response, false when it rests on inference. A lead that cannot be settled either way is unconfirmed, not dead.
2. **Recent.** Posted or re-listed inside the brief's posting window. Boards recycle stale postings under fresh dates; a posting also present in a months-old cache with identical text is a repost, and its age is the old date. Report the date found as `postedDate` - the window arithmetic itself happens in the pipeline, not here.
3. **Location.** Fits the scope in `profile.md` - the named cities on site, London on workable hybrid terms, or fully remote with UK eligibility. "Remote (US)" fails. On-site anywhere else fails.
4. **Stack.** The posting's centre of gravity passes the standing stack filter. The filter is about what the role centres on, not what it mentions - a polyglot stack that touches a filtered technology passes; a role built around one fails.
5. **Salary.** Where the posting states a band and the role is permanent, the band clears the standing floor. Where no band is stated, the lead survives with the band marked unknown - absence of a figure is not a failure.
6. **Seniority.** The role sits in the band the brief covers - not a step down to mid-level, not a CTO post dressed as head of engineering.
