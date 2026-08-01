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

- **Ran the team's agile ceremonies, from a year before holding the title
  through to the end of the role** `#leadership` `#delivery`
  - Period: roughly March 2019 to April 2023, the first year of it while still a
    Senior Developer
  - What: led the daily stand-ups, sprint planning, the mid-sprint review and
    the end-of-sprint review
  - Estimation: new work was estimated as part of these ceremonies, with the
    estimating itself done collaboratively by the team
  - Supervision: initially run under my manager, the CTO
  - Team: included developers considerably more experienced than I was at the
    time, whose guidance I drew on where it helped
  - Contribution: mine to run day to day. The oversight was the CTO's at the
    outset, and the estimates were the team's
  - Why it matters: the first year is the one immediately preceding the
    promotion to Technical Lead, and it was leadership taken on from an IC seat
    rather than conferred with a title
  - Emphasise for: team lead, engineering management, technical architecture,
    any spec naming estimation, sprint planning or agile ceremonies, and any
    spec asking for evidence of operating above the current level

- **Moved estimation out of sprint planning and into the daily stand-ups**
  `#delivery` `#leadership`
  - Before: every piece of new work was estimated inside sprint planning, which
    made the meeting run long
  - Change: estimated new work in the daily stand-up instead, a little each day,
    so sprint planning arrived with the estimates already done
  - Result: planning no longer had to produce the estimates, and the estimating
    was spread across the sprint rather than concentrated in one session
  - Contribution: mine - I proposed the change and drove it. The estimating
    itself stayed a collaborative team exercise
  - Emphasise for: delivery, technical architecture, team lead, and any spec
    naming estimation, agile ceremonies or improving delivery process

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

- **Owned delivery against the platform's customer SLAs** `#devops` `#leadership`
  - Commitment: 99.9% uptime, written into customer contracts. The same terms
    applied to every customer rather than being negotiated per institution
  - Result: the 99.99% above - a tenth of the downtime the contract allowed
  - Contribution: responsible for delivering against the SLA. The terms
    themselves were set by the team handling contracts, with the CTO, and agreed
    with customers as they signed - not mine to write or negotiate
  - How: the on-call rota and the incident review process below are the
    machinery that met it
  - Emphasise for: SRE, platform, engineering management, and any spec naming
    SLAs, reliability targets or contractual uptime

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
  - Platform: self-managed clusters, not EKS
  - Contribution: led the implementation across the estate. The decision to
    adopt Kubernetes was taken before I became technical lead
  - Emphasise for: platform, SRE, infrastructure, migration delivery

- **Ran self-managed Kubernetes in production** `#devops`
  - Scope: cluster version upgrades, node group rotation, and the scaling rules
    the clusters ran under
  - Contribution: my team's to run, and I led the team. The detailed cluster
    operations sat with the engineers performing them rather than with me
  - Emphasise for: platform, SRE, infrastructure, and any spec naming
    self-managed Kubernetes, cluster lifecycle or version upgrades

- **Autoscaled the web tier and the worker fleet** `#devops` `#architecture`
  - Web tier: EC2 instances behind Auto Scaling Groups
  - Workers: EC2 instances scaled on the depth of the Resque job queues, so
    capacity followed the backlog rather than a schedule
  - Reliability: multi-availability-zone throughout
  - Contribution: my team's, and I led the team
  - Emphasise for: platform, SRE, infrastructure, and any spec naming
    autoscaling, elastic capacity or queue-driven scaling

- **Planned capacity and reserved instance commitments around a seasonal peak**
  `#devops` `#cost`
  - Cycle: throughput rose by an order of magnitude at the start of the UK
    academic year in September, with a smaller peak in January
  - What: set out the instance requirements and the reserved instance
    commitments matching steady-state need, holding on-demand capacity back to
    absorb the peaks rather than reserving for them
  - Where: across the EC2 fleet, and more so once Kubernetes ran on it
  - Contribution: my team's, and I led the team
  - Emphasise for: platform, SRE, infrastructure, FinOps, and any spec naming
    capacity planning, cloud cost or reserved instances

