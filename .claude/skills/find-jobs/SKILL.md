---
name: find-jobs
description: Fan out across job boards and the hidden market - ATS-hosted careers pages, specialist recruiter boards, funding announcements, who-is-hiring threads, a standing list of target companies asked directly - for live roles matching the profile in this repo, filtered against the user's standing criteria and ranked by likelihood of a first interview, then assessed in depth and triaged into shortlisted, needs-a-decision and not-applying. Use when the user asks to find jobs, search for openings, see who is hiring, or wants leads for a particular kind of role. Takes an optional target role and an optional posting window; called bare it covers the whole credible band over the last month. Reports in conversation and records every lead under applications/, which is gitignored.
argument-hint: "[target role, e.g. engineering manager] [window, e.g. last 2 weeks]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, ToolSearch, Agent, Workflow, AskUserQuestion
---

# find-jobs

Sweep the open job market and the hidden one for roles worth assessing, hold each lead against the sources in this repo, report a ranked shortlist, then assess every survivor with `/assess-fit` and triage each one on what the assessment says. The sweep's own ranking is a cheap forecast that decides what gets assessed and in what order; the assessment is what decides whether a lead is worth an application.

**The sweep's output is the conversation; its record is `applications/`.** A lead list names companies the user has not applied to and carries salary figures, so none of it goes anywhere committed - `applications/` is gitignored, and `CLAUDE.md` documents the shape. Every lead gets a record there, including the ones the filters dropped. Intermediate working files belong in the session scratchpad, never in the repo.

## Procedure

### 1. Build the search brief

- **Titles.** The argument names the target role; search that title and its common synonyms. Called bare, cover the whole band the registers span: senior software engineer, technical lead, engineering manager, head of engineering.
- **Window.** The argument may name a posting window - "last 2 weeks", "past 10 days". Default: one month. Compute today's date and the window's start with `date` in Bash; the workflow script deliberately cannot, so both always arrive as arguments.
- **Location scope.** Read `## Position` in `profile.md` and take the scope from there rather than from memory of it - it names the on-site cities, the hybrid terms for London, and the remote position.
- **Stack.** Take search keywords from `competencies.md` and the technical surfaces in `roles/*.md`. Search the stack that is evidenced, not the stack that is fashionable.
- **Already seen.** Read the `company`, `role` and `status` lines out of `applications/*/application.md` before searching. A role already recorded is not a new lead: an applied one must not come back as a find, and a filtered one must not be re-argued from scratch. Where the same role resurfaces with something changed - a new band, a reopened posting - update its record rather than adding a second.
- **Standing filters.** The stack filter comes from the user's memory. The salary floor for permanent roles comes from `CV_SALARY_FLOOR` in `.env` (gitignored, same mechanism as the contact details) - read it with Bash, and with it unset apply no salary filter. Both pass to the sweep as runtime arguments; neither figure is ever written into this repo or its output.
- **Standing lists.** Two more inputs sit outside the committed repo, beside `SWEEP.md` and gitignored: `RECRUITERS.md`, the vetted agency boards Modality 5 works, and `COMPANIES.md`, the employers Modality 7 asks directly. The scripts derive both paths from `sweepDoc` and name them in the searchers' prompts, so nothing needs passing as an argument. Each has an `.example.md` beside it carrying placeholders, committed so a fresh clone has the shape. A missing list is not an error: Modality 5 falls back to a generic index search, Modality 7 returns nothing and says so.

### 2. Fan out

The sweep is never run inline - it fans out to subagents, always, and the orchestration is deterministic: `scripts/sweep.mjs` in this skill's directory is the pipeline, run with the Workflow tool (this instruction is the opt-in):

```
Workflow({
  scriptPath: "<this skill's directory>/scripts/sweep.mjs",
  args: {
    sweepDoc: "<absolute path to this skill's SWEEP.md>",
    today: "YYYY-MM-DD", sinceDate: "YYYY-MM-DD",
    windowLabel: "the last 2 weeks",
    brief: { titles: [], locationScope: "", stackKeywords: [], band: "",
             locationTerms: [] },
    stackFilter: "<wording from memory, or null>",
    salaryFloorGbp: <number from .env, or null>,
    excludeTitleTerms: ["<the stack filter as matchable terms>"],
    notLocations: ["<places outside the scope>"],
    alreadySeen: ["<Company>|<Role>", "..."],
    applicationsDir: "<absolute path to applications/, or omit>",
  },
})
```

