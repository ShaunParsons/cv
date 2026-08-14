---
name: find-jobs
description: Fan out across job boards and the hidden market - ATS-hosted careers pages, specialist recruiter boards, funding announcements, who-is-hiring threads - for live roles matching the profile in this repo, filtered against the user's standing criteria and ranked by likelihood of a first interview. Use when the user asks to find jobs, search for openings, see who is hiring, or wants leads for a particular kind of role. Takes an optional target role and an optional posting window; called bare it covers the whole credible band over the last month. Reports in conversation and records every lead under applications/, which is gitignored.
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

### 2. Fan out

The sweep is never run inline - it fans out to subagents, always, and the orchestration is deterministic: `scripts/sweep.mjs` in this skill's directory is the pipeline, run with the Workflow tool (this instruction is the opt-in):

```
Workflow({
  scriptPath: "<this skill's directory>/scripts/sweep.mjs",
  args: {
    sweepDoc: "<absolute path to this skill's SWEEP.md>",
    today: "YYYY-MM-DD", sinceDate: "YYYY-MM-DD",
    windowLabel: "the last 2 weeks",
    brief: { titles: [], locationScope: "", stackKeywords: [], band: "" },
    stackFilter: "<wording from memory, or null>",
    salaryFloorGbp: <number from .env, or null>,
  },
})
```

The script fans out one Sonnet 5 searcher per modality in [SWEEP.md](SWEEP.md) - major boards, startup boards and threads, ATS-hosted careers pages, hiring signals, specialist recruiter boards, remote-first boards - each blind to the others, which is the point: one search angle does not find everything. It then dedupes on normalised company-plus-title in plain code, fans out Sonnet 5 verifiers over the survivors, applies the recency and salary arithmetic itself, and returns the shortlist with reconciled counts. Judgement lives inside the agent slots - the queries, the reading of postings, the stack centre-of-gravity call; everything between them is script. Where the Workflow tool is unavailable, mirror the same stages with parallel `Agent` calls on Sonnet 5; a single sequential search is not an acceptable fallback.

`scripts/verify.mjs` is the verification stage on its own: it takes a `leads` array in place of running the searchers, with the rest of the args contract unchanged. Use it to verify leads the cap left over, to re-check leads that came back unconfirmed, or to re-verify a stale shortlist days later without re-running the sweep.

`scripts/browser_fetch.mjs` is the fetch fallback both stages lean on: it renders one URL through headless Chromium (Playwright) and prints the page's visible text as JSON, which gets an agent past the bot walls and client-rendered shells a plain fetch cannot read - the 403s, the connections held open until timeout, the Ashby-style empty shells. The workflow scripts derive its path from `sweepDoc` and name it in every agent prompt; it is equally usable inline when a single spec URL is blocked. One URL per invocation keeps its request rate at a reader's pace, not a crawler's. It needs a one-time setup - `npm install` in `scripts/`, then `npx playwright install chromium` there - and degrades cleanly without it: the script prints the setup instruction, and the pipeline falls back to the ATS APIs with unsettleable leads reported as unconfirmed, exactly as before.

### 3. Rank by first-interview likelihood

The sweep returns `shortlist`, `unconfirmed`, `speculative`, `unverifiedOverflow` and `stats`. Leads in `unconfirmed` could not be settled either way - a blocked fetch or a client-rendered shell with no authoritative alternative - and belong in the report as unconfirmed, not in the shortlist and not silently gone. Ranking the shortlist is the main loop's judgement, and it is a forecast, not a preference order: read `../assess-fit/METHOD.md` and start each lead from the base rate for its route, then adjust for what the posting and the role files show - requirements coverage, the seniority match, how contested the posting looks. Every position in the ranking traces to "base rate X, adjusted for Y and Z", the same discipline `/assess-fit` enforces; what this skill does not do is the full funnel, which stays with `/assess-fit`.

### 4. Report

Lead with the ranked shortlist, best first, split into two tables - **boards** and **hidden market** - because the second list is the one this skill exists for. Each row: company, title, location and working pattern, advertised band where stated, source, the first-interview estimate as a range, and a one-line fit note grounded in a role file. Speculative signals follow separately.

Then show the work in brief, straight from `stats`: raw leads per modality, how many the dedupe folded, and how many verification dropped by reason class (dead, stale, location, stack, seniority, salary). Counts, not a match percentage - the same rule as `/assess-fit`, for the same reason.

The salary floor applies to permanent roles; contract leads are reported with the day rate where stated and are not filtered on it.

### 5. Record every lead

Write one directory per lead under `applications/`, named `<company>-<role>` in lower case with hyphens - `montu-uk-tech-lead`. Each holds an `application.md` built from `applications/TEMPLATE.md`, with the frontmatter filled from the verified posting and the listing pasted verbatim under `## Job description`. Leave the sections the sweep cannot know about - `## Assessment`, `## Materials sent`, `## Feedback` - as the template leaves them.

The shortlist is not the whole write. **Leads the filters dropped get a record too**, with `status: filtered` and `filtered:` naming which filter did it, because that is what makes the next sweep cheaper and what shows whether the aim is right. Leads in `unconfirmed` get one at `status: found` with the note saying what could not be settled.

Do not touch a record for a role already applied for - step 1 read those, and the sweep has nothing to add to them.

### 6. Hand off

Offer to run `/assess-fit` against the strongest leads, and say which two or three you would start with and why. Wait for a yes - the shortlist is worth reading before assessments get written from it.

## Rules that are not negotiable

- **Every lead traces to a URL fetched this session.** No lead from a search snippet alone, no company remembered from training data, no "likely to be hiring". Found and verified, or absent.
- **Never invent a detail.** No salary, date, location or stack the posting does not state - the rule that governs the CV governs this too.
- **Every estimate traces to a base rate plus named adjustments.** The ranking is a set of forecasts, and `METHOD.md` governs them here exactly as it does in `/assess-fit`.
- **The filters stay out of the repo.** The stack filter lives in memory, the salary floor in `.env`; both pass as runtime arguments and their figures are never restated anywhere committed.
- **Nothing to the committed repo.** No report file and no leads file anywhere but `applications/`, which is gitignored and documented in `CLAUDE.md`. The conversation is still the deliverable; the records are what the next sweep reads.
