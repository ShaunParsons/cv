---
type: qualifications
---

# Qualifications

Source of truth for education, certifications and anything else that appears under a qualifications heading. Same rules as `roles/*.md`: a superset of what any single CV shows, nothing recorded that isn't confirmed, and written for the same reader who receives the generated CV.

## Certifications

Every one of these was studied for and sat in my own time, outside working hours - the 2023 pair during the Talis Education role, and the 2026 Associate since. Worth knowing when a spec asks about self-directed learning or continuing professional development, though it is a fact for a covering note or an interview rather than a line in this section.

- **AWS Certified Solutions Architect - Associate (SAA-C03)** `#devops` `#architecture`
  - Earned: August 2026
  - Status: current (valid to August 2029)
  - Emphasise for: cloud, platform, infrastructure and architecture roles - this is the current AWS certification, so it leads where a spec asks for one

- **AWS Certified Solutions Architect - Professional** `#devops` `#architecture`
  - Earned: 2023, during the Talis Education role
  - Status: expired. Revising to retake it as at August 2026
  - Note: the professional tier, not the associate one - worth naming in full, since the two are searched for differently
  - On a CV: the expired certification does not list on its own. Where a spec asks for the Professional specifically, "currently working towards" is the honest line and is worth using - written so it cannot be read as held
  - Emphasise for: cloud, platform, infrastructure and architecture roles

- **AWS Certified Security - Specialty** `#security` `#devops`
  - Earned: 2023, during the Talis Education role
  - Status: expired, and not being renewed
  - Emphasise for: platform and infrastructure roles, and anything with a compliance or security-review element. It stays on record as evidence the material was assessed at specialty level, and the security and data protection work in the role files stands whether the certification is current or not

## Higher education

- **MEng, Computer Science and Software Engineering - 2:1**
  - Institution: University of Birmingham
  - Studied: 2007 to 2011
  - Notable modules: Programming Massively Parallel Architectures (79%), Intelligent Robotics (79%), Software Design Study (75%), Software Systems Components 2 (74%)
  - Emphasise for: anything asking for a degree in a numerate or computing discipline. The integrated master's is worth stating as MEng rather than flattening to "degree in computer science"

Doctoral research at the University of Birmingham, 2011 to 2015, is recorded in `roles/2011-university-of-birmingham-doctoral-researcher.md`. It was not completed, so it is research experience rather than a qualification and does not belong under this heading.

## Schooling

Lutterworth Grammar School and Community College, 2003 to 2007.

- **A Levels (2007):** Computing (A), ICT (C), Mathematics (C)
- **GCSEs (2005):** Mathematics (A), Physics (B), English Literature and English Language (C)

## Tailoring notes

- **The line after a qualification heading is styled as a date line, so it holds a short date and nothing else.** The stylesheet gives the paragraph following any `###` heading the same treatment as the date line under a role heading - its own line directly beneath, set left, in the body colour. Anything written there is read as that qualification's date, so the Associate certification's line is `Aug 2026`, exactly that; the validity window stays in this file. Anything more than a date goes in a bullet below the heading, as the degree's does.
- **Nothing here is repeated in the summary.** The certifications and the MEng have their own section, and the reader reaches it on the same page. Restating them at the top spends the highest-leverage lines on the CV saying something the page says again a few inches later - and those lines are worth more carrying evidence a qualifications heading cannot: what was built, owned or run. This holds even for a spec that names a certification; the requirement is met by the section, not by the summary.
- **A generated CV carries the current certification only.** The Associate is the one that lists; the expired 2023 pair (Professional and Security) stay in this register as the record of what was assessed and when, and the work behind them is in `roles/2018-talis-education-technical-lead.md`. Where a spec asks for a current AWS certification, the Associate meets it outright. The one exception is a spec naming the Professional specifically: there, and only there, the Professional may appear as being worked towards, because the revision is real and the alternative is a requirement that reads as unmet. Check this file before writing that line - it is true as at August 2026 and stops being true the moment the exam is passed or abandoned.
- **The module marks and the schooling are here for completeness, not for every CV.** With fifteen years of work behind them they earn their place only where a spec asks for grades, or for a graduate-scheme-style application. Intelligent Robotics is the exception worth keeping in view: it connects directly to the doctoral research.