- **Managed a team of six** `#leadership` `#mentoring`
  - What: one-to-ones and mentorship owned outright; performance reviews run
    jointly with the CTO
  - Metric: 6 including me, 5 reports
  - Seniority: the company had a Staff Engineer grade, and one of the five
    reports held it
  - Contribution: sole owner of the day-to-day management relationship; the
    review cycle was shared with the CTO
  - Emphasise for: engineering management, team lead, and any spec asking for
    experience managing engineers at staff level

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
  - Outcome: the tools ended up carrying production deployments. Once Ansible
    was deprecated, Hubot ran releases through this tooling instead of through
    playbooks
  - Why it matters: seeded rather than owned. Distributing the ownership on
    purpose is why it kept growing without me - far enough that something I
    started as a way to share bash scripts became the deployment path for the
    estate
  - Emphasise for: platform, developer experience, staff+ IC, internal tooling,
    roles naming developer productivity

- **Introduced AWS CDK and built an internal constructs library** `#devops`
  `#architecture`
  - Context: the estate used Terraform, Ansible and Puppet. CDK became the
    default for new infrastructure and Ansible and Puppet were deprecated;
    Terraform stayed in place for the estate-wide resources described below
  - What: beyond adopting CDK, built an own constructs library to standardise
    common patterns - for example SQS queues provisioned with dead letter
    queues and automatic alerting into PagerDuty as a single construct
  - Why it matters: this is platform work proper - making the right thing the
    easy thing for every other engineer, rather than just picking a tool
  - Contribution: team adoption, own constructs library
  - Emphasise for: platform, DevOps, infrastructure, developer experience

- **Provisioned the estate's global and networking infrastructure in
  Terraform** `#devops` `#architecture`
  - Scope: predominantly global resources - IAM chief among them - alongside
    VPC and VPN configuration, subnets, and legacy data stores including S3
  - Cross-region: connections between VPCs in different regions, carrying data
    transfer between them for a small number of specific cases
  - Why Terraform rather than CDK: these are the estate-wide resources that sit
    underneath and across every service, so they stayed in the tool that
    already held them while CDK took new per-service infrastructure
  - Contribution: wrote and owned the Terraform for these resources
  - Emphasise for: platform, DevOps, infrastructure, cloud networking, and any
    spec naming Terraform specifically

- **Held secrets in Consul, and implemented AWS Secrets Manager across the
  serverless projects** `#devops` `#security`
  - As found: Consul, already in place when I joined in September 2018
  - What: AWS Secrets Manager implemented as part of the serverless projects
    built during the role
  - Contribution: Consul predated me and was operated rather than introduced;
    Secrets Manager was my team's to implement
  - Carries over: the same Secrets Manager pattern is used at Parsons Group, so
    it is current rather than historical - see
    `roles/2022-parsons-group-owner-director.md`
  - Emphasise for: platform, DevOps, security, and any spec naming secrets
    management or operational security practices

- **Ran MongoDB self-managed on EC2, replicated across availability zones**
  `#devops` `#data` `#architecture`
  - What: MongoDB on EC2 instances rather than a managed database service,
    operated as a replicated cluster
  - Reliability: read-write replicas distributed across multiple availability
    zones, so no single zone held the datastore
  - Performance: read replicas alongside them, carrying read traffic off the
    write path
  - End state: still self-managed on EC2 in April 2023, at the end of the
    tenure - it was not migrated onto a managed service
  - Contribution: my team's to build and operate. I led that team and worked in
    the cluster, rather than standing the topology up single-handed
  - Emphasise for: platform, SRE, infrastructure, and any spec drawing a line
    between databases operated and databases consumed

- **Took ownership of the streaming analytics pipeline and moved it onto CDK**
  `#devops` `#data` `#architecture`
  - Stack: Kinesis streams feeding Kinesis Data Analytics, which ran the
    aggregations over time windows; Kinesis Firehose for delivery; Amazon
    Redshift as the warehouse
  - Context: built before my team held it, and running in production by the time
    it came to us
  - What: developed the pipeline further, and moved it from a hand-rolled
    deployment onto AWS CDK, so it was provisioned the same way as the rest of
    the new infrastructure
  - Contribution: my team's to own, develop and re-platform. I led that team
  - Emphasise for: platform, data engineering, and any spec naming streaming,
    event streaming, real-time data, Kinesis or a data warehouse

- **Found and fixed incorrect aggregations of customer data in the streaming
  pipeline** `#data` `#devops` `#architecture`
  - Context: inherited with the pipeline rather than introduced by my team, and
    one of the first pieces of work we were given after taking it on
  - Symptom: aggregations over customer event data coming out wrong, raised with
    us by customers
  - Cause: the Kinesis Data Analytics applications were configured with a time
    window larger than the service documentation allowed
  - Contribution: my team diagnosed it and implemented the fix. I led that team
  - Emphasise for: platform, data engineering, distributed systems, and any spec
    naming production debugging, streaming or real-time data

