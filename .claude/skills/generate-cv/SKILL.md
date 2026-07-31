---
name: generate-cv
description: Write cv.md from roles/*.md, qualifications.md and profile.md - generic when called bare, or tailored to a job spec when given a URL, a PDF or a text file. Use when the user asks to generate, write, tailor or refresh their CV, or asks for a CV for a particular job or company. Stops at cv.md; rendering to PDF is `make`.
argument-hint: "[job spec URL | path to job spec PDF/txt]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# generate-cv

Turn `roles/*.md`, `qualifications.md` and `profile.md` into `cv.md`.

**This skill stops at `cv.md`.** It does not build the deliverable PDF. The user
reviews and edits `cv.md`, then runs `make` themselves. Do not run `make` on
their behalf unless they ask - a render they did not ask for invites them to
skim rather than read, and the review is the point. The single exception is
`make pages`, which checks the two-page limit; see step 5.

## Modes

| Invocation | Behaviour |
|---|---|
| `/generate-cv` | Generic CV - broad coverage, no target role |
| `/generate-cv <url>` | Fetch the spec, tailor to it |
| `/generate-cv <file.pdf>` | Extract the spec, tailor to it |
| `/generate-cv <file.txt\|.md>` | Read the spec, tailor to it |

## Procedure

### 1. Get the job spec (skip when called bare)

Never fetch by hand - the script normalises URLs, PDFs and text files to the
same plain text, so the same spec always gives the same starting point:

```bash
python3 scripts/fetch_spec.py "<ARGUMENT>" --out .job-spec.txt
```

`.job-spec.txt` is gitignored. Read it. If the script warns that it extracted
almost nothing, the spec is behind JavaScript or a login - say so and ask the
user to paste the text into a file rather than guessing at the role.

Pull out, and state back to the user in two or three lines: the job title, the
must-have requirements, the technologies named, and whether the role is weighted
towards hands-on engineering, leadership, or both.

### 2. Read the sources

Read **every** file in `roles/`, plus `qualifications.md` and `profile.md`. Do
not work from a subset, and do not work from a previously generated `cv.md` - it
is output, and tailoring from it compounds whatever the last pass dropped.

`profile.md` is where the summary comes from: the direction and the wording to
keep. Everything in the summary traces back to it or to a role file, the same as
every other line on the CV.

Each role file carries tailoring metadata that tells you what to do:

- `Emphasise for:` - the roles this achievement is evidence for. Match against
  the spec.
- `Leads for:` - what this role should open with, per target type.
- `Contribution:` - who did what. This governs how the bullet is worded.
- `Metric:` - a confirmed number. Use it. If there is no metric, there is no
  number - see the rules below.
- `## Tailoring notes` - read these last and take them seriously; they encode
  decisions already made about how the material should be presented.
  `profile.md` and `qualifications.md` carry a section under the same heading,
  governing the summary and the qualifications block respectively, and they bind
  exactly as the ones in `roles/*.md` do.

### 3. Select

**What goes on the CV by default:**

- **The four most recent roles**, and no more. At the time of writing that is
  Parsons Group, Talis Education, Opilio Technologies and Amigo Technology.
  Everything earlier stays in `roles/` and stays off the CV.
- **The MEng only**, for education. No A levels, no GCSEs, no schooling - they
  are fifteen years behind the work and earn their place only where a spec
  actually asks for grades.
- **The AWS certifications**, which are not education and are unaffected by the
  rule above. State them as `qualifications.md` does - see the accuracy rules
  below, because how they are worded matters.

Override any of this if a spec makes it wrong - a role explicitly wanting deep
SQL has evidence in Farmfoods that nothing more recent carries - but say so when
handing over rather than silently widening the CV.

**What always appears:**

- **Two pages.** Never one, never three. See below - it governs how much of
  everything else survives.

**Pick a register.** `CLAUDE.md` defines six - General, Senior developer,
Technical lead, Head of engineering / founder / early startup, Project
management, and AI-assisted development. Read that section and choose from the
job spec's title and weighting; bare invocations get General. The register
decides what leads each role and what gets trimmed, so choose before writing a
line, and name your choice when handing over.

The AI-assisted register is the only one that mentions how this CV is produced
or links the repo. Do not carry that line into any other register, however well
it would land.

**Generic mode.** Broad coverage within those four roles. Lead each with its
strongest achievement and carry the hard numbers.

**Tailored mode.** For each requirement in the spec, find the evidence in
`roles/` and lead with it. Recent and relevant roles earn more space; the older
of the four compress to two or three lines rather than disappearing. Reorder
bullets *within* a role freely. Never reorder the roles themselves: they are
reverse-chronological and stay that way.

Adjust `Key Competencies` and `Technical Skills` to the spec, but only ever by
selecting from what the source files support. A skill that appears in no role
file does not go on the CV.

### 4. Write `cv.md`

Follow this structure exactly - `style.css` keys off it, and
`scripts/validate_cv.py` enforces it:

````markdown
---
name: Shaun Parsons
tailored-for: "Staff Engineer at Example Ltd"   # omit or "" when generic
---

::: summary
Two or three sentences. In tailored mode this is the highest-leverage paragraph
on the page - it should read as though written for this role.
:::

## Key Competencies

::: grid
- Twelve or so items, flat list, no nesting
:::

## Technical Skills

::: grid
- Twelve or so items, flat list, no nesting
:::

## Professional Experience

### Company Name, Location - *Job Title*

Month Year - Month Year

- Top-level achievement.
    - Supporting detail, indented four spaces.
        - Third level exists but is rarely worth it.

## Qualifications

### Certification Or Institution

Year, or a short qualifying line

- Detail if it needs one.
````

Hard structural requirements:

- Front matter must set `name`. Contact details are **never** written here -
  address and phone are injected at render time from `$CV_ADDRESS` and
  `$CV_PHONE`, and the email is set in the `Makefile`.
- Exactly one `::: summary` block.
- `:::grid` takes a **flat** list. A nested bullet inside one breaks the
  three-column layout.
- Every heading under Professional Experience is
  `### Company, Location - *Job Title*` with the title in italics, followed by
  a date line as an ordinary paragraph. Both parts are load-bearing: the
  stylesheet styles the paragraph after a role heading as the dates.
- No `#` in the body - the masthead comes from the template. No `####` or
  deeper.

### 5. Validate

```bash
python3 scripts/validate_cv.py cv.md
```

Fix everything it reports. Do not hand the file over with errors outstanding.

Then check the length:

```bash
make pages
```

This is the one `make` target the skill runs, and the exception to the rule
above: it renders only to count pages, and the answer is not knowable from the
Markdown. If it fails, cut and rewrite until it passes - the weakest bullet
goes, or two lines become one. Never edit `style.css`, the margins or the type
size to make it fit; the length is the constraint the writing works within.

### 6. Hand over

Tell the user, briefly:

- Which mode ran, and for tailored mode, what you led with and why.
- What you **left out** that they might expect to see, and the reason. This
  matters more than what you put in - they know the history and you are
  compressing it.
- Any figure the spec asked for that the source files do not carry.
- That the next step is theirs: review `cv.md`, then `make` (or `make pdf`).

## Rules that are not negotiable

These come from `CLAUDE.md` and they are the whole reason the repo is
structured this way. Re-read that file if anything below is unclear.

- **Never invent a detail.** No metric, date, title or technology that the
  source files do not confirm. If a spec asks for a number the sources do not
  carry, leave the line out and tell the user - an invented figure survives
  right up until an interviewer asks about it.
- **Omit rather than hedge.** No "approximately", no placeholder, no
  `unverified`. An achievement without a number still reads as an achievement;
  one carrying a hedge reads as a draft.
- **Respect `Contribution:`.** Where a role file distinguishes leading from
  implementing, or a team achievement from a personal one, the CV bullet must
  carry that distinction. State the fact precisely and the overclaim becomes
  impossible: *"the decision was taken before I became technical lead; I led
  the implementation"*.
- **Never write a weakness the spec did not ask about.** No "the shortest
  role", no "explains the gap". Where something was never established, leave
  it out.
- **Nothing private.** No compensation, no reasons for leaving, no named
  criticism of former employers, no home address or phone number. The repo is
  public; treat every file in it as already on the internet.
- **Do not touch `dist/`.** It is build output.
