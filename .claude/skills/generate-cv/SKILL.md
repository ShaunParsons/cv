---
name: generate-cv
description: Write cv.md from roles/*.md, qualifications.md, profile.md and competencies.md - generic when called bare, or tailored to a job spec when given a URL, a PDF or a text file. Use when the user asks to generate, write, tailor or refresh their CV, or asks for a CV for a particular job or company. Stops at cv.md; rendering to PDF is `make`.
argument-hint: "[job spec URL | path to job spec PDF/txt]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# generate-cv

Turn `roles/*.md`, `qualifications.md`, `profile.md` and `competencies.md` into `cv.md`.

**This skill stops at `cv.md`.** It does not build the deliverable PDF. The user reviews and edits `cv.md`, then runs `make` themselves. Do not run `make` on their behalf unless they ask - a render they did not ask for invites them to skim rather than read, and the review is the point. The single exception is `make pages`, which checks the two-page limit; see step 5.

## Modes

| Invocation | Behaviour |
|---|---|
| `/generate-cv` | Generic CV - broad coverage, no target role |
| `/generate-cv <url>` | Fetch the spec, tailor to it |
| `/generate-cv <file.pdf>` | Extract the spec, tailor to it |
| `/generate-cv <file.txt\|.md>` | Read the spec, tailor to it |

## Procedure

### 1. Get the job spec (skip when called bare)

Never fetch by hand - the script normalises URLs, PDFs and text files to the same plain text, so the same spec always gives the same starting point:

```bash
python3 scripts/fetch_spec.py "<ARGUMENT>" --out .job-spec.txt
```

`.job-spec.txt` is gitignored. Read it. If the script warns that it extracted almost nothing, the spec is behind JavaScript or a login - say so and ask the user to paste the text into a file rather than guessing at the role.

Pull out, and state back to the user in two or three lines: the job title, the must-have requirements, the technologies named, and whether the role is weighted towards hands-on engineering, leadership, or both.

### 2. Read the sources

Read **every** file in `roles/`, plus `qualifications.md`, `profile.md` and `competencies.md`. Do not work from a subset, and do not work from a previously generated `cv.md` - it is output, and tailoring from it compounds whatever the last pass dropped.

`profile.md` is where the summary comes from: the direction and the wording to keep. Everything in the summary traces back to it or to a role file, the same as every other line on the CV.

Every achievement in a role file is written on a **STAR backbone** - `Situation:`, `Task:`, `Action:`, `Result:`, in that order - carrying the facts, followed by metadata telling you what to do with them:

- `Situation:` and `Task:` - the context and the brief. These reach the page too: a bullet carries all four beats wherever it can. `Task:` is omitted from a role file where the brief only restates the headline, and it is the first beat to leave a bullet when the page runs out.
- `Action:` and `Result:` - what was done and what changed. Where a `Result:` carries a number it is a confirmed one, so use it; where there is no `Result:` line at all, no outcome was ever established, and supplying one is the invention the rules below bar.
- `Emphasise for:` - the roles this achievement is evidence for. Match against the spec.
- `Leads for:` - what this role should open with, per target type.
- `Contribution:` - who did what across the four keys above. This governs how the bullet is worded.
- `Note:` - a fact about the achievement that sits outside its STAR: a caveat, a rendering instruction, a pointer to another role file.
- `On a CV:` - a decision already taken about whether the bullet reaches the page, and it binds. Where it says not selected, the reason given binds with it. Some of these hold back material that reads well in an interview and badly in a scan - a recovered production incident, a proposal that never shipped - so a generation that finds one compelling and uses it anyway has done the specific harm the marker exists to prevent. Where it says "not selected by default", the exception named there is the only route onto the page.
- `## Tailoring notes` - read these last and take them seriously; they encode decisions already made about how the material should be presented. `profile.md` and `qualifications.md` carry a section under the same heading, governing the summary and the qualifications block respectively, and they bind exactly as the ones in `roles/*.md` do.

### 3. Select

**What goes on the CV by default:**

- **The four most recent roles**, and no more. At the time of writing that is Parsons Group, Talis Education, Opilio Technologies and Amigo Technology. Everything earlier stays in `roles/` and stays off the CV.
- **The MEng only**, for education. No A levels, no GCSEs, no schooling - they are fifteen years behind the work and earn their place only where a spec actually asks for grades.
- **The AWS certifications**, which are not education and are unaffected by the rule above. State them as `qualifications.md` does - see the accuracy rules below, because how they are worded matters.

Override any of this if a spec makes it wrong - a role explicitly wanting deep SQL has evidence in Farmfoods that nothing more recent carries - but say so when handing over rather than silently widening the CV.

**What always appears:**

- **Two pages.** Never one, never three. See below - it governs how much of everything else survives.

**Pick a register.** `CLAUDE.md` defines seven - General, Senior developer, Technical lead, Engineering manager, Head of engineering / founder / early startup, Project management, and AI-assisted development. Read that section and choose from the job spec's title and weighting; bare invocations get General. The register decides what leads each role and what gets trimmed, so choose before writing a line, and name your choice when handing over.

The AI-assisted register is the only one that mentions how this CV is produced or links the repo. Do not carry that line into any other register, however well it would land.

**Generic mode.** Broad coverage within those four roles. Lead each with its strongest achievement and carry the hard numbers.

**Tailored mode.** For each requirement in the spec, find the evidence in `roles/` and lead with it. Recent and relevant roles earn more space; the older of the four compress to two or three lines rather than disappearing. Reorder bullets *within* a role freely. Never reorder the roles themselves: they are reverse-chronological and stay that way.

Adjust `Key Competencies` and `Technical Skills` to the spec by selecting from `competencies.md` - it is the superset, every item already traced to a role file, with an exposure list that must never reach the grid. Use the item names as written there. A skill that is not in it does not go on the CV.

**Coverage pass.** Before writing, hold the spec's must-have list against the selection: every requirement the evidence meets should have its literal term on the page, in the spec's own vocabulary - a grid item or a bullet, wherever it sits naturally. AI-assisted screening reads the application against the spec's criteria and looks for quotable evidence, so a met requirement whose term never appears reads as unmet. This never licenses a claim the sources do not carry: the term takes a slot only where the evidence already exists.

### 4. Write `cv.md`

Follow this structure exactly - `style.css` keys off it, and `scripts/validate_cv.py` enforces it:

````markdown
---
name: Shaun Parsons
tailored-for: "Staff Engineer at Example Ltd"   # omit or "" when generic
---

## Professional Summary

::: summary
Two or three sentences. In tailored mode this is the highest-leverage paragraph on the page - it should read as though written for this role.
:::

## Key Competencies

::: grid
- **Leading:** Item, Item, Item - a bold group label, items comma-separated
- **Building:** three or four such lines, flat list, no nesting
:::

## Technical Skills

::: grid
- **Languages & Data:** Item, Item, Item
- **AWS:** three or four such lines, flat list, no nesting
:::

## Professional Experience

### Company Name, Location - *Job Title*

Month Year - Month Year

- One achievement per bullet, verb first, its situation in a clause and its result closing the line. Every bullet at this level - never nested.
- The next step of the same arc, as its own bullet, naming its subject again.

## Qualifications

### Certification Or Institution

Year, or a short qualifying line

- Detail if it needs one.
````

Hard structural requirements:

- Front matter must set `name`. Contact details are **never** written here - address and phone are injected at render time from `$CV_ADDRESS` and `$CV_PHONE`, and the email is set in the `Makefile`.
- Exactly one `::: summary` block.
- `:::grid` takes a **flat** list of labelled lines - `**Label:** Item, Item, ...`, no nesting. The lines run full-width and may wrap; the label is what keeps a line legible when an applicant tracking system parses the PDF. Use the item names as `competencies.md` writes them; the group labels lean on its groupings but may be regrouped to answer the spec.
- Every heading under Professional Experience is `### Company, Location - *Job Title*` with the title in italics, followed by a date line as an ordinary paragraph. Both parts are load-bearing: the stylesheet styles the paragraph after a role heading as the dates.
- Bullets are **single-tier**, everywhere. An applicant tracking system strips indentation from the extracted text, so a sub-bullet arrives as a top-level claim with its parent gone. An arc runs as consecutive bullets in the order it happened, each naming its own subject - `CLAUDE.md`'s "Every bullet stands alone" rule governs the wording, and `scripts/validate_cv.py` warns on a nested bullet.
- No `#` in the body - the masthead comes from the template. No `####` or deeper.

#### Writing a bullet

Every bullet is a compressed STAR answer assembled from the achievement's four keys. `CLAUDE.md`'s bullet rule governs it; this is how it is applied.

**Verb first, situation in a clause, result closing the line.** The action leads because that is what a recruiter scans and an applicant tracking system keys on. The situation follows in a subordinate clause, carrying just enough to make the action mean something. The result goes last, because a line ending on a consequence is the line an interviewer asks about.

From `roles/2018-talis-education-technical-lead.md`:

```
Situation: updates being overwritten or deleted by other workers running
           concurrently, because a worker read the entire state of a MongoDB
           record ... it reached us through customers reporting them
Action:    replaced read-modify-write with atomic field-level updates ...
           then added a metric reporting any file not processed within an hour
Result:    the data loss stopped, and that class of failure would be found by
           monitoring rather than by the people it affected
```

becomes:

```markdown
- Fixed silent data loss in a document-processing service where concurrent workers overwrote each other's MongoDB writes, replacing read-modify-write with atomic field-level updates and adding a stalled-file metric that moved detection off customer reports and onto monitoring.
```

**Where four beats will not fit, drop the task first, then the situation, and never the result.** A bullet with no result is a responsibility, and that is what every register is trying to keep off the page. Where cutting the situation would leave the action ambiguous, cut the whole bullet instead and spend the lines on one that fits whole.

Two failure modes to check each bullet against:

- **The situation swallowing the line.** Three clauses of context with the verb in the last six words is an interview answer, not a bullet. If the situation needs more than a clause, the bullet is carrying two achievements - split it or drop one.
- **The situation widening the claim.** "Where the platform had no isolation" is a far bigger statement than "where one service read whole records before writing them back", and it is the beat most likely to overreach, because it describes what somebody else's system was doing. Hold it to what the role file records - this is `CLAUDE.md`'s compression rule arriving on the beat that was not there before.

### 5. Validate

```bash
python3 scripts/validate_cv.py cv.md
```

Fix everything it reports. Do not hand the file over with errors outstanding.

Then check the length:

```bash
make pages
```

This is the one `make` target the skill runs, and the exception to the rule above: it renders only to count pages, and the answer is not knowable from the Markdown. If it fails, cut and rewrite until it passes - the weakest bullet goes, or two lines become one. Never edit `style.css`, the margins or the type size to make it fit; the length is the constraint the writing works within.

### 6. Hand over

Tell the user, briefly:

- Which mode ran, and for tailored mode, what you led with and why.
- What you **left out** that they might expect to see, and the reason. This matters more than what you put in - they know the history and you are compressing it.
- Any figure the spec asked for that the source files do not carry.
- That the next step is theirs: review `cv.md`, then `make` (or `make pdf`).

### 7. File it, once it has gone out

Only after the render, and only once the user says the application was actually sent - a CV generated and then rewritten is not an application, and a record saying otherwise poisons the numbers.

`make clean` empties `dist/`, so the file that was sent has to leave it:

```bash
python3 scripts/file_application.py <slug> \
    --cv "dist/CV-Shaun-Parsons-<Company>-<date>.pdf" \
    --note dist/<covering letter or answers>.md
```

Then update `applications/<slug>/application.md`: `status: applied`, `stage: applied`, `applied:`, the `register:` that ran, `cv:` naming the filed PDF, the letter or answers under `## Materials sent`, and a `## Timeline` line. Where no record exists - the CV was generated against a spec that never went through `/find-jobs` or `/assess-fit` - create the directory from `applications/TEMPLATE.md` first, with the spec verbatim under `## Job description`.

Say what you filed and where. This is the step that makes the folder worth having: a CV nobody can trace back to a spec and an outcome is just a PDF.

## Rules that are not negotiable

These come from `CLAUDE.md` and they are the whole reason the repo is structured this way. Re-read that file if anything below is unclear.

- **Never invent a detail.** No metric, date, title or technology that the source files do not confirm. If a spec asks for a number the sources do not carry, leave the line out and tell the user - an invented figure survives right up until an interviewer asks about it.
- **Omit rather than hedge.** No "approximately", no placeholder, no `unverified`. An achievement without a number still reads as an achievement; one carrying a hedge reads as a draft.
- **Respect `Contribution:`.** Where a role file distinguishes leading from implementing, or a team achievement from a personal one, the CV bullet must carry that distinction. State the fact precisely and the overclaim becomes impossible: *"the decision was taken before I became technical lead; I led the implementation"*.
- **Never write a weakness the spec did not ask about.** No "the shortest role", no "explains the gap". Where something was never established, leave it out. `On a CV: not selected` is the same rule already applied to a specific bullet by someone who knew the context - do not re-open it.
- **Nothing private.** No compensation, no reasons for leaving, no named criticism of former employers, no home address or phone number. The repo is public; treat every file in it as already on the internet.
- **Do not touch `dist/`.** It is build output. The one exception is step 7, which moves a sent CV out of it into that application's record - and that runs through `scripts/file_application.py`, not by hand.
