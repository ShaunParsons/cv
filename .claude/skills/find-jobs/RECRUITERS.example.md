# Vetted recruiter boards

Placeholders only. Copy this to `RECRUITERS.md` beside it - which is gitignored - and fill it with the agencies that recruit your ground. Modality 5 of the sweep works through every row, every run, so a row costs a fetch: keep the list to desks that genuinely place the profile rather than to every agency that has ever been in touch.

Vet a row before adding it. Fetch the jobs page and confirm the specialism on the page rather than from the agency's own strapline, because a general IT recruiter dressed as a cloud specialist returns a run's worth of mid-level contract roles.

`†` marks a board that shows an empty client-rendered shell or a 403 to a plain fetch. For those, go straight to the browser fetcher named in your prompt, or search the index with `site:<domain> "<title>"` and fetch only the hits. Mark them as you find them - it saves the next run a dead fetch and a retry.

Without this file the sweep still runs: Modality 5 falls back to searching the index for recruiter ads generically, which is broader, noisier and misses the boards that never reach it.

| Recruiter | Focus | Jobs page |
|---|---|---|
| [Example Recruitment](https://www.example.com/) | What this desk actually places - stack, seniority band, region | <https://www.example.com/jobs/> |
| [Example Cloud Talent](https://www.example.org/) | AWS and platform engineering, senior to head of engineering, Midlands | <https://www.example.org/job-search/> † |
