---
company: Talis Education
title: Technical Lead                # final title
start: 2018-09
end: 2023-04
employment: permanent
reports_to: CTO                      # previously the platform team's technical lead
title_history:                       # promotion date recalled as approximate,
  - title: Senior Developer          # not verified - render as "2020" rather
    period: 2018-09 → 2020-03        # than asserting a precise month
  - title: Technical Lead
    period: 2020-03 → 2023-04
location: Birmingham, UK
working: remote                  # office-based in Birmingham initially, remote from the pandemic onwards
team_size: 6                     # including me
direct_reports: 5
engineering_size: 20-30          # wider development team
concurrent_with: Parsons Group Limited
commitment:
  - period: 2018-09 → 2022-04
    note: full-time
  - period: 2022-04 → 2023-04
    note: four days a week, alongside running Parsons Group Limited
---

## Mandate

Brought in to take an existing microservice back into active development after a
period without any. Written in PHP on the Fat-Free Framework (F3) - a niche
choice - and left to go stale. That service went on to form a key part of the
company's existing products and its upcoming product ideas.

## Achievements

The first four all concern the same service - the document extraction
microservice behind the e-book reader product - and run in order. Picked up
stale, grown, debugged, then migrated off the framework it was written on. Taken
together they span the Senior Developer years and the Technical Lead ones, which
is the clearest evidence in the history of what the promotion was for.

- **Took a stale microservice back into active development, and grew a team
  around it** `#delivery` `#architecture`
  - Context: already deployed and one of the core technologies behind an e-book
    reader product, but left without active development
  - Stack as found: PHP on the Fat-Free Framework (F3), Resque workers on EC2
    instances, MongoDB
  - What: brought the project back into active development, extended the
    existing feature set and fixed outstanding bugs
  - Scale: sole developer on it at the outset, supported by another senior
    developer whose own focus was a different microservice. By the time I left,
    four developers had worked on it
  - Contribution: the originating engineer on the service, from the first day
  - Era: began September 2018, as Senior Developer
  - Emphasise for: backend, roles naming legacy or inherited systems, evidence
    of ownership from an IC seat

- **Built text extraction with coordinate data, so another team could ship
  highlighting** `#architecture` `#data`
  - What: extracted text from documents along with the coordinate data
    describing where on the page it sat, which is what let a front-end service
    built by a different team render text highlighting
  - Pipeline: documents normalised to PDF before extraction, so one extractor
    served every input format rather than one per format
  - Conversion: docx and EPUB to PDF handled by an external API provider, not
    built in house
  - Cross-team: specced the API with the front-end team who consumed it
  - Contribution: built the extraction; the conversion was a third-party service
  - Emphasise for: backend, API and interface design, cross-team delivery,
    document processing

- **Found and fixed a concurrency bug that was silently losing data**
  `#data` `#architecture`
  - Symptom: updates being overwritten or deleted by other workers running
    concurrently
  - Cause: a worker read the entire state of a MongoDB record, modified it, and
    wrote the whole thing back - so two workers touching the same record
    clobbered each other
  - Fix: atomic field-level updates in place of read-modify-write, so a worker
    sets only what it owns
  - Contribution: the debugging and the fix were mine
  - Emphasise for: backend, distributed systems, data integrity, roles naming
    debugging or production support

- **Migrated that service off an unsupported PHP framework to a serverless
  workflow** `#architecture` `#devops` `#cost`
  - From: PHP on F3, with Resque workers on EC2 instances
  - To: a serverless workflow on AWS
  - Drivers: higher throughput, lower operating cost, dynamic scaling, and
    getting off a framework that was no longer actively supported
  - Outcome: improved throughput of the service while reducing operating costs
  - Scale: multiple developers onboarded onto the work over time
  - Note: the actual cost savings are not available
  - Contribution: designed the migration personally; multiple developers
    implemented it under that design
  - Emphasise for: backend, platform, architecture, modernisation

- **Ran the team's agile ceremonies for a year before holding the title**
  `#leadership` `#delivery`
  - Period: roughly March 2019 to March 2020, while still a Senior Developer
  - What: led the daily stand-ups, and the weekly and bi-weekly sprint planning
    and sprint review meetings
  - Supervision: initially run under my manager, the CTO
  - Team: included developers considerably more experienced than I was at the
    time, whose guidance I drew on where it helped
  - Contribution: mine to run day to day; the oversight was the CTO's
  - Why it matters: this is the year immediately preceding the promotion to
    Technical Lead, and it was leadership taken on from an IC seat rather than
    conferred with a title
  - Emphasise for: team lead, engineering management, and any spec asking for
    evidence of operating above the current level

