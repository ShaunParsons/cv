---
company: Farmfoods Ltd
title: Software Developer
start: 2015-03
end: 2016-10
employment: permanent
location: Birmingham, UK
---

## Mandate

A UK supermarket chain. A software developer role centred on interactive reporting: replacing static, pre-generated reports with a self-service suite the business could query itself, and supporting the systems running in branch.

## Achievements

- **Built an interactive self-service reporting suite** `#data` `#frontend`
  - Situation: reporting was static and pre-generated, so answering a new question meant requesting a report and waiting for it
  - Task: replace it with self-service reporting the business could query itself
  - Action: built it as a single-page web application with Backbone.js and Marionette
  - Result: the business answered its own questions rather than queuing behind a report request
  - Emphasise for: full-stack, data and reporting, internal tooling

- **Built a single-page store ordering web application** `#frontend`
  - Action: built it with Backbone.js and Marionette, for the branch ordering the role supported alongside the reporting work
  - Emphasise for: full-stack, frontend, internal tooling, retail technology

- **Tuned MySQL to carry tables in excess of 300 million rows** `#data`
  - Situation: MySQL tables running in excess of 300 million rows
  - Task: keep them performing at that volume
  - Action: optimised table structure and system configuration
  - Result: the tables coped at 300 million rows and above
  - Emphasise for: backend, data engineering, any role naming database performance or query tuning

- **Aggregated data in-store before it reached the central API** `#architecture` `#data`
  - Situation: the alternative was shipping raw data centrally and aggregating it there
  - Action: distributed the aggregation out to the stores, which then connected to a RESTful API
  - Emphasise for: backend, architecture, distributed systems, edge processing

- **Built in-branch self-diagnostics for network faults** `#delivery`
  - Situation: an undetected network fault could stop a branch trading
  - Action: built detection for network faults in branch
  - Emphasise for: backend, reliability, operations, retail technology

- **Redesigned the Branch Backoffice UI to be responsive** `#frontend`
  - Situation: the Branch Backoffice interface did not work on the tablets used in branch
  - Action: updated the HTML and CSS so the design was responsive
  - Result: the interface worked on the in-branch tablets
  - Emphasise for: frontend, full-stack

- **Worked on card payment systems inside PCI scope** `#security` `#data`
  - Situation: branch systems took card payments, which brought the work inside PCI scope, and the business transitioned card payment provider during my time there
  - Action: worked on those branch systems within that scope
  - Contribution: exposure to the payment path and to the provider transition; neither was mine to own
  - Emphasise for: payments, fintech, and any spec naming PCI DSS or a regulated industry

- **Negotiated requirements directly with stakeholders up to board level** `#stakeholder`
  - Situation: no product or account layer sat between the developers and the business
  - Action: negotiated requirements directly with stakeholders including the Board of Directors
  - Note: direct board exposure in a developer seat, unusually early in a career
  - Emphasise for: any role with stakeholder, product or client-facing exposure

## Technical surface

- **Languages:** PHP, JavaScript
- **Front end:** Backbone.js with Marionette, jQuery
- **Datastores:** MySQL and PostgreSQL, with MySQL performance and tuning work at 300 million rows plus
- **Architecture:** RESTful API with aggregation distributed to the stores

## Tailoring notes

- **Leads for:** data volume and database tuning - the 300 million row figure is the hardest number in the early history
- **Also carries:** board-level stakeholder contact, unusually early in a career
- **Note:** the front-end stack here is dated. The reporting suite is worth describing by what it did rather than what it was built with, unless the target names Backbone
