# Target companies

Placeholders only. Copy this to `COMPANIES.md` beside it - which is gitignored - and fill it with the employers worth working for. Modality 7 of the sweep asks each one what it is hiring for right now, rather than waiting for a search to surface it.

One row per company. `Careers or ATS` is optional but worth filling: with it, the searcher goes straight to the board instead of spending a search finding it, and it pins the right company where the name is ambiguous. The ATS API endpoint is the best answer of all where one exists - it answers in one request and carries every live requisition, including the ones worded too far from any query to rank. A careers page a human reads is the fallback.

`Why` is for the reader, not the searcher - a line on what put the company on the list, so a lead from it arrives with its reason attached and a stale entry is obvious a year later. A row says this employer hires the right shape of engineer, not that it has a live vacancy today; finding that out is what the sweep does with the list, every run.

Without this file, Modality 7 returns nothing and says so. It has no generic fallback: the list is the modality.

| Company | Careers or ATS | Why |
|---|---|---|
| Example Ltd | ashby: `https://api.ashbyhq.com/posting-api/job-board/example` | 3 matching roles in the window; incl. Lead Platform Engineer; latest 2026-08-01; board names node, typescript, aws |
| Example Group | greenhouse: `https://boards-api.greenhouse.io/v1/boards/examplegroup/jobs?content=true` | Event-sourced platform, Midlands office within commuting distance |
| Example Holdings | <https://www.example-holdings.com/careers> | No ATS API - careers page read directly; met their CTO at a meet-up |
