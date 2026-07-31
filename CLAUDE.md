# CLAUDE.md

## What this repo is

The source of truth for my CV, structured so that CVs can be generated bespoke
for a given job spec rather than hand-edited each time.

`roles/*.md` is the source of truth - one file per past role, each a **superset**
of what any single CV would show. A tailoring step selects and reframes from
those to produce a CV aimed at a specific role, rendered to PDF for attaching to
applications.

Nothing here is published as a web page. The CV is written for one reader at a
time and the HTML is a build step, not an artefact - see below.

`qualifications.md` holds degrees, schooling and certifications.

`profile.md` holds what a CV says about me that isn't tied to any one role -
interests, direction, and the wording of the summary. The summary is the
highest-leverage paragraph on the page, so it gets a source file like everything
else rather than being improvised each time.

`cv.md` is written by `/generate-cv` and is then **yours to edit**. It is the
hand-off point between the two halves of the pipeline: generating it is a
judgement call, rendering it is not. Editing it is expected - but `roles/*.md`
stays the source of truth, so anything worth keeping goes back there, or the
next `/generate-cv` run overwrites it.

It is also **gitignored**. It is a working file for one application, not a
record: it gets rewritten every time the target changes, and a committed one
would compete with `roles/*.md` for the same job. So a fresh clone has no
`cv.md` at all until `/generate-cv` runs - nothing automated should assume one
is there.

## Build

Two steps, deliberately separate:

```
/generate-cv [job spec URL or PDF]   # roles/*.md -> cv.md   (judgement)
make                                 # cv.md      -> dist/   (deterministic)
```

Rendering is Pandoc with the WeasyPrint PDF engine, onto A4:

```
make setup   # create .venv, check the toolchain
make check   # validate cv.md without rendering
make pages   # render and fail unless the PDF is exactly two pages
make html    # dist/index.html
make pdf     # dist/cv.pdf
make dated   # dist/CV-Shaun-Parsons-YYYY-MM-DD.pdf, for attaching
make         # all of the above - the dated copy is the default, because it
             # is the file that actually gets attached to an application
make clean   # remove dist/
```