- **Wrote and reviewed architectural decision records** `#architecture`
  - Context: ADRs were introduced by a member of the front-end team, not by me
  - What: wrote numerous ADRs across the extraction service and other projects,
    and reviewed ADRs written by others
  - Use: the extraction API was specced with the front-end team this way
  - Contribution: authoring and review; the practice was someone else's to
    introduce
  - Emphasise for: architecture, staff+ IC, roles naming design documentation or
    RFC culture

- **Achieved 99.99% uptime across the estate** `#devops`
  - Metric: 99.99% over the final 12 month period
  - Contribution: a team and platform achievement
  - Emphasise for: SRE, platform, engineering management

- **Owned incident management across a 10-developer on-call rota** `#leadership`
  `#devops`
  - Scale: 24x7 support for all services, with 10 developers on a rota I was
    ultimately responsible for
  - Process: ran regular review meetings on past incidents and their
    resolutions, identifying weaknesses in processes and infrastructure so they
    could be addressed - explicitly focused on preventing recurrence rather than
    apportioning blame
  - Stakeholders: worked with product owners and customer support to ensure
    issues were communicated across the business in a timely manner
  - Metric: 99.99% uptime over the final 12 months
  - Contribution: directly led - this was mine to own
  - Emphasise for: SRE, engineering management, platform, incident response

- **Led the Kubernetes rollout across the entire tech stack** `#devops`
  `#architecture`
  - Outcome: implemented across the whole stack, completed during my tenure
  - Contribution: led the implementation across the estate. The decision to
    adopt Kubernetes was taken before I became technical lead
  - Emphasise for: platform, SRE, infrastructure, migration delivery

- **Managed a team of six** `#leadership` `#mentoring`
  - What: one-to-ones and mentorship owned outright; performance reviews run
    jointly with the CTO
  - Metric: 6 including me, 5 reports
  - Contribution: sole owner of the day-to-day management relationship; the
    review cycle was shared with the CTO
  - Emphasise for: engineering management, team lead

- **Helped developers gain promotions and meet their career goals**
  `#leadership` `#mentoring`
  - Framework: a developer role checklist that already existed when I arrived,
    setting out every level from junior developer through developer and senior
    developer to technical lead, and the attributes the company expected at
    each. It gave people a way to evidence that they had met a level
  - How: worked through the checklist with each person in one-to-ones to
    establish what they still had to demonstrate, then made sure sprint planning
    put work in front of them where they could demonstrate exactly that. The
    framework drove what people were given to do, rather than only being an
    assessment at review time
  - Metric: two promotions - one junior developer to developer, and one
    developer to senior developer, each within about a year of that person
    joining the company
  - Contribution: the framework was the company's; using it to route work, and
    pushing both cases forward, was mine
  - Emphasise for: engineering management, staff+ IC, team lead

- **Upskilled the wider development team on Kubernetes and serverless**
  `#mentoring` `#architecture`
  - Scale: a development team of 20-30 people, beyond my own team of six
  - What: my team took on educating the rest of engineering in the technologies
    we were adopting, including the Kubernetes migration and serverless
  - Context: weekly tech talks were an established expectation of all developers
    when I arrived, in a culture built around self-development
  - Contribution: my team supplied the Kubernetes and serverless content within
    that existing forum
  - Emphasise for: staff+ IC, platform advocacy - evidence of contributing to an
    established learning culture

- **Cut local environment setup from days to hours, and made shipping on day
  one real** `#delivery` `#devops` `#mentoring`
  - The argument: that a developer should be able to commit, get reviewed,
    merge and release to production on their first day of work. I pushed this
    consistently as the standard onboarding should be held to
  - Before: a couple of days to get a local environment working, at the point I
    joined in September 2018
  - After: a matter of hours by the time I left, most of it spent waiting for
    Docker images to download
  - How: Docker adopted for local development, and a CLI tools repo that stood
    the entire stack up locally with a single command
  - Outcome: several developers, including members of my own team, shipped to
    production within their first day
  - Contribution: the case for the standard was mine, as was starting the CLI
    tooling behind it (below). Getting to a first-day release took a lot of
    moving parts and was not mine alone
  - Emphasise for: platform, developer experience, engineering management,
    roles naming onboarding or time-to-first-commit

- **Started the internal CLI tooling, then deliberately handed it to the team**
  `#delivery` `#devops` `#mentoring`
  - Origin: individual bash scripts were being passed from developer to
    developer as people joined. Consolidated them into a single repo with a
    structure that made them easy to share and extend
  - Contribution: the idea for a suite of tools was mine, as were the first
    couple of tools in the repo
  - Adoption: presented the tools and their uses to the whole tech team, then
    left it open for developers to add their own as they saw fit - which they
    did, and it grew organically from there
  - Later: once the project was well established, tooling was built inside
    sprints as part of the Kubernetes migration, so the tooling for the new
    platform existed from the day the platform did
  - Why it matters: seeded rather than owned. Distributing the ownership on
    purpose is why it kept growing without me
  - Emphasise for: platform, developer experience, staff+ IC, internal tooling,
    roles naming developer productivity

