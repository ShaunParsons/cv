---
type: profile
---

# Profile

Source of truth for the things a CV says about me that aren't tied to any one role: what I'm looking for and the raw material for the summary paragraph. Same rules as `roles/*.md` - a superset of what any single CV shows, nothing recorded that isn't confirmed, and written for the same reader who receives the generated CV.

The summary is the highest-leverage paragraph on the CV and the only part with no role file behind it. This is that file.

## Position

- **Returning to full-time software roles.** `#direction`
  - Wording: where the summary carries this, it stands as its own sentence rather than a clause on the end of the sentence before it. Looking at, and the singular
  - The role named follows the register. Hands-on and senior developer roles: "I am looking at returning to a full-time software role." Technical lead and management roles: "I am looking at returning to a full-time technical leadership role."
  - Context: ran Parsons Group Limited full-time from April 2023, having started it alongside Talis Education in April 2022
  - What stayed true throughout: continued to design and ship production systems - the event-sourced dashboard was developed from 2025 onwards, well inside this period. The event-sourcing library it is built on was first written in late 2019 as part of a personal project and predates it, so it evidences the authorship rather than the recency
  - Why it matters: the period reads as a gap only if the technical work in it goes unmentioned. It is in `roles/2022-parsons-group-director-sole-developer.md` and belongs in the summary

- **Credible in both directions.** `#direction`
  - Range: technical lead and engineering management at Talis Education, sole-developer product work at Opilio Technologies and Parsons Group
  - Why it matters: a spec weighted either way has real evidence behind it, so the register does the work rather than the summary hedging across both

- **Located in the Midlands, and open to London on a hybrid basis or to fully remote work.** `#direction`
  - In scope on site: Leicester, Nottingham, Birmingham and Derby
  - Stoke-on-Trent: in scope on a light hybrid only - one or two days a week, not three
  - London: workable hybrid, commuting in for a set number of days a week - three is fine
  - Fully remote: in scope. Talis Education was office-based in Birmingham initially and remote from the pandemic onwards, so four years of it is evidenced rather than aspirational
  - Why it matters: an on-site requirement is a hard filter, and a failed hard filter ends an application whatever else is true. Knowing the answer up front decides which specs are worth assessing at all
  - On a CV: not a line worth a slot. The heading already carries the city

## Tooling

The working environment rather than any one role's stack, which is why it lives here and not in a `roles/*.md` technical surface. It spans every role in the history, so attaching it to one would understate it.

- **Linux, on Ubuntu** `#platform`
  - What: the daily driver throughout, and what the Kubernetes, Docker, Bash and DevOps claims elsewhere rest on
  - On a CV: listed in `competencies.md` as a working skill, so it can take a grid slot where a spec names Linux. Elsewhere the platform work in `roles/*.md` carries it with a named consequence attached. Do not date it - a start year invites arithmetic and reads as tenure rather than skill

- **Git, and a terminal-first environment** `#platform`
  - What: Git for version control; Vim as the editor and tmux for session and pane management
  - On Git: it earns a slot on its own where a skills list is one item per line, which is how the technical skills grid reads
  - On Vim and tmux: editor preference, and not something to spend CV space on. Recorded here because it is true, not because it needs stating

## Voice

The summary opens with a one-line band-setter, assembled fresh for each application rather than pinned verbatim: the role's band label, then the two strongest domain matches from the spec.

- **The band label mirrors the spec's vocabulary, within what the record supports.** "Technical lead" and "engineering lead" rest on the Talis title, "head of engineering" on Opilio, "software engineer" and "backend engineer" on everything. Where the spec's label is not one the record evidences at that scope, the opener takes the nearest supported label instead.
- **The domains are the spec's two strongest matches, in the spec's own words.** Screening - human or AI-assisted - reads the application against the spec's criteria, so "multi-tenant SaaS platforms" earns its opener slot when the spec says it, and a synonym of it does not.
- **The years are real.** "More than ten years" is evidenced - professional software development runs from Farmfoods in 2015 - and is the form to use; a sharper count invites arithmetic.
- **No self-award adjectives, and no "passion".** "Innovative" is the reader's word to award, not mine. The opener is a claim of fact, and every noun in it has to survive an interviewer's "tell me about that".

