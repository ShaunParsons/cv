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

`competencies.md` holds the supersets behind the `Key Competencies` and
`Technical Skills` grids, every item traced to a role file. The grids select
from it rather than being improvised per generation - a skill that is not in
it does not go on a CV.

`profile.md` holds what a CV says about me that isn't tied to any one role -
direction, tooling, and the wording of the summary. The summary is the
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
make dated   # dist/CV-Shaun-Parsons[-Company]-YYYY-MM-DD.pdf, for attaching -
             # the company comes from cv.md's tailored-for line when there is one
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

When a role's bullets run over the page break, the render repeats the role
heading at the top of the new page with `(Continued)`, so the page opens with
its subject named - on the page and in the extracted text alike.
`scripts/render_pdf.py` injects it at render time, because only the renderer
knows where the break falls: the heading never appears in `cv.md`, and
`/generate-cv` stays ignorant of pagination.

## Deciding whether to apply

`/assess-fit [job spec]` runs before either build step and feeds neither. It
holds one spec against `roles/*.md` and reports which requirements are met with
evidence, which are not, how far through the process the application is likely
to get, and what the offer would be worth. It reads the same sources as
`/generate-cv` via the same `scripts/fetch_spec.py`, so the two see an identical
spec.

**It writes nothing to disk, by design.** The assessment names requirements that
aren't met and carries salary figures, and both are barred from this repo - see
Conventions below. It lives in the conversation and ends there; there is no
report file and no gitignored sidecar, and neither should be added.

## Writing style

The facts in `roles/*.md` don't change between CVs. What changes is which of
them lead, and the register they're written in. Below are the registers. Pick
one from the job spec; when called bare, use **General**.

Five rules hold across all of them:

- **Two pages, always.** Not two and a bit. `make` renders A4 and
  `pdfinfo dist/cv.pdf` is the arbiter. Fitting is a writing problem, not a
  formatting one - never shrink the type, narrow the margins or thin the
  leading to buy space. Cut the weakest bullet, or say the same thing in one
  line instead of two.
- **Every bullet earns its line.** A bullet that could sit on any engineer's CV
  is taking space from one that couldn't.
- **Parallel facts get parallel grammar.** Where one sentence carries several
  achievements, they take the same shape - matched verbs in a series, not two
  joined by "and" with a third hung off "alongside". The construction rules
  under `## Voice` in `profile.md` are written for the summary but govern every
  line on the page.
- **Every bullet stands alone, and bullets run single-tier.** A bullet never
  leans on a neighbour for its subject - "took the service on" with the
  antecedent a bullet away reads as nothing to a reader skimming bullets out
  of order, which is how bullets are read. Where several bullets tell one
  arc, run it as consecutive top-level bullets in the order it happened: the
  first names the subject, and each later line carries a handle that names
  it again - "that service's migration", never a bare "its".

  Nesting used to carry the arc instead, and was dropped because the indent
  does not survive extraction. Extract the text from the PDF - which is what
  an applicant tracking system parses into fields, and what an AI screen
  reads - and the nesting is gone: the markers are drawn as shapes rather
  than set as glyphs, so a role comes back as a flat run of lines with no
  indentation and no bullet characters at all, and a sub-bullet arrives
  there as a top-level claim with its parent stripped away. Single-tier
  bullets make the page and the extraction the same document, so what reads
  cleanly on one reads cleanly on the other. The handle is where the care
  goes: "designed its migration onto serverless AWS" becomes "designed a
  core microservice's migration onto serverless AWS" - which is the rule
  below arriving from the other direction, since the handle that widens a
  claim when compressed is the same handle that empties it when flattened.
- **Compression never widens a claim.** Shortening a line must not grow what
  it claims. "Designed its serverless migration" after naming the platform
  and "designed a core microservice's migration onto serverless AWS" differ
  by a few words and a whole achievement - and the pronoun or possessive is
  where it slips, reaching back to a bigger object than the one the role file
  records. When cutting for space, re-check every claim against the source's
  scope. The summary is where this bites hardest, because it compresses the
  most. The same care guards *who* a claim is about: dropping the "each" from
  "each within about a year of that person joining" leaves the year reading
  as mine rather than theirs. The small words that pin a reference are
  usually the first cut for space, and the last that should be.

