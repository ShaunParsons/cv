# Role file template

One file per role, and all of it publishable. Fill only what the interview actually established - delete any field the user didn't answer rather than leaving it blank or guessing.

---

## `roles/<start-year>-<company>-<title>.md`

```markdown
---
company: Acme Financial
company_display: Acme            # optional, if the CV should say something shorter
title: Platform Lead             # final title in the role
title_effective: Head of Platform # optional, if it differed in practice
title_history:                   # optional - only if promoted during the role.
  - title: Senior Engineer       # Always ask: an internal promotion is strong
    period: 2021-03 → 2022-06    # evidence and a single title on a long tenure
  - title: Platform Lead         # hides it completely.
    period: 2022-06 → 2024-08
start: 2021-03
end: 2024-08                     # or: present
employment: permanent            # permanent | fixed-term | contract | freelance | founder
concurrent_with: Globex          # optional - another role whose dates this overlaps
commitment:                      # optional - only if contracted hours changed
  - period: 2021-03 → 2022-04
    note: alongside a 4-day week at Globex
  - period: 2022-04 → present
    note: full-time
location: Manchester, UK
working: hybrid                  # onsite | hybrid | remote - add a trailing
                                 # comment if it changed during the role, e.g.
                                 # office-based until the pandemic, remote after
sector: fintech
company_size: 400
team_size: 8
reports_to: CTO
direct_reports: 5
one_liner: Rebuilt the deployment platform and grew the team from 3 to 8.
---

## Mandate

Why they were hired and what state things were in on arrival. Two or three sentences - this is what makes the achievements below legible.

## Achievements

- **Cut deploy time from 45 minutes to 4** `#devops` `#delivery`
  - Situation: a monolith four teams shipped to daily, taking 45 minutes to deploy, with no release freeze available to do the work behind
  - Task: get the pipeline fast enough that a slow deploy stopped shaping when people shipped
  - Action: rebuilt the pipeline around parallel test shards and a migrated runner fleet, cut over service by service while the monolith kept shipping
  - Result: 45min → 4min, verified from CI dashboards
  - Contribution: designed the pipeline myself; two engineers implemented the runner migration under my direction
  - Emphasise for: platform, SRE, DevOps, engineering management

- **Grew the platform team from 3 to 8** `#hiring` `#leadership`
  - Situation: a team of three carrying an estate four product teams depended on
  - Action: ran every interview loop against a bar I set and held, with sourcing handled by a recruiter
  - Result: 5 hires over 14 months, 0 regretted attrition
  - Contribution: owned the hiring bar and every loop; sourcing was recruiter-led
  - Emphasise for: engineering management, staff+ IC with hiring involvement

## Technical surface

- **Primary:** Go, Kubernetes, Terraform, AWS, GitHub Actions
- **Exposure:** Kafka, Snowflake
- **Ways of working:** trunk-based, weekly release train, shared on-call rota

## Tailoring notes

- **Leads for hands-on roles:** the deploy pipeline rebuild
- **Leads for leadership roles:** team growth and the on-call culture change
- **Downplay:** the six months on internal admin tooling - dull and off-message
- **Domain keywords:** PCI-DSS, payment rails, FCA, ISO 8583
```

---

## Notes on filling this in

- **Every achievement is written on the STAR backbone** - `Situation:`, `Task:`, `Action:`, `Result:`, in that order - with `Contribution:`, `Note:`, `On a CV:` and `Emphasise for:` after it. A CV bullet carries all four beats wherever it can - verb first, the situation in a clause, the result closing the line - so none of them is interview-only material held back from the page. Capture all four and the bullet has something to compress; capture the `Action:` alone and it reads as a job description, because that is what a responsibility looks like written down.
- **Fold the detail into the key it belongs to** rather than coining a new one. Formats, hosting, cadence, scale and stack all belong inside `Situation:` or `Action:` as prose. A file-specific key is a key nothing can check for.
- **Omit a key rather than filling it in.** `Task:` goes when the brief only restates the headline. `Result:` goes when no outcome was ever established - and that gap is the honest record, not a hole to plug. Never invent a number, write `unverified`, or let the user talk themselves into one. Record already-asked-and-unavailable figures once per file, at the end, so a later session doesn't ask again.
- Every achievement bullet must stand alone. Tailoring will drop its neighbours, so it can't depend on context from the bullet above it.
- Keep achievement headlines in the past tense and lead with the outcome, not the activity: "Cut deploy time to 4 minutes", not "Worked on CI improvements".
- Tags are a closed vocabulary shared across all role files. Check what's already in use in `roles/*.md` before coining a new one.