Requires `pandoc` on `PATH` (apt, brew, or a static binary from
<https://github.com/jgm/pandoc/releases> dropped in `~/.local/bin`) and the
`.venv` that `make setup` creates. `scripts/fetch_spec.py` needs
`poppler-utils` to read a PDF job spec.

`dist/index.html` is an intermediate, not a deliverable. The PDF is rendered
from it rather than from `cv.md` a second time, which is what keeps one
stylesheet honest across the whole toolchain. It is also useful to open in a
browser while iterating, since it reloads faster than the PDF - but the PDF is
the thing that gets sent.

## Writing style

The facts in `roles/*.md` don't change between CVs. What changes is which of
them lead, and the register they're written in. Below are the registers. Pick
one from the job spec; when called bare, use **General**.

Two rules hold across all of them:

- **Two pages, always.** Not two and a bit. `make` renders A4 and
  `pdfinfo dist/cv.pdf` is the arbiter. Fitting is a writing problem, not a
  formatting one - never shrink the type, narrow the margins or thin the
  leading to buy space. Cut the weakest bullet, or say the same thing in one
  line instead of two.
- **Every bullet earns its line.** A bullet that could sit on any engineer's CV
  is taking space from one that couldn't.

### General

The default, and the one to fall back to when a spec is vague. Balanced across
building and leading: enough hands-on detail to be credible as an engineer,
enough scope to be credible as a lead. Broad technology coverage rather than
depth in one stack. This is what `/generate-cv` produces bare.

### Senior developer

Weighted to building. Lead every role with what was built and what it was built
with - languages, services, data stores, named and concrete. Depth beats
breadth: the tenant-isolation layer over Sequelize and the PL/pgSQL work tested
with pgTAP say more here than a list of AWS services. Keep the leadership, but
frame it as an engineer does - mentoring, review, raising the bar - not as
headcount and process. Trim tenders, capacity planning and stakeholder work
hard; they read as a candidate aiming past the job.

### Technical lead

The general register with the balance tipped towards decisions and their
consequences. Lead with what was designed, chosen or introduced, and what
followed - the PHP-to-serverless migration design, the CDK constructs library,
the Kubernetes rollout. Keep enough implementation detail to stay credible
hands-on, because the role is both. Incident management, the on-call rota and
the blameless reviews belong high. Attribution matters most in this register:
these are exactly the achievements where leading and deciding are easy to blur,
so `Contribution:` governs the wording without exception.

### Head of engineering / founder / early startup

Weighted to ownership and to operating without scaffolding. Lead with what was
started rather than inherited, and be explicit about team size - sole developer,
one-person team, first engineer - because that *is* the qualification here. The
Opilio MVP and the Parsons Group dashboard are the strongest evidence and should
open their roles. Commercial and operational range earns space it would not
otherwise get: suppliers, contractors, prospective clients, tenders, running
events against a fixed date. So does judgement about what not to build. Say what
was traded away and why - a one-person team leaning on CI and coverage in place
of a second reviewer is the point, not an apology.

### Project management

Weighted to delivery, people and risk. Lead with coordination, planning and
scope rather than architecture: the team of six, the 24x7 rota across ten
developers, the promotions against an internal framework, the markets run
against a fixed date with sixty-plus third parties outside the reporting line.
Technical depth stays on the CV, but as evidence of credibility with engineers
rather than as the substance. `Key Competencies` carries more weight than
`Technical Skills` here; order them accordingly.

### AI-assisted development

For roles that explicitly ask for AI in the development process. Lead with the
tooling as it is actually used - Claude Code, agent-driven workflows, skills and
scripted pipelines - and with the engineering judgement around it: what is
automated, what is checked, and where a deterministic script replaces a
judgement call. This repo - its generate-then-render split, its skill, its
validator - is the usable evidence, and the only work here that was built that
way.

Nothing else on the CV is AI-assisted work, and none of it may be implied to
be. The event-sourcing library in particular predates all of this and is
ordinary engineering; it belongs on the CV on its own merits, in this register
as in every other, with no suggestion that AI had a hand in it.

**Only in this register**, close the summary with a line noting that the CV
itself is generated with Claude Code from a public repo, and link
<https://github.com/ShaunParsons/cv>. It is a working sample, and in front of
this audience that is the strongest single line on the page. In every other
register it is a distraction and must not appear - do not link the repo, and do
not mention how the CV was produced.

## Conventions

- **One stylesheet, one chain.** `style.css` styles the HTML, and the PDF is
  printed from that same HTML - which is the whole reason for the WeasyPrint
  engine over a LaTeX one. A styling change that looks right in the browser can
  still break pagination in print, so check the PDF, not just the page.
- **Never hand-edit anything in `dist/`.** It is build output and gets
  overwritten on every render. `cv.md` *is* fair game to edit - but a fact
  worth keeping belongs in `roles/*.md`, which is what the next generation
  reads.
- **`cv.md` has a structure the stylesheet keys off, and
  `scripts/validate_cv.py` enforces it.** A role heading is
  `### Company, Location - *Job Title*` followed by a date paragraph; the
  competency columns are a flat list inside a `:::grid` fence; there is exactly
  one `:::summary`. `make` runs the validator first and refuses to render if it
  fails, because every one of those mistakes still produces a plausible-looking
  PDF - just the wrong one.
- **The fonts are vendored, not fetched.** `assets/fonts/` holds PT Mono under
  the OFL. PT Mono ships no italic, so `scripts/make_oblique.py` shears the
  regular into a metric-compatible oblique - run it only when the upstream font
  is replaced, and commit the result. Nothing in the build reaches the network,
  so the same `cv.md` renders identically on any machine and in a year's time.
- **Never invent a detail on a CV.** No metric, date, or title that the user
  hasn't confirmed. An invented figure survives right up until an interviewer
  asks about it. **Omit what can't be verified** - no `unverified` placeholder,
  just leave the line out. An achievement without a number still reads as an
  achievement; one carrying a hedge reads as a draft.
- **`roles/*.md` is the source of truth, and reads like it.** Each file states
  what happened; it never annotates or corrects an existing CV. Nothing in this
  repo should refer to "the current CV" - an old PDF may be a useful prompt
  while capturing a role, but it has no standing here and will be gone in a
  year.
- **Write for the same audience as the CV.** The repo is public, so assume every
  role file is read by the recruiter or hiring manager who receives the
  generated CV. That is the test for anything written here: not "is it true",
  but "does it hold up in front of the person it's about to be sent to".

  In practice that rules out notes reading as coaching on what to conceal -
  "do not claim...", "never mention...", "this would be indefensible". Even
  where the underlying caution is correct, that reader sees a candidate
  managing what they can get away with. State the fact precisely instead and
  the wrong claim becomes impossible without any instruction: *"the decision was
  taken before I became technical lead; I led the implementation"* carries
  everything "do not claim the call" was there to enforce, and reads as candour.
  It also rules out talking the work down - "the shortest role", "the most
  junior title", "explains the gap" - which volunteers a weakness nobody asked
  about. Where something was never established, leave it out rather than
  writing a note about leaving it out.

  Tailoring metadata (`Emphasise for:`, `Leads for:`, `Contribution:`) survives
  this test comfortably. Being visibly careful about attribution and about
  which figures exist is an asset in front of that reader, not a liability.
- **This repo is public, and everything in it is publishable.** No compensation
  figures, no reasons for leaving a role, no named criticism of former
  employers, no personal contact details (home address, phone number).
  Recruiters get contact details by reply, not by scrape. There is no private
  file mechanism here and none should be added - treat every file as though it
  is already on the internet.
- **Contact details.** The email address is hardcoded in the `Makefile`
  (`cv@shaunparsons.co.uk`) because it is publishable. Home address and phone
  number are **environment variables** read at render time - `CV_ADDRESS` and
  `CV_PHONE` - and are never committed in any form. A build with them unset
  must still succeed and simply omit those lines. Keep that property: it is what
  makes a render safe to do anywhere, on any checkout, without first checking
  what is about to end up in the output.

  Locally they come from `.env`, which `make` includes and `.gitignore`
  excludes. `.env.example` documents the shape and is committed - so it holds
  **placeholders only**. Putting the real address in the example file would
  publish the very thing the mechanism exists to keep out of the repo.
