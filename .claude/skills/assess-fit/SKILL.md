---
name: assess-fit
description: Score roles/*.md against one job spec - which requirements are met with evidence, which are not, and calibrated estimates for a first-stage interview, a final interview, an offer, and what that offer would be worth. Use when the user asks how well they match a role, whether it is worth applying, what their chances are, where the gaps are, or what a role would pay. Takes a job spec URL, PDF, text file, or the spec text pasted directly. Reports in conversation and writes nothing to disk.
argument-hint: "[job spec URL | path to job spec PDF/txt | pasted spec text]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch, AskUserQuestion
---

# assess-fit

Hold one job spec against `roles/*.md`, `qualifications.md` and `profile.md`, and
answer four questions: what is met, what is not, how far through the process this
application is likely to get, and what it would be worth if it landed.

**Nothing here is written to disk.** The assessment names requirements the user
does not meet and carries salary figures, and `CLAUDE.md` keeps both out of this
repo - it is public, and a gitignore is a convenience, not a boundary. So the
output is a message in the conversation and it ends there. Do not offer to save
it, do not propose a gitignored sidecar, and do not add one.

`.job-spec.txt` is the one exception, because `fetch_spec.py` already writes it
and `.gitignore` already covers it.

## Procedure

### 1. Get the spec

Never fetch by hand - the same script `/generate-cv` uses, so the same spec gives
the same starting point:

```bash
python3 scripts/fetch_spec.py "<ARGUMENT>" --out .job-spec.txt
```

Where the argument is the spec itself - pasted into the conversation rather
than arriving as a URL or a path - pass `-` and feed the text in over stdin,
verbatim and unedited:

```bash
python3 scripts/fetch_spec.py - --out .job-spec.txt <<'SPEC'
<the pasted text>
SPEC
```

Called bare, there is nothing to assess against. Ask for a URL, a file, or
pasted text rather than guessing at a role.

### 2. Build the requirements matrix

Recruiters screen against a matrix, not a keyword count. Split every requirement
in the spec into three classes:

- **Hard filters** - right to work, clearance, on-site days, a named
  certification, a year count the spec explicitly gates on. Binary. One failure
  ends the application whatever else is true, so these are scored before
  anything else and never averaged in with the rest.
- **Must-haves** - the essential criteria. Missing one is survivable; missing
  several is not.
- **Nice-to-haves** - desirable, weighted, and the thing that separates two
  candidates who both clear the must-haves.

Specs rarely label these cleanly. Infer from the wording - "essential",
"required", "you will have" against "desirable", "bonus", "nice to have" - and
say plainly which ones you inferred, because a misfiled hard filter is the one
error that changes the whole answer.

### 3. Find the evidence

Read **every** file in `roles/`, plus `qualifications.md` and `profile.md`. Not a
subset, and never `cv.md` - it is output, tailored to some other role, and
already dropped most of the evidence.

Grade each requirement against the sources:

| Grade | Means | Requires |
|---|---|---|
| **Met** | Direct evidence | Name the role file and quote the achievement |
| **Partial** | Adjacent, not the thing asked for | Say what the gap is |
| **Not met** | No evidence in the sources | - |
| **Unknown** | Spec too vague to score | Say what it would need to say |

Adjacency is not a match. AWS is evidence for AWS; against a spec asking for GCP
it is *partial*, and calling it met is how a candidate ends up in an interview
being asked about a thing they have not done. The same goes for years: a spec
wanting eight years of Go does not get satisfied by twelve years of engineering.

The no-inventing rule from `CLAUDE.md` governs here exactly as it governs the CV.
If the sources are silent, the answer is "not met" or "unknown" - never a
generous reading.

### 4. Estimate the funnel

Read [METHOD.md](METHOD.md) before writing a single number. It carries the base
rates, their sources, the adjustments that are allowed, and the three ways this
estimate usually goes wrong.

The method in one line: **start from the base rate, then adjust for this case** -
outside view before inside view, which is the whole of what separates a
calibrated forecast from a confident-sounding one.

Then do the arithmetic in the script, not in prose:

```bash
python3 .claude/skills/assess-fit/scripts/estimate.py \
  --route cold --p-first 0.12 --p-final 0.45 --p-offer 0.35 \
  --band-low 70000 --band-high 90000 --position 0.35 0.55
```

It compounds the stages, computes the expected value, and checks the result
against the published base rate for that route. Heed its warnings: an estimate
outside the base-rate band is not forbidden, but it has to be argued for on the
page, not waved through.

### 5. Value the offer

The spec's advertised band first, if it has one. Where it does not, or the band
is so wide it says nothing, search for current benchmarks for that title,
seniority and location - `METHOD.md` names the sources worth trusting and what
each one skews towards. Cite what you used and when it was published.

Then place the user in the band, and say why. Ask - via `AskUserQuestion` - only
when the answer would actually change the estimate: a target figure, a walk-away
number, or a competing offer. Their answer stays in the conversation and is
never written anywhere, in this repo or outside it.

### 6. Report

Lead with the four things that were asked for, then show the work:

1. **The four estimates** - first-stage interview, final interview, offer, offer
   value - as a table, with a range and one line of reasoning each.
2. **Hard filters**, and whether any fails. If one does, say so first and say it
   plainly; the rest of the numbers are conditional on it.
3. **Requirements met**, grouped, each with the role file behind it.
4. **Requirements not met**, with the partial ones separated from the absent
   ones, because they are answered very differently in an interview.
5. **What would move it** - which gaps are closeable and which are structural,
   and which single change to the application does the most. Usually it is the
   route in, not the CV.

State the gaps as facts. This is an assessment, not a confession: "no Kubernetes
in production since 2021" is useful, "unfortunately I fall short here" is not.

### 7. Hand off

Offer to chain into `/generate-cv` against the same spec, and name the register
you would pick and the two or three requirements a tailored CV should lead with.
Wait for a yes - the assessment is worth reading before a CV gets written from
it, and the reading is the point.

## Rules that are not negotiable

- **Every probability traces to a base rate plus named adjustments.** No number
  arrives by feel. If it cannot be shown as "base rate X, adjusted for Y and Z",
  it does not go in the report.
- **Never invent evidence.** No metric, date, title or technology the source
  files do not carry - the rule that governs the CV governs this too, and the
  cost is the same: it survives right up until an interviewer asks.
- **Never report a single match percentage.** Real applicant tracking systems
  rank relative to the pool, not against a threshold, and the same CV scores
  68 to 92 across engines. A percentage invites a decision it cannot support.
  Report coverage as counts within each class instead.
- **Nothing to disk.** No report file, no salary figure, no gitignored sidecar,
  inside this repo or outside it. The conversation is the deliverable.
- **Do not talk the user down.** Name what is missing and stop there. A gap is a
  fact about a spec, not a verdict on a career.