Called bare, or where a spec is too vague to mirror, the fallbacks are: "Technical lead with more than ten years across backend engineering and SaaS platforms." for the leadership registers, and "Backend engineer with more than ten years building SaaS platforms on Node.js, TypeScript and AWS." for the hands-on ones.

Beyond that opening, the register is plain statement rather than flourish. Prefer the ordinary word to the emphatic one - a first-day release made *achievable*, not made *real* - and let the fact carry the weight. The achievements are strong enough that dressing them draws attention to the dressing, and a reader who has seen a hundred CVs reads the emphatic word as padding.

Shape matters as much as word choice, and the summary is where it goes wrong first, because it is the one paragraph asked to carry three achievements at once:

- **Give parallel facts parallel grammar.** Three things done are three matched verbs - *led* the rollout, *wrote* the Terraform, *owned* incident management. Joining two with "and" and hanging the third off "alongside" or "as well as" makes the third read as an afterthought whatever its actual weight, and the third is usually the one that matters.
- **Don't bolt a clause onto a finished sentence.** "...alongside the Terraform and AWS CDK the platform's infrastructure was defined in" arrives after the sentence has already closed, and strands its preposition getting there. A fact that needs saying gets its own slot in the series or its own sentence.
- **An aside holds one thing, said whole.** "- one of the core technologies behind the company's e-book reader, left stale -" tacks a verb-less fragment onto the end of the aside, and "left stale" dangles with nothing to hang on. Where a state matters, put it on the noun - "a stale microservice" - and let the aside carry the single fact it was opened for.
- **Don't run a series inside a dash parenthetical and then carry on.** "Led a team of six - designing X, introducing Y, and owning Z - and now ships..." asks the reader to hold the sentence open across three claims and then keep going. The parenthetical was a sentence; let it be one. A dash pair holds an aside of a few words, not the evidence.
- **Don't reach for the aphorism.** "...were procurement questions before they were engineering ones" has the shape of an insight rather than the substance of one. This is the emphatic-word rule again, and it bites harder: a clever construction is more conspicuous than a clever adjective, so the reader ends up watching the sentence work instead of reading the fact.
- **A result gets a verb, not a preposition.** "...owned incident management across a 24x7 on-call rota to 99.99% uptime" hangs the outcome off "to" as though it were a destination, and the reader has to reconstruct the causal link. "...achieving a 99.99% uptime" costs one word and gives the result its own verb, which is what makes it read as an outcome rather than a compression artefact.
- **One claim per clause, and stop when the claim is made.** Where a sentence is carrying three subordinate ideas it is two sentences, or it is one sentence and a bullet that should have kept the rest.

## Contact

The email address is `cv@shaunparsons.co.uk` and is publishable; it is hardcoded in the `Makefile`. Home address and phone number are **not recorded anywhere in this repo** - they are environment variables read at render time. See `CLAUDE.md`.

## Tailoring notes

- **The summary carries no qualifications.** Degrees and certifications live under their own heading on the same page; see the tailoring notes in `qualifications.md`. The summary's job is the evidence nothing else on the CV states in one place.
- **No standing interests line.** The summary closes on whatever the spec makes strongest, not on a declared interest carried from CV to CV. What was built is in `roles/*.md` and speaks for itself; the "returning to full-time roles" framing only belongs where the summary has room, and never at the expense of it.
- **The data work is evidence, not a direction.** The self-service reporting suite and MySQL tuning at 300 million rows plus in `roles/2015-farmfoods-software-developer.md`, and the PL/pgSQL depth in `roles/2016-amigo-technology-software-developer.md`, are all still there to draw on where a spec asks for them - the 300 million row figure is the hardest number in the early history. They are simply not something to volunteer as a direction of travel.
- **Still to capture:** notice period, and whether the next role should be IC or leadership. Both shape the summary, so this file gets better as they firm up.