`alreadySeen` is what step 1's read of `applications/` is for, and it does nothing until it is passed here - one `Company|Role` string per existing record, every status included. The script puts the list in front of every searcher so a known role is not searched for again, and then drops any that come back anyway on the same normalised key the dedupe uses. Omit it and the sweep re-finds, re-verifies and re-reports roles already recorded, which is spend with no decision behind it; the reconciled count in the log (`N leads already recorded in applications/ - dropped before verification`) reading zero on a repeat sweep is the symptom.

`applicationsDir` is the only optional one, and omitting it is the normal case: the script derives `applications/` from `sweepDoc` and writes every posting it reads under it as it reads it, one `spec.txt` per lead, so step 5 builds each record from a spec already on disk rather than from a verdict. Pass it only to write somewhere else - a dry run into the scratchpad, say.

Three of those arguments exist because parts of the pipeline are arithmetic and arithmetic cannot read prose. `stackFilter` is wording an agent judges a posting against; `excludeTitleTerms` is that same filter restated as terms a regex can match in a title, since a sentence about what an estate centres on is not something a gate can apply. `brief.locationTerms` and `notLocations` do the same for the location scope, and the second is not the inverse of the first: "remote" is a working pattern rather than a place and every board writes it beside one, so "United States (Remote)" clears a bare `"remote"` allow-list and has to be ruled out by name.

The script fans out one Sonnet 5 searcher per modality in [SWEEP.md](SWEEP.md) - major boards, startup boards and threads, ATS-hosted careers pages, hiring signals, specialist recruiter boards, remote-first boards, target companies - each blind to the others, which is the point: one search angle does not find everything. Two of them run on a script rather than on search results alone. The ATS modality searches only to find out which companies keep a board at all - a search index answers with its last crawl, and a filled requisition is taken down without a redirect, so its links used to arrive dead two times in five - and then asks each board's own API what is open today through `scripts/ats_boards.mjs`, which is live by construction. The last of them inverts the rest: it starts from a standing list of employers and asks each what it is hiring for, which reaches requisitions worded too far from the brief's titles for any query to rank. That last one is also the only modality whose work scales with a file rather than with a query, so it is not one searcher but **one per twenty companies on the list** - the pipeline asks `scripts/companies.mjs --count` how long the list is, cuts it into slices of twenty, and gives each slice its own searcher with an `--offset` and a `--limit`. Fetching the boards was never the slow part; reading what comes back is, and slicing turns that reading from one agent's serial pass into several running at once, each holding a share of the postings rather than all of them. Every slice reports under the one modality key, so the verification cap below still spends one modality's share on it rather than eleven. It then dedupes on normalised company-plus-title in plain code, grades every lead's title through one shared gate, fans out Sonnet 5 verifiers over the survivors, applies the recency and salary arithmetic itself, and returns the shortlist with reconciled counts.

`scripts/title_filter.mjs` is that gate, and it runs at both ends: each searcher is told to grade a batch of titles before spending a fetch on them, and the pipeline grades every returned lead again centrally, so the rule is one rule rather than seven readings of it. It answers in three values, and the third is the point - `strong`, `null`, and `ambiguous` for a title like a bare "Engineering Manager" that names no discipline either way. Only `strong` and `null` settle anything; an ambiguous title rides through to verification flagged, because a fetch answers it and a regex does not. It holds no exclusion terms of its own: those arrive as `excludeTitleTerms`, because this repo is public and they are the user's. Judgement lives inside the agent slots - the queries, the reading of postings, the stack centre-of-gravity call; everything between them is script. Where the Workflow tool is unavailable, mirror the same stages with parallel `Agent` calls on Sonnet 5; a single sequential search is not an acceptable fallback.

Verification is capped, and the cap is spent round-robin across the modalities rather than down one flat list. A modality working a standing list of a couple of hundred employers returns leads by the hundred while a search-led one returns a dozen, so a flat ordering would let the largest single modality take the whole budget and quietly turn a seven-angle sweep into a one-angle one. Within each modality's own share, hidden-market leads go first. Whatever the cap leaves over comes back as `unverifiedOverflow`, counted by modality in the log rather than dropped.

`scripts/verify.mjs` is the verification stage on its own: it takes a `leads` array in place of running the searchers, with the rest of the args contract unchanged. Use it to verify leads the cap left over, to re-check leads that came back unconfirmed, or to re-verify a stale shortlist days later without re-running the sweep.

