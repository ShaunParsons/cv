---
type: profile
---

# Profile

Source of truth for the things a CV says about me that aren't tied to any one
role: what I'm looking for and the raw material for the summary paragraph. Same
rules as `roles/*.md` - a superset of what any single CV shows, nothing recorded
that isn't confirmed, and written for the same reader who receives the generated
CV.

The summary is the highest-leverage paragraph on the CV and the only part with no
role file behind it. This is that file.

## Position

- **Returning to full-time software roles.** `#direction`
  - Context: ran Parsons Group Limited full-time from April 2023, having started
    it alongside Talis Education in April 2022
  - What stayed true throughout: continued to design and ship production
    systems - the event-sourced dashboard and the event-sourcing library both
    date from this period
  - Why it matters: the period reads as a gap only if the technical work in it
    goes unmentioned. It is in
    `roles/2022-parsons-group-owner-director.md` and belongs in the summary

- **Credible in both directions.** `#direction`
  - Range: technical lead and engineering management at Talis Education,
    sole-developer product work at Opilio Technologies and Parsons Group
  - Why it matters: a spec weighted either way has real evidence behind it, so
    the register does the work rather than the summary hedging across both

## Tooling

The working environment rather than any one role's stack, which is why it lives
here and not in a `roles/*.md` technical surface. It spans every role in the
history, so attaching it to one would understate it.

- **Linux, on Ubuntu** `#platform`
  - What: the daily driver throughout, and what the Kubernetes, Docker, Bash and
    DevOps claims elsewhere rest on
  - On the CV: not a line worth spending a slot on. The platform work in
    `roles/*.md` is the evidence, and it says the same thing with a named
    consequence attached. Do not date it - a start year invites arithmetic and
    reads as tenure rather than skill

- **Git, and a terminal-first environment** `#platform`
  - What: Git for version control; Vim as the editor and tmux for session and
    pane management
  - On Git: it earns a slot on its own where a skills list is one item per line,
    which is how the technical skills grid reads
  - On Vim and tmux: editor preference, and not something to spend CV space on.
    Recorded here because it is true, not because it needs stating

## Voice

The opening of the summary, in my own words rather than a paraphrase:

> Innovative technical leader with a background in software development and a
> passion for helping others improve their own skill sets.

The second half of that is load-bearing and evidenced: two developers promoted
against an internal framework, one-to-ones and mentorship owned outright, and
the wider development team of 20-30 upskilled on Kubernetes and serverless
through the company's weekly tech talks - all in
`roles/2018-talis-education-technical-lead.md`.

Beyond that opening, the register is plain statement rather than flourish.
Prefer the ordinary word to the emphatic one - a first-day release made
*achievable*, not made *real* - and let the fact carry the weight. The
achievements are strong enough that dressing them draws attention to the
dressing, and a reader who has seen a hundred CVs reads the emphatic word as
padding.

## Contact

The email address is `cv@shaunparsons.co.uk` and is publishable; it is hardcoded
in the `Makefile`. Home address and phone number are **not recorded anywhere in
this repo** - they are environment variables read at render time. See `CLAUDE.md`.

## Tailoring notes

- **The summary carries no qualifications.** Degrees and certifications live
  under their own heading on the same page; see the tailoring notes in
  `qualifications.md`. The summary's job is the evidence nothing else on the CV
  states in one place.
- **No standing interests line.** The summary closes on whatever the spec makes
  strongest, not on a declared interest carried from CV to CV. What was built is
  in `roles/*.md` and speaks for itself; the "returning to full-time roles"
  framing only belongs where the summary has room, and never at the expense of
  it.
- **The data work is evidence, not a direction.** The self-service reporting
  suite and MySQL tuning at 300 million rows plus in
  `roles/2015-farmfoods-software-developer.md`, and the PL/pgSQL depth in
  `roles/2016-amigo-technology-software-developer.md`, are all still there to
  draw on where a spec asks for them - the 300 million row figure is the hardest
  number in the early history. They are simply not something to volunteer as a
  direction of travel.
- **Still to capture:** location and remote requirements, notice period, and
  whether the next role should be IC or leadership. All three shape the summary,
  so this file gets better as they firm up.
