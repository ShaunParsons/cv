---
company: Amigo Technology
title: Software Developer
start: 2016-10
end: 2018-03
employment: permanent
location: Birmingham, UK
---

## Mandate

A startup building tooling for agile marketing. An individual contributor role,
not a leadership one: architectural and design decisions sat with the CTO, and
my work was building and maintaining services within that architecture.

## Achievements

- **Developed services within a microservice architecture supporting marketing
  campaigns for multinational clients** `#architecture`
  - Hosting: Heroku, with a CI/CD pipeline allowing continuous deployment
  - Metric: 99.999% uptime - a team and platform figure, not a personal one
  - Contribution: individual contributor, building and maintaining services
    within the architecture. Architectural decisions were the CTO's
  - Emphasise for: backend, early-career evidence of working at scale

- **Built client integrations for reuse rather than one client at a time**
  `#architecture`
  - What: integrations for client websites, configurable by the company's own
    account managers through a content management system
  - Why it matters: the deliberate choice was reusability across clients over a
    bespoke build per client, which moved delivery off the engineering team and
    onto the people who owned the client relationship
  - Emphasise for: backend, platform and product engineering, agency or
    multi-client environments

- **Built substantial application logic in PostgreSQL** `#data`
  - What: complex CTEs and stored functions carrying a significant share of the
    work, tested with pgTAP at both unit and integration level
  - Note: the substance here is application logic living in the database, not
    query-writing - worth naming PostgreSQL and PL/pgSQL specifically rather
    than "SQL"
  - Emphasise for: backend, data engineering, roles with heavy SQL

- **Worked to a testing standard that covered code and user journeys alike**
  `#delivery`
  - What: unit and integration tests on all code, run on CircleCI from GitHub;
    system tests covering each user journey on every client campaign; database
    tests in pgTAP
  - Why it matters: an environment heavily focused on testing and reliability,
    which is where the uptime figure came from
  - Emphasise for: backend, quality-focused teams, roles naming test strategy

- **Developed a process for setting measurable objectives on internal projects**
  `#delivery` `#leadership`
  - What: a way to evaluate whether internal projects had succeeded - setting
    measurable metrics for success, managing resource to hit the date, and
    reporting back to the senior management team
  - Contribution: developed it outright
  - Why it matters: initiative taken from an IC seat, in a role where the
    design calls sat with the CTO - evidence of reach beyond the assigned work
  - Emphasise for: delivery, project management, engineering management

- **Built and maintained a Salesforce integration** `#data`
  - Emphasise for: backend, integration-heavy roles, martech and CRM platforms

## Technical surface

- **Primary:** Node.js
- **Front end:** React
- **Exposure:** Go - used in a couple of places only
- **Datastores:** PostgreSQL, used heavily - substantial logic held in the
  database, including complex CTEs, stored functions and PL/pgSQL, tested with
  pgTAP
- **Web serving:** nginx
- **Third party:** Salesforce
- **Architecture:** microservices
- **Hosting and CI/CD:** Heroku, with CircleCI running from GitHub and a
  pipeline supporting continuous deployment. The company's later migration to
  GCP fell outside my involvement

**On Go:** used in a couple of places here and nowhere else in the history -
recorded as exposure rather than a working language.

## Tailoring notes

- **Leads for:** reliability, given the 99.999% figure, and PostgreSQL depth
- **Also carries:** the reusable-integration design and the objective-setting
  process, both of which read as more than an IC brief
- **Note:** the earliest commercial role in the history bar Farmfoods. Most
  relevant where PostgreSQL depth or reliability at scale is the ask; a couple
  of lines will usually carry it otherwise
