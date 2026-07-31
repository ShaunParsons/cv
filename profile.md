---
type: profile
---

# Profile

Source of truth for the things a CV says about me that aren't tied to any one
role: what I'm looking for, what I'm interested in, and the raw material for the
summary paragraph. Same rules as `roles/*.md` - a superset of what any single CV
shows, nothing recorded that isn't confirmed, and written for the same reader who
receives the generated CV.

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

## Interests

Stated on every CV, closing the summary. The wording flexes to the register; the
subject does not.

- **Event-driven systems** `#architecture`
  - Evidence: the Event Sourced (CQRS) dashboard and the reusable
    event-sourcing library, both in
    `roles/2022-parsons-group-owner-director.md`; event-driven cross-service
    messaging via command and notification topics; SNS, SQS, EventBridge and
    DynamoDB Streams in anger
  - Strength: recent, hands-on and well evidenced - the interest and the work
    are the same thing here, which is why it is worth stating outright

## Voice

The opening of the summary, in my own words rather than a paraphrase:

> Innovative technical leader with a background in software development and a
> passion for helping others improve their own skill sets.

The second half of that is load-bearing and evidenced: two developers promoted
against an internal framework, one-to-ones and mentorship owned outright, and
the wider development team of 20-30 upskilled on Kubernetes and serverless
through the company's weekly tech talks - all in
`roles/2018-talis-education-technical-lead.md`.

## Contact

The email address is `cv@shaunparsons.co.uk` and is publishable; it is hardcoded
in the `Makefile`. Home address and phone number are **not recorded anywhere in
this repo** - they are environment variables read at render time. See `CLAUDE.md`.

## Tailoring notes

- **Interests before direction.** The interests line earns its place on every
  CV; the "returning to full-time roles" framing only belongs where the summary
  has room, and never at the expense of what was built.
- **The data work is evidence, not an interest.** The self-service reporting
  suite and MySQL tuning at 300 million rows plus in
  `roles/2015-farmfoods-software-developer.md`, and the PL/pgSQL depth in
  `roles/2016-amigo-technology-software-developer.md`, are all still there to
  draw on where a spec asks for them - the 300 million row figure is the hardest
  number in the early history. They are simply not something to volunteer as a
  direction of travel.
- **Still to capture:** location and remote requirements, notice period, and
  whether the next role should be IC or leadership. All three shape the summary,
  so this file gets better as they firm up.