### General

The default, and the one to fall back to when a spec is vague. Balanced across
building and leading: enough hands-on detail to be credible as an engineer,
enough scope to be credible as a lead. Broad technology coverage rather than
depth in one stack. This is what `/generate-cv` produces bare.

It is aimed at a technical role somewhere between senior developer and technical
lead, because that band is where a vague spec most often lands. That is the
selection test, and it matters more here than in any other register: the role
files are a superset and each holds far more than fits, so a bullet does not
earn a slot by being true or by being an achievement. It earns one by being
evidence for *that* band, and by beating every other bullet competing for the
same line.

Applied in practice:

- **Prefer the bullet that carries a number, a named technology or a named
  consequence** over the one that carries a responsibility. "Owned incident
  management" is a job description; the 24x7 rota across ten developers and
  99.99% is evidence.
- **Where several bullets in a role file describe one arc, tell the arc as one
  bullet** and spend the space saved elsewhere. Four lines about the extraction
  service crowd out three other roles; one line saying picked up stale, extended,
  migrated says the same thing and leaves them room.
- **Cut what aims past the band.** Tenders, procurement, cross-business
  stakeholder work and commercial range are strong in the founder and project
  management registers and are ballast here.
- **Cut what any competent engineer would also have.** Conducting interviews,
  attending tech talks, using a testing framework - true, and true of everyone.

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
followed - the PHP-to-serverless migration design, and the CDK constructs
library with the six services and the whole 30-strong development team that took it
up. The uptake is the "what followed" and belongs in the bullet: a library
nobody adopted would read identically without it.
Keep enough implementation detail to stay credible hands-on, because the role is
both. Incident management, the on-call rota and the blameless reviews belong
high. Attribution matters most in this register: these are exactly the
achievements where leading and deciding are easy to blur, so `Contribution:`
governs the wording without exception. The Kubernetes rollout is the case in
point and belongs in a different sentence from the three above - the decision
predates the title and was somebody else's, the delivery is the claim, and a
register that leads on "chose" would put the wrong verb on the strongest
infrastructure work in the role.

State the consequence the business felt, not the one the system did. Nearly
every technical outcome in the role files has a business-side statement
available, and it is almost always the stronger of the two. The multi-region
deployment is not "deployed across two regions", it is what let the company
promise in-region data and sell into North America. The Kubernetes rollout's
autoscaling is higher utilisation of the fleet, lower infrastructure cost and
more frequent shipping. 99.99% is a tenth of the downtime the contract allowed,
which is the SLA stated as the customer reads it rather than as a monitoring
dashboard does. Where a bullet carries both, the technical detail is there to
make the business claim credible - it is the evidence, not the claim.

This never licenses a bigger number than the sources hold, and the arithmetic
is where that slips. A meeting cut from 90 minutes to 20 did not return 70
minutes to anyone, because it also began running more often; the honest claim
is the length, not a saving derived from it. Multiplying a per-occurrence
figure by a headcount or a frequency invents a total that no source confirms,
and a total is exactly what an interviewer will ask you to substantiate.

Headcount is evidence here, not detail. State the team size and the
direct-report split explicitly, in the summary as well as the role history - a
recruiter screening for a lead role looks for the numbers in both places and
does not go hunting for them. The management thread should also run to the
present rather than stopping at the last employer: where the most recent role
carries people evidence - the external contractors at Parsons Group - it earns
a line, because a lead-role screen reads a management gap in the current role
as a step back to IC. And when the title being screened for is explicitly a
lead one - "Engineering Lead", "Technical Lead" in the job title - tip further
than this register's default: the people and delivery bullets open each role
ahead of the technical arcs, and `Key Competencies` orders leadership first, so
the first row of the grid answers the title.

