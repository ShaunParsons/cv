---
name: find-jobs
description: Fan out across job boards and the hidden market - ATS-hosted careers pages, specialist recruiter boards, funding announcements, who-is-hiring threads, a standing list of target companies asked directly - for live roles matching the profile in this repo, filtered against the user's standing criteria and ranked by likelihood of a first interview. Use when the user asks to find jobs, search for openings, see who is hiring, or wants leads for a particular kind of role. Takes an optional target role and an optional posting window; called bare it covers the whole credible band over the last month. Reports in conversation and records every lead under applications/, which is gitignored.
argument-hint: "[target role, e.g. engineering manager] [window, e.g. last 2 weeks]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, ToolSearch, Agent, Workflow, AskUserQuestion
---

# find-jobs

Sweep the open job market and the hidden one for roles worth assessing, hold each lead against the sources in this repo, and report a ranked shortlist. This skill finds, filters and ranks; it does not score an application in depth - that is `/assess-fit`, which each lead should be handed on to.

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
  },
})
```

Three of those arguments exist because parts of the pipeline are arithmetic and arithmetic cannot read prose. `stackFilter` is wording an agent judges a posting against; `excludeTitleTerms` is that same filter restated as terms a regex can match in a title, since a sentence about what an estate centres on is not something a gate can apply. `brief.locationTerms` and `notLocations` do the same for the location scope, and the second is not the inverse of the first: "remote" is a working pattern rather than a place and every board writes it beside one, so "United States (Remote)" clears a bare `"remote"` allow-list and has to be ruled out by name.

The script fans out one Sonnet 5 searcher per modality in [SWEEP.md](SWEEP.md) - major boards, startup boards and threads, ATS-hosted careers pages, hiring signals, specialist recruiter boards, remote-first boards, target companies - each blind to the others, which is the point: one search angle does not find everything. The last of them inverts the rest: it starts from a standing list of employers and asks each what it is hiring for, which reaches requisitions worded too far from the brief's titles for any query to rank. It then dedupes on normalised company-plus-title in plain code, grades every lead's title through one shared gate, fans out Sonnet 5 verifiers over the survivors, applies the recency and salary arithmetic itself, and returns the shortlist with reconciled counts.

`scripts/title_filter.mjs` is that gate, and it runs at both ends: each searcher is told to grade a batch of titles before spending a fetch on them, and the pipeline grades every returned lead again centrally, so the rule is one rule rather than seven readings of it. It answers in three values, and the third is the point - `strong`, `null`, and `ambiguous` for a title like a bare "Engineering Manager" that names no discipline either way. Only `strong` and `null` settle anything; an ambiguous title rides through to verification flagged, because a fetch answers it and a regex does not. It holds no exclusion terms of its own: those arrive as `excludeTitleTerms`, because this repo is public and they are the user's. Judgement lives inside the agent slots - the queries, the reading of postings, the stack centre-of-gravity call; everything between them is script. Where the Workflow tool is unavailable, mirror the same stages with parallel `Agent` calls on Sonnet 5; a single sequential search is not an acceptable fallback.

Verification is capped, and the cap is spent round-robin across the modalities rather than down one flat list. A modality working a standing list of a couple of hundred employers returns leads by the hundred while a search-led one returns a dozen, so a flat ordering would let the largest single modality take the whole budget and quietly turn a seven-angle sweep into a one-angle one. Within each modality's own share, hidden-market leads go first. Whatever the cap leaves over comes back as `unverifiedOverflow`, counted by modality in the log rather than dropped.

`scripts/verify.mjs` is the verification stage on its own: it takes a `leads` array in place of running the searchers, with the rest of the args contract unchanged. Use it to verify leads the cap left over, to re-check leads that came back unconfirmed, or to re-verify a stale shortlist days later without re-running the sweep.

`scripts/browser_fetch.mjs` is the fetch fallback both stages lean on: it renders one URL through headless Chromium (Playwright) and prints the page's visible text as JSON, which gets an agent past the bot walls and client-rendered shells a plain fetch cannot read - the 403s, the connections held open until timeout, the Ashby-style empty shells. The workflow scripts derive its path from `sweepDoc` and name it in every agent prompt; it is equally usable inline when a single spec URL is blocked. One URL per invocation keeps its request rate at a reader's pace, not a crawler's. It needs a one-time setup - `npm install` in `scripts/`, then `npx playwright install chromium` there - and degrades cleanly without it: the script prints the setup instruction, and the pipeline falls back to the ATS APIs with unsettleable leads reported as unconfirmed, exactly as before.

### 3. Rank by first-interview likelihood

The sweep returns `shortlist`, `unconfirmed`, `speculative`, `unverifiedOverflow` and `stats`. Leads in `unconfirmed` could not be settled either way - a blocked fetch or a client-rendered shell with no authoritative alternative - and belong in the report as unconfirmed, not in the shortlist and not silently gone. Ranking the shortlist is the main loop's judgement, and it is a forecast, not a preference order: read `../assess-fit/METHOD.md` and start each lead from the base rate for its route, then adjust for what the posting and the role files show - requirements coverage, the seniority match, how contested the posting looks. Every position in the ranking traces to "base rate X, adjusted for Y and Z", the same discipline `/assess-fit` enforces; what this skill does not do is the full funnel, which stays with `/assess-fit`.

**The spec's own shape is one of the adjustments.** The user's memory holds a rubric drawn from the two job descriptions he named as the benchmark, and it scores a spec from its text alone - the seniority band and title, whether the role says outright that it is hands-on, single-team scope against manager-of-managers language, backend or platform framing, whether the *essential* requirements clear the standing stack filter, a published band against the floor in `.env`, and the stated location terms. Those are gates. What spreads the survivors is softer: AI named in the development flow, a spec that names a concrete problem the team has rather than listing fifteen unranked "must haves", and third-party integration or event-driven data on the page. Read the rubric from memory rather than from here - the figures and the filtered technologies stay out of this repo, and the wording there is the current one.

Screen the essential list, never the bonus list. A spec whose essentials are capability-shaped and whose filtered technology appears only under "nice to have" passes; one that gates on that technology fails however good the rest reads.

### 4. Report

Lead with the ranked shortlist, best first, split into two tables - **boards** and **hidden market** - because the second list is the one this skill exists for. Each row: company, title, location and working pattern, advertised band where stated, source, the first-interview estimate as a range, and a one-line fit note grounded in a role file.

Where a lead was found on a board, the row names where to apply rather than where it was found - the `applyUrl` the verifier resolved. A lead whose `applyUrl` came back null is flagged as board-only, because that is the one case where applying through the board is the right move and the user should know it was the last resort rather than the default. Speculative signals follow separately.

Then show the work in brief, straight from `stats`: raw leads per modality, how many the dedupe folded, how many the title gate dropped (`titleDropped`, split into out of band and ruled out by the standing filter), and how many verification dropped by reason class (dead, stale, discipline, location, stack, seniority, salary). Counts, not a match percentage - the same rule as `/assess-fit`, for the same reason. The two drop tallies are separate because they answer different questions: one says how much of what the searchers found was never in scope, which is a fact about the queries, and the other says how much survived to a fetch and failed there, which is a fact about the market.

The salary floor applies to permanent roles; contract leads are reported with the day rate where stated and are not filtered on it.

### 5. Record every lead

Write one directory per lead under `applications/`, named `<company>-<role>` in lower case with hyphens - `montu-uk-tech-lead`. Each holds an `application.md` built from `applications/TEMPLATE.md`, with the frontmatter filled from the verified posting and the listing pasted verbatim under `## Job description`. `links:` carries both URLs where they differ, the resolved `applyUrl` first, because that is the one the application goes to and the board copy is the one that disappears first. Leave the sections the sweep cannot know about - `## Assessment`, `## Materials sent`, `## Feedback` - as the template leaves them.