- **Took the platform multi-region when US customers wanted their data held
  locally** `#devops` `#architecture`
  - Context: a multi-tenanted SaaS platform serving universities, with tenants
    sharing the platform and isolation enforced in the application and data
    layers. The multi-tenancy was in place before I joined
  - Driver: customers in the US region wanted their data held locally; serving
    those users from a nearer region also cut latency
  - Contribution: built and owned the multi-region deployment
  - Emphasise for: platform, DevOps, infrastructure, and any spec naming
    multi-region deployment, data residency or multi-tenancy

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
  instances on the inherited stack, where the Resque workers were replaced by a
  serverless workflow and the MongoDB cluster stayed on EC2 throughout
- **Platform shape:** a multi-tenanted SaaS platform, tenants sharing the
  platform with isolation enforced in the application and data layers, deployed
  across multiple AWS regions. The multi-tenancy predated me; the multi-region
  deployment was mine to build and own
- **Document processing:** text extraction from PDF with coordinate data;
  normalisation of docx and EPUB to PDF via an external conversion API
- **Infrastructure as code:** AWS CDK (introduced during the role) as the
  default for new per-service infrastructure, alongside Terraform, which held
  the estate-wide resources - IAM and other global resources, VPC and VPN
  configuration, subnets, and legacy data stores including S3. Ansible carried
  deployments until it was deprecated, on playbooks I maintained rather than
  wrote from scratch; Puppet deprecated
- **Secrets management:** Consul, pre-existing on the estate; AWS Secrets
  Manager, implemented for the serverless projects
- **Datastores:** MongoDB - self-managed on EC2 as a replicated cluster spanning
  availability zones, with read replicas, rather than a managed service -
  alongside PostgreSQL on RDS, deployed Multi-AZ and my team's to operate, and
  DocumentDB and DynamoDB
- **Search and caching:** Elasticsearch, used substantially across the platform;
  Redis for in-memory data
- **Compute and scaling:** self-managed Kubernetes rather than EKS, running on a
  fleet of EC2 instances; Auto Scaling Groups for the web tier and for workers
  scaled on Resque queue depth; multi-availability-zone throughout
- **Streaming and analytics:** Kinesis streams, Kinesis Data Analytics for
  windowed aggregations, Kinesis Firehose, and Amazon Redshift as the warehouse
- **Testing:** Jest for Node.js
- **CI/CD:** CircleCI for continuous integration across the estate, with GitHub
  Actions running tests and building artifacts on some of the newer services
  towards the end of the tenure; deployment triggered from Slack through Hubot,
  running on its own EC2 instance. Hubot executed Ansible playbooks to begin
  with, and moved onto the internal CLI tools once Ansible was deprecated -
  ChatOps throughout, rather than continuous deployment or a reconciliation loop
- **Observability:** Prometheus for metrics and Loki for log aggregation, with
  Grafana and CloudWatch for dashboards; PagerDuty for alerting and paging,
  wired into provisioned infrastructure by default via the internal CDK
  constructs. The Prometheus and Loki stack was built by my team; I worked in
  it daily and ran incident management on top of it rather than setting it up
- **Local development:** Docker, with a CLI tools repo bringing the whole stack
  up locally in one command
- **Tooling:** a set of internal CLI tools for developer productivity, written
  in Bash; an internal AWS CDK constructs library for standardised
  infrastructure patterns
- **Collaboration:** G Suite, then Microsoft Teams following the migration
- **Ways of working:** 24x7 on-call rota, blameless incident review; daily
  stand-ups, sprint planning, mid-sprint and end-of-sprint reviews, with new
  work estimated collaboratively in the stand-ups

**Scope:** a back-end and platform role throughout - no front-end development.

**Figures not available:** interviews conducted, incident volumes, the cost
saving on the PHP to serverless migration, how long the extraction service had
gone without active development, any throughput or corpus figures for it, and
the time sprint planning took before and after estimation moved out of it.

## Tailoring notes

- **Access control and network policy were AWS-layer, not Kubernetes-layer.**
  Roles and service accounts were configured through AWS IAM, and network
  segmentation through VPC, subnet and VPN configuration. The clusters were not
  governed by Kubernetes RBAC objects or by Kubernetes Network Policies. Platform
  specs often name both layers in a single line as though they were one skill;
  the IAM and the VPC work answer the AWS half precisely, and the Kubernetes half
  is a different set of objects.

