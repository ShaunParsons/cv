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

Initially tasked with reviving an existing microservice. That service went on to
form a key part of the company's existing products and its upcoming product
ideas.

## Achievements

- **Migrated a critical service off an unsupported PHP framework to serverless
  AWS** `#architecture` `#devops` `#cost`
  - Outcome: improved throughput of the service while reducing operating costs
  - Scale: multiple developers onboarded onto the work over time
  - Note: the actual cost savings are not available
  - Contribution: designed the migration personally; multiple developers
    implemented it under that design
  - Emphasise for: backend, platform, architecture, modernisation

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
  - How: worked to an internal framework, creating opportunities for people to
    showcase skills they had not previously been able to display
  - Metric: two developers promoted
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

- **Improved developer experience and onboarding** `#delivery` `#mentoring`
  - What: increased developer productivity by automating repetitive tasks
  - Concrete output: a set of internal CLI tools written in Bash
  - Emphasise for: platform, developer experience, engineering management

- **Introduced AWS CDK and built an internal constructs library** `#devops`
  `#architecture`
  - Context: the estate had previously used Terraform, Ansible and Puppet
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
- **Cloud and orchestration:** AWS, serverless, Kubernetes, microservices
- **Infrastructure as code:** AWS CDK (introduced during the role); previously
  Terraform, Ansible, Puppet
- **Datastores:** MongoDB, DocumentDB, DynamoDB, SQL databases
- **CI/CD:** CircleCI for continuous integration; deployment run through a Slack
  chatbot - ChatOps rather than continuous deployment
- **Observability:** CloudWatch and Grafana for metrics and dashboards;
  PagerDuty for alerting and paging, wired into provisioned infrastructure by
  default via the internal CDK constructs
- **Tooling:** a set of internal CLI tools for developer productivity, written
  in Bash; an internal AWS CDK constructs library for standardised
  infrastructure patterns
- **Collaboration:** G Suite, then Microsoft Teams following the migration
- **Ways of working:** 24x7 on-call rota, blameless incident review

**Scope:** a back-end and platform role throughout - no front-end development.

**Figures not available:** interviews conducted, incident volumes, and the cost
saving on the PHP to serverless migration.

## Tailoring notes

- **Leads for hands-on roles:** the PHP → serverless migration and the
  Kubernetes work
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