The shortlist is not the whole write. **Leads the filters dropped get a record too**, with `status: filtered` and `filtered:` naming which filter did it, because that is what makes the next sweep cheaper and what shows whether the aim is right. Leads in `unconfirmed` get one at `status: found` with the note saying what could not be settled.

Do not touch a record for a role already applied for - step 1 read those, and the sweep has nothing to add to them.

### 6. Hand off

Offer to run `/assess-fit` against the strongest leads, and say which two or three you would start with and why. Wait for a yes - the shortlist is worth reading before assessments get written from it.

## Rules that are not negotiable

- **Apply at the source, not the board.** A board posting is where a lead is found; the application goes to the employer's own careers page or the ATS behind it. Verification resolves that URL as `applyUrl` and the report leads with it. Applying through LinkedIn - Easy Apply above all, which sends a profile scrape in place of the tailored CV and the covering letter - is the last resort, for a vacancy that genuinely exists nowhere else.
- **Every lead traces to a URL fetched this session.** No lead from a search snippet alone, no company remembered from training data, no "likely to be hiring". Found and verified, or absent.
- **Never invent a detail.** No salary, date, location or stack the posting does not state - the rule that governs the CV governs this too.
- **Every estimate traces to a base rate plus named adjustments.** The ranking is a set of forecasts, and `METHOD.md` governs them here exactly as it does in `/assess-fit`.
- **The filters stay out of the repo.** The stack filter lives in memory, the salary floor in `.env`; both pass as runtime arguments and their figures are never restated anywhere committed.
- **Nothing to the committed repo.** No report file and no leads file anywhere but `applications/`, which is gitignored and documented in `CLAUDE.md`. The conversation is still the deliverable; the records are what the next sweep reads.