- **Estimation is one story told in two bullets, and the second one leads.**
  Architect and technical lead specs routinely ask for estimation alongside
  architecture and requirements work. The ceremonies bullet carries the
  responsibility - four ceremonies run across four years, with estimation inside
  them - and the stand-up change carries the judgement: a problem, a decision
  that was mine, and what followed. Where only one line is available, spend it
  on the change, because a responsibility is a job description and a change is
  evidence. The estimating itself was the team's and both bullets say so

- **Leads for hands-on roles:** the extraction service arc - picked up stale,
  extended, debugged, then migrated off F3 to serverless. Told end to end it is
  the strongest hands-on evidence in the history, and the concurrency fix is the
  most technically specific thing in it. The Kubernetes work follows
- **The CV states the final title only: Technical Lead, for the whole tenure.**
  The `title_history` above is the record; a CV heading does not need to
  narrate the promotion
- **The work from the Senior Developer years still goes on the CV**, just
  without being labelled by the title held at the time. September 2018 to March
  2020 is sole-developer ownership of a service another team's product depended
  on, and - from around March 2019 - running the team's ceremonies. Both are
  among the strongest evidence in the role and neither depends on the title to
  land
- **On the Kubernetes rollout, the claim is the rollout.** The bullet says what
  was led - the implementation across the estate, completed within the tenure -
  and does not narrate the adoption decision, which sat elsewhere. Saying what
  was led is already precise, and a CV bullet that claims the implementation
  cannot be read as claiming the choice. The decision only needs raising where a
  spec asks who selected the platform
- **On the CDK bullet, the claim ends at the constructs library.** What CDK
  replaced is context, not achievement: Ansible and Puppet are named above
  because the record should be complete, but a CV line spent on retired tooling
  buys nothing, and the Terraform bullet already says which resources stayed
  where. Bring the deprecation forward only for a spec naming Ansible or Puppet,
  or one asking about consolidating a mixed IaC estate
- **The MongoDB cluster is the evidence for "operated, not consumed".** Platform
  and persistence specs increasingly draw that line in as many words, and
  DocumentDB, DynamoDB and RDS sit on the wrong side of it - the Multi-AZ
  Postgres was operated by the team but the service was managed, so it answers a
  spec naming RDS rather than one naming self-managed persistence. Self-managed replicas on
  EC2, spanning availability zones, sit on the right side. Bring it forward for
  any spec naming distributed databases, replication, self-managed persistence
  or high availability at the data layer; leave it off where the datastore is
  incidental to the role. The attribution is shared, and the bullet says so -
  the team built and ran it, and I led the team
- **The reliability commitment was an SLA, not an SLO.** 99.9% uptime, written
  into customer contracts and set outside engineering. There was no separate
  internal objective held stricter than the contractual one, and no error
  budget governing what the team worked on. Platform and SRE specs increasingly
  name SLOs, SLAs and error budgets together as though they were one
  requirement - where they do, the SLA bullet answers the part that exists, and
  the on-call rota and blameless incident review carry the rest. The three are
  different artefacts and an interviewer who runs them will hear the difference
- **The Kinesis pipeline is the answer to "streaming platforms".** Platform
  specs routinely list distributed systems, event-driven architecture and
  streaming as alternatives; the first two are answered several times over
  across the history, and this is the only evidence for the third. It is also
  the second inherited-system arc in this role, and it runs the same course as
  the extraction service - taken on, debugged, then re-platformed. Two
  independent instances of that arc are the pattern worth naming for a spec
  asking about maturing what already exists
- **Secrets management spans two roles, and the current one is Secrets
  Manager.** Consul predates me here and Secrets Manager was adopted for the
  serverless work; the same pattern is in daily use at Parsons Group. For a spec
  naming secrets management, lead with Secrets Manager and let Consul carry the
  breadth. Where a spec pairs it with RBAC, the evidence is the IAM policy in
  the Terraform above and the tenant isolation in the application and data
  layers
- **Leads for leadership roles:** incident review process and developer
  promotions
- **Leads for client-facing or pre-sales roles:** the tender work - technical
  depth translated for a non-engineering audience, against international
  university procurement, which few backend CVs carry
- **Domain keywords:** higher education, edtech, tender response, disaster
  recovery, data residency, data sovereignty, compliance, multi-region,
  multi-tenancy
- **Note:** this is the longest role at 4 years 7 months and carries most of the
  leadership evidence
- **Both AWS certifications were earned during this role** (2023, now expired).
  Belongs in a qualifications section once one exists, but worth knowing the
  certs and this tenure are the same period - it evidences the self-development
  culture point rather than sitting as an unconnected line