`scripts/browser_fetch.mjs` is the fetch fallback both stages lean on: it renders one URL through headless Chromium (Playwright) and prints the page's visible text as JSON, which gets an agent past the bot walls and client-rendered shells a plain fetch cannot read - the 403s, the connections held open until timeout, the Ashby-style empty shells. The workflow scripts derive its path from `sweepDoc` and name it in every agent prompt; it is equally usable inline when a single spec URL is blocked. One URL per invocation keeps its request rate at a reader's pace, not a crawler's. It needs a one-time setup - `npm install` in `scripts/`, then `npx playwright install chromium` there - and degrades cleanly without it: the script prints the setup instruction, and the pipeline falls back to the ATS APIs with unsettleable leads reported as unconfirmed, exactly as before.

`scripts/save_spec.mjs` is what keeps the listing after the verdict. Every verifier runs it against every lead it fetched, and it re-fetches the posting itself - through the ATS public API where one covers it, a plain fetch next, the browser fetcher last - and writes the text to `applications/<slug>/spec.txt`. It re-fetches rather than taking the agent's copy on purpose: an agent that has the page in its context could write the file itself, but what lands is then a re-transcription, and verbatim is the whole property this file exists to hold. It also keeps the postings out of the pipeline's return value and out of this conversation - a sweep verifying a hundred leads would otherwise carry a hundred specs back through it. The verdict carries `slug`, `specPath` and `specSource` instead, which is what step 5 writes the record from. It refuses to overwrite, so a lead re-surfacing keeps the copy taken when it was first found.

**The slug it prints is resolved against the records already on disk, not derived afresh.** `company` and `role` are free text an agent writes anew each sweep - "Formula Recruitment" one week and the same agency with its client, its domain and its working pattern spelled out the next - so a slug derived from them names the wording rather than the vacancy, and the same posting lands in a second directory every time the wording moves. The script keys on the posting instead: the ATS org and requisition id where the URL carries them, a normalised URL otherwise, matched against `spec.meta.json` and against the URLs in each existing record's front matter. A recognised lead comes back under the name its record already has, with `reusedFrom` naming what this run would otherwise have called it. The reverse case is guarded too - where the derived name is already held by a *different* posting, which is what an agency's anonymised clients produce, the slug takes a short suffix rather than landing on top of a spec that is not its own. Records rebuilt with an empty `links:` carry no identity for anything to match, so those surface as `possibleDuplicates` for a reader to settle rather than being merged on a guess.

### 3. Rank by first-interview likelihood

The sweep returns `shortlist`, `unconfirmed`, `droppedLeads`, `speculative`, `unverifiedOverflow` and `stats`. Leads in `unconfirmed` could not be settled either way - a blocked fetch or a client-rendered shell with no authoritative alternative - and belong in the report as unconfirmed, not in the shortlist and not silently gone. Ranking the shortlist is the main loop's judgement, and it is a forecast, not a preference order: read `../assess-fit/METHOD.md` and start each lead from the base rate for its route, then adjust for what the posting and the role files show - requirements coverage, the seniority match, how contested the posting looks. Every position in the ranking traces to "base rate X, adjusted for Y and Z", the same discipline `/assess-fit` enforces. This is the cheap pass and it is not the funnel: it settles the order leads are assessed in at step 6, and the assessment there can and does move a lead against it.

**The spec's own shape is one of the adjustments.** The user's memory holds a rubric drawn from the two job descriptions he named as the benchmark, and it scores a spec from its text alone - the seniority band and title, whether the role says outright that it is hands-on, single-team scope against manager-of-managers language, backend or platform framing, whether the *essential* requirements clear the standing stack filter, a published band against the floor in `.env`, and the stated location terms. Those are gates. What spreads the survivors is softer: AI named in the development flow, a spec that names a concrete problem the team has rather than listing fifteen unranked "must haves", and third-party integration or event-driven data on the page. Read the rubric from memory rather than from here - the figures and the filtered technologies stay out of this repo, and the wording there is the current one.

Screen the essential list, never the bonus list. A spec whose essentials are capability-shaped and whose filtered technology appears only under "nice to have" passes; one that gates on that technology fails however good the rest reads.

**The 5% floor applies here too, and it is the only decision this step takes.** Where a lead's ranked first-stage estimate has a midpoint below 5%, drop it now rather than assessing it: `status: filtered`, with `filtered: ranking - first-stage midpoint N%, below the 5% floor`. That reads differently from the `assessment - ...` wording step 6 writes, and it should - one is a full funnel and the other is a forecast from the posting, and the record needs to say which one closed the lead. Both leave the role recorded and stop the next sweep re-surfacing it.

The gate only ever drops. A lead the ranking puts above 5% is not shortlisted by that alone - it goes to step 6 and is shortlisted only on what the assessment says, because the ranking is the cheap pass and the assessment is the one with the evidence behind it. The asymmetry is deliberate: an assessment written for a lead already forecast below 5% is spend with no decision behind it, whereas an assessment skipped for a lead that would have scored well is an application never made.