### Engineering manager

For roles titled Engineering Manager, or any spec that weights people
management above architecture. The technical lead register tips towards
technical decisions and their consequences; this one tips towards people
decisions and theirs. A manager screen reads the CV against a checklist -
promotions, hiring, performance management, breadth across teams or
workstreams - and treats everything else as background, so the people
evidence opens every role that carries any, with its numbers stated: the
team of six with its direct-report split, the one-to-ones held weekly to
fortnightly and owned outright with reviews run jointly with the CTO, the two
promotions routed through sprint planning, the hiring panel of six where a no
from any single member was decisive, and the incident review taken from 90
minutes to 20. The last two carry numbers on people decisions rather than on
systems, which is the currency this screen counts in and the scarcest thing in
the role files - reach for them before reaching for a technical metric.

Attribution carries more weight here than in any other register, including
technical lead. A manager screen reads "jointly" and "collectively"
literally, which is exactly why those words must be written: a shared
decision stated as shared is evidence, while the same decision stated
without its attribution is a question saved up for the interview.

Two selection tests sharpen further in this register. Prefer the bullet
showing a judgement made against the grain of its context over one showing
a practice applied - the case that a developer should ship on day one, the
estimation moved out of sprint planning, the business's interruptions taken
onto the lead rather than left on the team, the tooling deliberately handed
away - because a manager screen discounts inherited process and looks for
decisions that were nobody else's recipe. Prefer scope that crossed the
team boundary, stated as such - the 24x7 rota of ten spanning beyond the
team of six, the upskilling of a development team of 30, the constructs
library adopted by that whole team rather than only by mine - because
manager specs routinely ask for multiple teams or concurrent workstreams,
and cross-team scope buried inside a single-team bullet answers neither.

The business-impact rule in the technical lead register holds here and points
somewhere different. The consequence of people work is capability the business
kept: the engineer brought up to standard stayed on the team rather than being
replaced, two developers reached the next grade each within about a year of
joining, and the constructs library and the upskilling put practices in the
hands of 30 developers rather than six. State the outcome that outlasted the
intervention, because that is what this screen is testing - not that the work
was done, but that it held.

Technical depth compresses but does not disappear: as in the project
management register, it is evidence of credibility with engineers rather
than the substance. The management thread runs to the present, as in the
technical lead register, and the summary states the headcount and
direct-report split alongside the role history.

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

The business-impact rule in the technical lead register applies most directly
of all here, because in this register the business and the engineering are the
same job. A dashboard is not a dashboard, it is how the company's marketing
goes out and who can send it; four marketplace integrations are not four APIs,
they are one order and inventory flow instead of four admin consoles worked by
hand. Reach for what the company could do afterwards that it could not before.

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

**Only in this register**, close the summary with this line, verbatim: *"This
CV is generated with Claude Code from a publicly available GitHub repository,
<https://github.com/ShaunParsons/cv>."* It is a working sample, and in front of
this audience that is the strongest single line on the page. It is a
plain statement - name the tool, link the repo, stop. Do not call it a working
sample or otherwise explain its own significance: the reader who clicks
through reaches that conclusion themselves, and a line announcing it is the
sentence watching itself work. In every other
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
  competency lines are a flat list inside a `:::grid` fence; there is exactly
  one `:::summary`. `make` runs the validator first and refuses to render if it
  fails, because every one of those mistakes still produces a plausible-looking
  PDF - just the wrong one.
- **A grid item is a labelled line.** `**Label:** Item, Item, ...` - a bold
  group label, then its items comma-separated, running the full width of the
  page. The shape exists for the parse as much as the page: a columned list
  extracts spatially, with one column's item landing beside another's so the
  two run together into one string, while a full-width line comes back exactly
  as written when an applicant tracking system reads the PDF's text. The
  validator warns when a line has no label. The item names come from
  `competencies.md`, as written there; the group labels are presentation and
  may be regrouped per CV to answer the spec.
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