- **Introduced AWS CDK and built an internal constructs library** `#devops`
  `#architecture`
  - Context: the estate used Terraform, Ansible and Puppet. CDK became the
    default for new infrastructure; Ansible and Puppet were deprecated, and
    Terraform stayed in place for IAM user management
  - What: beyond adopting CDK, built an own constructs library to standardise
    common patterns - for example SQS queues provisioned with dead letter
    queues and automatic alerting into PagerDuty as a single construct
  - Why it matters: this is platform work proper - making the right thing the
    easy thing for every other engineer, rather than just picking a tool
  - Contribution: team adoption, own constructs library
  - Emphasise for: platform, DevOps, infrastructure, developer experience

- **Conducted candidate interviews throughout the role** `#hiring`
  - Emphasise for: engineering management, hiring-involved IC roles

- **Answered the technical sections of university tender documents**
  `#stakeholder` `#security`
  - Who from: universities in the UK, Canada and the United States
  - Coverage: disaster recovery, data residency and other compliance
    requirements, alongside the general technical questions
  - What: translated how the platform actually worked into answers a
    procurement panel could evaluate
  - Contribution: helped complete the technical responses
  - Emphasise for: engineering management, solutions architecture, edtech, and
    any role with bid, pre-sales, procurement or compliance exposure

- **Helped oversee the migration from G Suite to Microsoft Teams** `#delivery`
  - Timing: one of the last pieces of work before leaving
  - Contribution: shared oversight of the transition
  - Emphasise for: engineering management, delivery, platform migration

- **Acted as the point of contact for cross-business stakeholder requests**
  `#leadership`
  - Examples: data deletion requests, providing incident summaries
  - Emphasise for: engineering management, roles with compliance exposure

## Technical surface

- **Languages:** Node.js, TypeScript, Bash, PHP (legacy, being migrated away
  from)
- **Frameworks and job processing:** Fat-Free Framework (F3) and Resque
  (php-resque) on the inherited extraction service, both migrated away from
- **Cloud and orchestration:** AWS, serverless, Kubernetes, microservices; EC2
  instances on the inherited stack, replaced by a serverless workflow
- **Document processing:** text extraction from PDF with coordinate data;
  normalisation of docx and EPUB to PDF via an external conversion API
- **Infrastructure as code:** AWS CDK (introduced during the role) as the
  default for new infrastructure, alongside Terraform, which was retained for
  IAM user management; Ansible and Puppet deprecated
- **Datastores:** MongoDB, DocumentDB, DynamoDB, SQL databases
- **Testing:** Jest for Node.js
- **CI/CD:** CircleCI for continuous integration; deployment run through Hubot
  in Slack - ChatOps rather than continuous deployment
- **Observability:** CloudWatch and Grafana for metrics and dashboards;
  PagerDuty for alerting and paging, wired into provisioned infrastructure by
  default via the internal CDK constructs
- **Local development:** Docker, with a CLI tools repo bringing the whole stack
  up locally in one command
- **Tooling:** a set of internal CLI tools for developer productivity, written
  in Bash; an internal AWS CDK constructs library for standardised
  infrastructure patterns
- **Collaboration:** G Suite, then Microsoft Teams following the migration
- **Ways of working:** 24x7 on-call rota, blameless incident review

**Scope:** a back-end and platform role throughout - no front-end development.

**Figures not available:** interviews conducted, incident volumes, the cost
saving on the PHP to serverless migration, how long the extraction service had
gone without active development, and any throughput or corpus figures for it.

## Tailoring notes

- **Leads for hands-on roles:** the extraction service arc - picked up stale,
  extended, debugged, then migrated off F3 to serverless. Told end to end it is
  the strongest hands-on evidence in the history, and the concurrency fix is the
  most technically specific thing in it. The Kubernetes work follows
- **The Senior Developer years carry two things, not one.** September 2018 to
  March 2020 is sole-developer ownership of a service another team's product
  depended on, and - from around March 2019 - running the team's ceremonies a
  full year before the title arrived. A CV showing only the Technical Lead work
  leaves eighteen months looking empty and makes the promotion look unearned,
  when in fact the year before it is where the case for it was made
- **Leads for leadership roles:** incident review process and developer
  promotions
- **Leads for client-facing or pre-sales roles:** the tender work - technical
  depth translated for a non-engineering audience, against international
  university procurement, which few backend CVs carry
- **Domain keywords:** higher education, edtech, tender response, disaster
  recovery, data residency, data sovereignty, compliance
- **Note:** this is the longest role at 4 years 7 months and carries most of the
  leadership evidence
- **Both AWS certifications were earned during this role** (2023, now expired).
  Belongs in a qualifications section once one exists, but worth knowing the
  certs and this tenure are the same period - it evidences the self-development
  culture point rather than sitting as an unconnected line