Say in the report how many the gate dropped and name them, on the same footing as the leads a standing filter dropped. A lead that never reached an assessment is exactly the one a wrong forecast is invisible in.

### 4. Report

Lead with the ranked shortlist, best first, split into two tables - **boards** and **hidden market** - because the second list is the one this skill exists for. Each row: company, title, location and working pattern, advertised band where stated, source, the first-interview estimate as a range, and a one-line fit note grounded in a role file.

Where a lead was found on a board, the row names where to apply rather than where it was found - the `applyUrl` the verifier resolved. A lead whose `applyUrl` came back null is flagged as board-only, because that is the one case where applying through the board is the right move and the user should know it was the last resort rather than the default. Speculative signals follow separately.

Then show the work in brief, straight from `stats`: raw leads per modality, how many the dedupe folded, how many the title gate dropped (`titleDropped`, split into out of band and ruled out by the standing filter), and how many verification dropped by reason class (dead, stale, discipline, location, stack, seniority, salary). Counts, not a match percentage - the same rule as `/assess-fit`, for the same reason. The two drop tallies are separate because they answer different questions: one says how much of what the searchers found was never in scope, which is a fact about the queries, and the other says how much survived to a fetch and failed there, which is a fact about the market.

The salary floor applies to permanent roles; contract leads are reported with the day rate where stated and are not filtered on it.

### 5. Record every lead

Write one directory per lead under `applications/`, named `<company>-<role>` in lower case with hyphens - `montu-uk-tech-lead`. **Use the `slug` the verdict carries** rather than deriving one: it is what `save_spec.mjs` already wrote the posting under, and a second derivation is a second chance to land the record beside its spec rather than on it - and, worse, a second chance to give one vacancy two directories under two wordings of the same company. A verdict whose `slug` differs from what the company and title would suggest has been matched to a record that already exists, so read that record before writing: this is a lead resurfacing, and the rule in step 1 applies - update it, do not add a second, and leave it alone entirely if it has been applied for. Where a verdict came back without a slug, run `save_spec.mjs` again for the name rather than deriving one by hand.

Each directory holds an `application.md` built from `applications/TEMPLATE.md`, with the frontmatter filled from the verified posting. `links:` carries both URLs where they differ, the resolved `applyUrl` first, because that is the one the application goes to and the board copy is the one that disappears first. Leave the sections the sweep cannot know about - `## Assessment`, `## Materials sent`, `## Feedback` - as the template leaves them. Every lead lands here at `status: found`; step 6 is what moves the survivors off it.

`## Job description` names the spec rather than repeating it: one line saying it was fetched by the sweep, the date, and which route read it - `Fetched by the /find-jobs sweep 2026-08-17 from the Greenhouse board API; the listing is in `spec.txt` beside this file.` The verbatim copy is already there, written by the fetcher rather than typed out of an agent's context, and a paste beside it is a second copy that can drift from the first. Where `specPath` came back null the sweep has no copy, so say that instead - and where the lead is one being applied for, capture it by hand before the application goes out, because it will be gone within weeks.

The shortlist is not the whole write. **Leads the filters dropped get a record too**, with `status: filtered` and `filtered:` naming which filter did it, because that is what makes the next sweep cheaper and what shows whether the aim is right. Leads in `unconfirmed` get one at `status: found` with the note saying what could not be settled.

Those dropped leads come back in `droppedLeads`, one entry per lead, each carrying `dropReason` and `dropStage`. **Write a record for every one of them** - `salary` and `stale` included, which are the two easiest to think of as arithmetic rather than as decisions. A drop that exists only as a number in `stats` is a role the next sweep pays to find, verify and drop again, and it is invisible in the folder when the question is whether the floor or the window is set right.

`dropStage` decides how much the record can say, and the rule against inventing detail is what draws the line:

- **`verification`** - the posting was fetched and read, so the record is a full one: the frontmatter from the verdict, `## Job description` pointing at the `spec.txt` the verifier saved, and `filtered:` naming the reason. A `salary` drop states the advertised band as the posting stated it, because that band is the evidence for the decision.
- **`title`** - the lead never reached a fetch, so there is no spec and no `specPath`, and the record carries the company, the title, the URL, `found:` and nothing else. Leave `## Job description` empty rather than reconstructing a spec nobody read, and write `filtered: title - out of band` or `filtered: title - standing filter` accordingly.

Neither kind is assessed - step 6 takes the shortlist only.

