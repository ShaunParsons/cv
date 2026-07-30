# Question bank

Five waves. Work through them in order, but **ask one question at a time** —
these are lists of what to cover, not messages to send. Posting five bullets at
once reliably gets two of them answered and leaves you chasing the rest, which
is slower than just asking again.

Wave 1 is the exception: it's short factual stuff and can go in one message.

Skip questions already answered in passing — re-asking something the user just
told you reads as not listening.

**When the user skips, let it go.** One "skip" or "don't know" ends that
question; two in a row ends that line of enquiry — change the subject rather
than rephrasing the same ask. If they skip most of a wave, offer to stop
entirely and come back to it later. A half-finished role file is recoverable;
an interview someone resents finishing never gets repeated for the next role.

Everything here is designed to produce publishable material. Compensation and
reasons for leaving are deliberately absent — don't ask, and don't record them
if they come up anyway.

## What you are actually digging for

Professional and technical substance. Before asking anything, check it could
plausibly end up as a bullet on a CV:

- **Systems built** — what it did, the architecture, the technologies named.
- **Migrations and rebuilds** — from what, to what, and what it bought them.
- **Reliability and scale** — uptime, throughput, incident volume, cost.
- **Automation** — repetitive work removed, and who it made faster.
- **Process introduced** — incident review, onboarding, interview structure,
  objective-setting.
- **People** — who they mentored, promoted, hired, or unblocked.
- **Stakeholder work** — tenders, audits, data requests, exec reporting.

**Off topic, even when the person is a business owner:** customers, pricing,
revenue lines, market positioning, how their week splits, why they started it.
That's the commercial shape of a business, not evidence of professional work,
and it will not appear in the output. A founder's CV entry is carried by what
they *built*, exactly as an employee's is.

---

## Wave 1 — The facts

Fast, closed, low effort. Get it out of the way.

- Company name, and how it should appear on a CV (legal name vs trading name).
- Job title as it appeared on the contract — and the title that *describes* what
  they did, if different. Record both; tailoring may use either.
- Start and end (`YYYY-MM`). `present` for a current role.
- Employment type: permanent / fixed-term / contract / freelance / founder.
- Location, and onsite / hybrid / remote.
- **Did this overlap another role?** Ask whenever the dates could touch another
  role's, and whenever the role is founder, contract, or freelance. Capture
  which role, and how the commitment changed over time — "incorporated while
  still employed four days a week, full-time from the following April" is a
  credible story, whereas two roles with unexplained overlapping dates reads as
  padding. Record it in `concurrent_with` and `intensity`.

Every company is nameable — don't ask about NDAs or anonymising employers.

## Wave 2 — Mandate and context

Establishes the *difficulty* of what follows. An achievement means nothing
without the state of things beforehand.

- What was the company? Sector, rough headcount, stage (startup / scale-up /
  established / public sector).
- Why did they hire you? What was broken, missing, or growing too fast?
- What state was it in on day one? Be specific — "no CI at all", "one engineer
  holding the whole platform", "three teams shipping to the same monolith".
- Where did you sit? Who did you report to, who reported to you, how big was the
  team and the wider engineering org.
- What were you actually accountable for, as opposed to what the title implied?

### If they founded or own the business

**Keep this to two questions.** A CV entry needs one line of business context —
"family run business specialising in leather goods" — and then it is carried
entirely by what they built. Do not interview them about the business.

- What does the business do? One sentence, and stop there.
- Did it overlap other employment, and did the commitment change? (See wave 1.)

Then go straight to wave 3. The temptation is to keep asking about the business
because it is interesting; resist it. Every minute spent on customers and
revenue lines is a minute not spent on the production system they built, which
is the only part that reaches the CV.

### If it was a contract or freelance engagement

- Who was the client, and what were they brought in to fix or deliver?
- Was it one engagement or several? Rolling renewals are worth stating.
- What did they own outright versus advise on?

## Wave 3 — Achievements

**This is the point of the exercise.** Everything else is scaffolding. Expect to
spend most of the interview here. Aim for four to eight achievements.

Open with: *"What are you proudest of from this role?"* — but **expect a values
answer**, not an achievement. People overwhelmingly answer this with character:
relationships, integrity, looking after customers. That's worth having, and it's
worth nothing on a CV unless anchored to something observable, so follow up:

- How does that actually show up? Repeat custom, reorders, better supplier
  terms, referrals, reviews, retention, someone they mentored getting promoted.
- Give me one specific instance. A concrete story outlasts the general
  principle — it's what an interviewer remembers and asks about.

If the anchor doesn't come, record the theme with `metric: unverified` and move
on. Then **switch to targeted prompts** — the open question has done its job and
asking it again just gets more of the same. Name a specific thing they've
already mentioned and ask about that: a product line, a system, a team, a
customer, a piece of the business they built from nothing.

For each achievement, drive to a number. Ask in this order and stop when you get
one:

1. "How much did that change things — what was it before, and after?"
2. "How many users / requests / engineers / pounds did that touch?"
3. "How long did it take, and how long would it have taken the old way?"
4. "If you had to defend that as an achievement in an interview, what's the
   evidence you'd reach for?"

If all four come back empty, record `metric: unverified` and move on. **Do not
estimate one on the user's behalf, and do not accept a figure they are visibly
guessing at** — ask "is that a real number or a feel?" and mark it accordingly.

Then, for each achievement, also capture:

- **Contribution** — what *you* did versus what the team did. Push on this
  gently but always. "Led" and "delivered" mean very different things.
- **Difficulty** — what made it hard? Politics, legacy, scale, deadline, or a
  hostile stakeholder are all legitimate and all interesting.
- **Tags** — a small stable vocabulary: `#devops` `#leadership` `#architecture`
  `#cost` `#delivery` `#mentoring` `#security` `#data` `#frontend` `#hiring`.
- **Emphasise for** — which target roles this supports. The same achievement is
  often a leadership story *or* a technical one depending on the framing.

Prompts for things people habitually forget to mention:

- Anything you built that's still running now.
- Anyone you hired, mentored, or promoted.
- Money saved, not just money made.
- Something you killed, deprecated, or talked the business out of.
- Incidents you handled, and what changed afterwards.
- Work that made *other* teams faster.

## Wave 4 — Technical and operational surface

Keyword coverage for automated screening, and raw material for the skills
section. Breadth here, depth was wave 3.

- Languages, frameworks, datastores, cloud, infra, CI, observability.
- Scale, in whatever unit is meaningful: traffic, data volume, transaction
  value, team count, estate size.
- Ways of working: agile flavour, on-call, code review culture, release cadence.
- Anything you were the acknowledged go-to person for.
- Distinguish "used daily for three years" from "touched once" — record the
  first as `primary`, the second as `exposure`. Never let a one-week spike
  become a CV skill.

## Wave 5 — Tailoring metadata

Explicitly for the later tailoring step.

- If you were applying for a *hands-on engineering* role, what from here leads?
- If you were applying for a *leadership* role, what leads instead?
- What here would you rather downplay or leave off entirely?
- What's the one-line summary of this role if the CV only had room for one line?
- Domain vocabulary a recruiter in this sector would search for.

---

## Out of scope

Do not ask about, and do not write down:

- Salary, day rate, equity, or any other compensation figure
- Why the user left the role
- Named criticism of former employers, managers, or colleagues
- Referees and their contact details

These come up naturally in a conversation about past work. When they do, just
carry on — acknowledge it in the chat if it's relevant to understanding an
achievement, but nothing goes to disk. The role file is finished without them.
