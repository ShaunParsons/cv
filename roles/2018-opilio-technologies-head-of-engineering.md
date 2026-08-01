---
company: Opilio Technologies
title: Head of Engineering
start: 2018-03
end: 2018-09
employment: permanent
location: Coventry, UK
---

## Mandate

Brought in to replace the outgoing head of engineering. Despite the title there
was no development team - a solo role, responsible for both keeping the existing
product running and building its replacement.

## Achievements

- **Created an MVP for a multi-tenanted SaaS product** `#architecture`
  - Purpose: to replace the product then in use - an MVP built in PHP on Laravel
  - Aims: support multiple customers on a single platform, and improve
    reliability
  - Built with: Node.js, PostgreSQL and Vue.js, hosted on Heroku with file
    storage on Amazon S3
  - Contribution: sole developer - designed and built it single-handed
  - Emphasise for: backend, architecture, greenfield product work

- **Set up automated CI/CD for the new platform** `#devops` `#delivery`
  - What: automated deploys to Heroku, database migrations included, behind a
    high level of test coverage
  - Why it matters: built as a one-person team, so the pipeline had to carry
    the assurance a second pair of eyes would otherwise provide
  - Contribution: sole author
  - Emphasise for: backend, devops, greenfield product work

- **Led the planning of the rebuild** `#architecture` `#stakeholder`
  - What: prioritised system requirements against the limitations of the
    existing application and feedback from prospective clients
  - Contribution: mine to own
  - Emphasise for: architecture, product-minded engineering, technical
    leadership

- **Built a tenant-isolation layer over the Sequelize ORM** `#architecture`
  `#data`
  - What: enforced separation between customers' data at the ORM level, so
    tenant scoping could not be forgotten at the call site
  - Reads: tenant scoping applied at query time rather than left to the caller
  - Writes: every record written with a tenant ID
  - Contribution: sole author
  - Emphasise for: backend, architecture, multi-tenant SaaS, and any spec naming
    data isolation or access control at the data layer

- **Maintained the existing Laravel MVP** `#delivery`
  - What: kept the product the business was running on alive while its
    replacement was built
  - Contribution: sole developer

- **Represented engineering in client meetings** `#stakeholder`
  - What: attended meetings with prospective clients to discuss how the system
    under development could serve them, and fed what came back into the
    prioritisation of the rebuild
  - Note: unusual for a hands-on engineering role and worth surfacing for any
    position with a client-facing or pre-sales element
  - Emphasise for: solutions architect, consultancy, client-facing engineering

## Technical surface

- **New platform:** Node.js, PostgreSQL, Vue.js
- **Data:** Sequelize ORM, with an own-authored tenant-isolation layer on top
- **Hosting and deployment:** Heroku, with Amazon S3 for file storage and
  automated CI/CD including database migrations
- **Existing product:** PHP on Laravel - an MVP, not a long-lived legacy estate

## Tailoring notes

- **Leads for:** greenfield build, multi-tenancy, and the client-facing element
- **Evidence type:** delivery and ownership. The title was Head of Engineering
  and the team was one person, so the strength here is sole responsibility for
  a product, not people management
- **Length:** six months