Do not touch a record for a role already applied for - step 1 read those, and the sweep has nothing to add to them.

### 6. Assess every survivor, and triage on what comes back

Run `/assess-fit` against each lead that reached the shortlist and cleared the 5% floor at step 3, best-ranked first, and write its output into that lead's `## Assessment` with `assessed:` set - exactly as the skill does when run on its own. What this step adds is the triage: the assessment now decides the record's `status` rather than leaving every lead at `found` for the user to sort by hand.

**The first of the four estimates decides it** - the first-stage interview probability, which is the CV screen and the only gate every application meets. Take the **midpoint** of its range and compare:

| Midpoint of the first-stage estimate | `status` | Meaning |
|---|---|---|
| **above 15%** | `shortlisted` | worth an application - hand to `/generate-cv` |
| **5% to 15%** | `found`, with `stage: assessed` | the user's call, and reported as one |
| **below 5%** | `filtered` | not applying |

A range decided by its midpoint means `8-13%` is 10.5% and needs a decision, `14-20%` is 17% and is shortlisted, `2-6%` is 4% and is dropped. Both boundaries fall in the middle band: a lead is shortlisted only *above* 15 and dropped only *below* 5, so an estimate whose midpoint lands exactly on either figure goes to the user.

A dropped lead's `filtered:` line names this step and the number, so it reads differently from a lead a standing filter dropped - `assessment - first-stage midpoint 4%, below the 5% floor`. Both are `status: filtered` and both stop the next sweep re-surfacing the role, but only one of them is a statement about fit rather than about the stack or the band.

**Only survivors are assessed.** A lead the sweep's own filters already dropped - or the ranking gate at step 3 - keeps `status: filtered` and the reason that did it, and gets no assessment - a full funnel written for a role ruled out on its stack is spend with no decision behind it. Leads in `unconfirmed` are not assessed either: an assessment of a posting that could not be verified is a forecast about something that may not exist.

**The triage never edits the estimate to reach a band.** Where a lead sits just under 15% the honest move is the middle band and a sentence to the user about what would move it, not a rounded-up range. `METHOD.md` governs the numbers; this step only reads them.

### 7. Hand off

Report the three groups separately, because they need three different things from the user:

- **Shortlisted** - name them, best first, and say which one you would send first and why. Offer `/generate-cv` against it.
- **Needs a decision** - the middle band, each with its midpoint, the single strongest reason it fell short of 15%, and what would move it. This is the only group that blocks: wait for the user rather than guessing which way each goes.
- **Not applying** - a count and the roles by name, one line each carrying the midpoint and the reason. Say which of the two floors closed each one, the ranking at step 3 or the assessment at step 6, because the first is a forecast made without a funnel behind it and the user is the only check on it. No argument for them beyond that; they are recorded and closed.

## Rules that are not negotiable

- **Apply at the source, not the board.** A board posting is where a lead is found; the application goes to the employer's own careers page or the ATS behind it. Verification resolves that URL as `applyUrl` and the report leads with it. Applying through LinkedIn - Easy Apply above all, which sends a profile scrape in place of the tailored CV and the covering letter - is the last resort, for a vacancy that genuinely exists nowhere else.
- **Every lead traces to a URL fetched this session.** No lead from a search snippet alone, no company remembered from training data, no "likely to be hiring". Found and verified, or absent.
- **Never invent a detail.** No salary, date, location or stack the posting does not state - the rule that governs the CV governs this too.
- **Every estimate traces to a base rate plus named adjustments.** The ranking is a set of forecasts, and `METHOD.md` governs them here exactly as it does in `/assess-fit`.
- **The triage reads the estimate; it never writes it.** A lead is shortlisted or dropped by where the first-stage midpoint already fell, never by an estimate nudged to land on the wanted side of a threshold. That governs both floors - the ranking one at step 3 as much as the assessment one at step 6, and the ranking one more sharply, because nothing downstream checks it. Where the band feels wrong, the thing to say is that the band feels wrong - to the user, in the report - not to move the number.
- **The middle band is the user's, and it blocks.** Nothing between 5% and 15% gets applied for or written off on the skill's own authority. Reporting it as decided when it is not is the one failure this triage can produce that the record cannot show afterwards.
- **The filters stay out of the repo.** The stack filter lives in memory, the salary floor in `.env`; both pass as runtime arguments and their figures are never restated anywhere committed.
- **Nothing to the committed repo.** No report file and no leads file anywhere but `applications/`, which is gitignored and documented in `CLAUDE.md`. The conversation is still the deliverable; the records are what the next sweep reads.
