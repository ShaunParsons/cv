---
company: Amigo Technology
title: Software Developer
start: 2016-10
end: 2018-03
employment: permanent
location: Birmingham, UK
---

## Mandate

A startup building tooling for agile marketing. An individual contributor role, not a leadership one: architectural and design decisions sat with the CTO, and my work was building and maintaining services within that architecture.

## Achievements

- **Developed services within a microservice architecture supporting marketing campaigns for multinational clients** `#architecture`
  - Situation: a microservice architecture on Heroku serving marketing campaigns for multinational clients, with a CI/CD pipeline allowing continuous deployment
  - Task: build and maintain services within that architecture
  - Action: developed services across it, deploying continuously through the pipeline
  - Result: 99.999% uptime - a team and platform figure, not a personal one
  - Contribution: individual contributor, building and maintaining services within the architecture. Architectural decisions were the CTO's
  - Emphasise for: backend, early-career evidence of working at scale

- **Built client integrations for reuse rather than one client at a time** `#architecture`
  - Situation: integrations for client websites, where the alternative was a bespoke build per client
  - Task: deliver integrations across a growing client base
  - Action: built them for reuse, configurable by the company's own account managers through a content management system
  - Result: delivery moved off the engineering team and onto the people who owned the client relationship
  - Emphasise for: backend, platform and product engineering, agency or multi-client environments

- **Built substantial application logic in PostgreSQL** `#data`
  - Action: built complex CTEs and stored functions carrying a significant share of the application's work, tested with pgTAP at both unit and integration level
  - Note: the substance here is application logic living in the database, not query-writing - worth naming PostgreSQL and PL/pgSQL specifically rather than "SQL"
  - Emphasise for: backend, data engineering, roles with heavy SQL

- **Worked to a testing standard that covered code and user journeys alike** `#delivery`
  - Situation: an environment heavily focused on testing and reliability
  - Action: unit and integration tests on all code, run on CircleCI from GitHub; system tests covering each user journey on every client campaign; database tests in pgTAP
  - Result: the reliability the platform's 99.999% uptime came from - again, a team and platform figure
  - Emphasise for: backend, quality-focused teams, roles naming test strategy

- **Developed a process for setting measurable objectives on internal projects** `#delivery` `#leadership`
  - Situation: internal projects ran without any way of judging afterwards whether they had succeeded
  - Task: nobody's - the work sat outside an IC brief in a role where the design calls were the CTO's
  - Action: set measurable metrics for success, managed resource to hit the date, and reported back to the senior management team
  - Contribution: developed it outright
  - Note: initiative taken from an IC seat - evidence of reach beyond the assigned work
  - Emphasise for: delivery, project management, engineering management

- **Built and maintained a Salesforce integration** `#data`
  - Action: built and maintained the company's Salesforce integration
  - Emphasise for: backend, integration-heavy roles, martech and CRM platforms

## Technical surface

- **Primary:** Node.js
- **Front end:** React
- **Exposure:** Go - used in a couple of places only
- **Datastores:** PostgreSQL, used heavily - substantial logic held in the database, including complex CTEs, stored functions and PL/pgSQL, tested with pgTAP
- **Web serving:** nginx
- **Third party:** Salesforce
- **Architecture:** microservices
- **Hosting and CI/CD:** Heroku, with CircleCI running from GitHub and a pipeline supporting continuous deployment. The company's later migration to GCP fell outside my involvement

**On Go:** used in a couple of places here and nowhere else in the history - recorded as exposure rather than a working language.

## Tailoring notes

- **Leads for:** reliability, given the 99.999% figure, and PostgreSQL depth
- **Also carries:** the reusable-integration design and the objective-setting process, both of which read as more than an IC brief
- **Note:** the earliest commercial role in the history bar Farmfoods. Most relevant where PostgreSQL depth or reliability at scale is the ask; a couple of lines will usually carry it otherwise
