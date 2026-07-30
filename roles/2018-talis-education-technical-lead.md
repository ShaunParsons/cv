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
engineering_size: 30             # wider development team
concurrent_with: Parsons Group Limited
commitment:
  - period: 2018-09 → 2022-04
    note: full-time
  - period: 2022-04 → 2023-04
    note: four days a week, alongside running Parsons Group Limited
---

## Mandate

Brought in to take an existing microservice back into active development after a period without any. Written in PHP on the Fat-Free Framework (F3) - a niche choice - and left to go stale. That service went on to form a key part of the company's existing products and its upcoming product ideas.

## Achievements

The first four all concern the same service - the document extraction microservice behind the e-book reader product - and run in order. Picked up stale, grown, debugged, then migrated off the framework it was written on. Taken together they span the Senior Developer years and the Technical Lead ones, which is the clearest evidence in the history of what the promotion was for.

- **Took a stale microservice back into active development, and grew a team around it** `#delivery` `#architecture`
  - Situation: a service already deployed and one of the core technologies behind an e-book reader product, but left without active development - PHP on the Fat-Free Framework (F3), Resque workers on EC2 instances, MongoDB. Began September 2018, as Senior Developer
  - Task: bring it back into active development
  - Action: extended the existing feature set and fixed outstanding bugs as sole developer on it at the outset, supported by another senior developer whose own focus was a different microservice
  - Result: back in active development and staffed - four developers had worked on it by the time I left
  - Contribution: the originating engineer on the service, from the first day
  - Emphasise for: backend, roles naming legacy or inherited systems, evidence of ownership from an IC seat

- **Built text extraction with coordinate data, so another team could ship highlighting** `#architecture` `#data`
  - Situation: the service converted source material into the internal formats the company's own reader consumed, and the reader's commenting and annotation features were built on those formats
  - Task: give a front-end service built by a different team what it needed to render text highlighting
  - Action: extracted text along with the coordinate data describing where on the page it sat, across PDF, EPUB, docx and other document types, with the same treatment applied to images, video and audio converted into proprietary internal formats for the reader. Non-PDF documents were normalised to PDF before extraction, so one extractor served every input format rather than one per format, with docx and EPUB conversion handled by an external API provider rather than built in house. Specced the API with the front-end team who consumed it
  - Result: the front-end team shipped text highlighting on top of it
  - Contribution: built the extraction; the conversion was a third-party service
  - Emphasise for: backend, API and interface design, cross-team delivery, document processing

- **Found and fixed a concurrency bug that was silently losing data** `#data` `#architecture`
  - Situation: updates being overwritten or deleted by other workers running concurrently, because a worker read the entire state of a MongoDB record, modified it and wrote the whole thing back - so two workers touching the same record clobbered each other. It surfaced as records stuck in processing, files that never finished uploading, and it reached us through customers reporting them rather than through any alarm
  - Action: replaced read-modify-write with atomic field-level updates, so a worker sets only what it owns, then added a metric reporting any file not processed within an hour
  - Result: the data loss stopped, and that class of failure would be found by monitoring rather than by the people it affected. The bug was the defect; being told about it by customers was the other one
  - Contribution: the debugging and the fix were mine
  - Emphasise for: backend, distributed systems, data integrity, roles naming debugging or production support

- **Migrated that service off an unsupported PHP framework to a serverless workflow** `#architecture` `#devops` `#cost`
  - Situation: PHP on F3 with Resque workers on EC2 instances, on a framework that was no longer actively supported
  - Task: raise throughput, cut operating cost and get dynamic scaling, off a dead framework
  - Action: designed the migration onto a serverless workflow on AWS, with multiple developers onboarded onto the work over time
  - Result: improved throughput of the service while reducing operating costs - the actual cost savings are not available. Business priorities then moved and the API stayed on PHP while the background workers went serverless: the remaining API was working for its users, so finishing the move was judged unnecessary against what the business needed next. The call was to stop rather than to complete something that was already serving people - I had wanted to finish it
  - Contribution: designed the migration personally; multiple developers implemented it under that design
  - Note: the serverless work went into a second repository and the two were coupled through their test suites, each running tests reaching into the other. The early signal was flaky tests caused by breaking changes across that boundary, and getting work tested and merged became a bottleneck for the team. The coupling was accepted as a point-in-time cost the finished migration would remove, and the temporary state became the standing one. Every artefact since is independently testable and deployable with no cross-repository dependencies - the CV-usable half is the practice, not the episode behind it
  - Emphasise for: backend, platform, architecture, modernisation

- **Ran the team's agile ceremonies, from a year before holding the title through to the end of the role** `#leadership` `#delivery`
  - Situation: roughly March 2019 to April 2023, the first year of it while still a Senior Developer, on a team that included developers considerably more experienced than I was at the time
  - Action: led the daily stand-ups, sprint planning, the mid-sprint review and the end-of-sprint review - initially under my manager the CTO, and drawing on those more experienced developers' guidance where it helped. New work was estimated as part of the ceremonies, with the estimating itself done collaboratively by the team, and work carried a label for its type, a spike meaning time set aside to try something out
  - Result: spikes were the route to proofs of concept and MVPs and worked well for that; the recurring difficulty came afterwards - securing the development time to build the thing properly, rather than letting the spike become the production version by default
  - Contribution: mine to run day to day. The oversight was the CTO's at the outset, and the estimates were the team's
  - Note: the first year is the one immediately preceding the promotion to Technical Lead - leadership taken on from an IC seat rather than conferred with a title
  - Emphasise for: team lead, engineering management, technical architecture, any spec naming estimation, sprint planning or agile ceremonies, and any spec asking for evidence of operating above the current level

- **Set the platform team's direction sprint to sprint, with no product manager on the team** `#leadership` `#delivery`
  - Situation: the platform team had no product manager. Goals arrived at the business level - the Kubernetes rollout, and feature requirements on the microservices the team owned - but nothing translated them into what the team actually worked on
  - Task: decide the team's work sprint by sprint against those goals
  - Action: chose what went into each sprint myself, balancing the business-level goals against the platform work the estate needed and the unplannable share described below - downtime and urgent requests from other teams
  - Contribution: mine. The larger goals were set by the business; turning them into sprint work was the technical lead's
  - Emphasise for: technical lead, platform, and any spec naming setting direction without a PM, owning a roadmap, or translating business goals into delivery

- **Planned sprint capacity from measured velocity, and reported delivery in the business's categories** `#delivery` `#leadership`
  - Situation: as the platform team, a sizeable share of each sprint went to work that could not be planned - downtime, and urgent requests from other teams
  - Action: planned sprint capacity from average velocity over previous sprints, normalised per person-day and adjusted for holidays and other absence, holding capacity back explicitly for the unplannable work rather than absorbing it as overrun. Around peak periods such as the start of the academic year the planned allocation was reduced further, keeping more capacity free for incident response, and planning always ran slightly ahead with tickets marked as pull-forward in the upcoming sprint. Reported sprint velocity back to the business broken down into the categories it cared about - product features, platform enhancements, bug fixes and incident response
  - Result: when reserved capacity went unused because incidents came in below expectation, the team drew from a longer-term plan of ready work rather than running out; and a shortfall in product work could be traced to its cause, such as a rise in incident response, rather than left unexplained
  - Contribution: run within the ceremonies I led; the estimates themselves stayed a collaborative team exercise
  - Emphasise for: engineering management, delivery, project management, and any spec naming delivery metrics, velocity, capacity planning or sprint reporting

- **Moved estimation out of sprint planning and into the daily stand-ups** `#delivery` `#leadership`
  - Situation: every piece of new work was estimated inside sprint planning, which made the meeting run long
  - Action: estimated new work in the daily stand-up instead, a little each day, so sprint planning arrived with the estimates already done
  - Result: planning no longer had to produce the estimates, and the estimating was spread across the sprint rather than concentrated in one session
  - Contribution: mine - I proposed the change and drove it. The estimating itself stayed a collaborative team exercise
  - Emphasise for: delivery, technical architecture, team lead, and any spec naming estimation, agile ceremonies or improving delivery process

- **Wrote and reviewed architectural decision records** `#architecture`
  - Situation: ADRs were introduced by a member of the front-end team, not by me
  - Action: wrote numerous ADRs across the extraction service and other projects, reviewed ADRs written by others, and specced the extraction API with the front-end team this way
  - Contribution: authoring and review; the practice was someone else's to introduce
  - Emphasise for: architecture, staff+ IC, roles naming design documentation or RFC culture

- **Owned delivery against the platform's customer SLAs, achieving 99.99% uptime across the estate** `#devops` `#leadership`
  - Situation: 99.9% uptime written into customer contracts, on the same terms for every customer rather than negotiated per institution
  - Task: deliver the estate against that commitment
  - Action: ran the on-call rota and the incident review process below as the machinery that met it
  - Result: 99.99% over the final 12 month period - a tenth of the downtime the contract allowed
  - Contribution: responsible for delivering against the SLA; the uptime itself is a team and platform achievement. The terms were set by the team handling contracts, with the CTO, and agreed with customers as they signed - not mine to write or negotiate
  - Emphasise for: SRE, platform, engineering management, and any spec naming SLAs, reliability targets or contractual uptime

- **Owned incident management across a 10-developer on-call rota** `#leadership` `#devops`
  - Situation: 24x7 support for all services, with 10 developers on a rota I was ultimately responsible for. The incident review was the meeting nobody wanted to attend when I took it on - long and tedious, and openly joked about as such - while still being necessary and genuinely useful. The long gap between sittings was the cause of the length: more to get through each time, and the same discussions repeated from the meeting before
  - Action: chaired the review meetings on past incidents and their resolutions, identifying weaknesses in processes and infrastructure so they could be addressed - explicitly focused on preventing recurrence rather than apportioning blame. Ran it more frequently and held it to incidents not already covered. The standing attendance was the other technical leads, the staff engineers and the technical architect; everyone on the 24x7 rota attended, and it was open to every other developer and to the rest of the business, with minutes published onwards. Chairing it meant delegating the remedial work the review identified out to those technical leads and their teams rather than absorbing it into my own, and reporting high-impact incidents back to senior management. Worked with product owners and customer support to ensure issues were communicated across the business in a timely manner
  - Result: the review went from around 90 minutes to around 20; 99.99% uptime over the final 12 months; stakeholders outside engineering knew what had been discussed and what was being done about it; and more junior developers had a way to learn how incidents were handled before they had to handle one themselves
  - Contribution: directly led - this was mine to own
  - Note: the room is what makes this cross-team rather than team-scoped. The authority ran across the technical leads of other teams, not only across my own six, and the reporting line for a high-impact incident ran from that meeting to senior management
  - Emphasise for: SRE, engineering management, platform, incident response, and any spec naming cross-team scope, multiple teams or stakeholder reporting

- **Recovered a production data loss I had caused myself** `#devops` `#leadership`
  - Situation: shortly after my probation period ended, so within the first months of the role, I set a lifecycle rule on a production S3 bucket that expired documents older than 90 days, and AWS applied it
  - Action: recognised what had happened, took it straight to the CTO rather than trying to quietly resolve it first, agreed a plan to reverse it, and followed that through
  - Contribution: mine, both the mistake and the recovery
  - Note: the habit is the point - say it early, say it to the person who needs to know, and spend the time on the recovery rather than on the explanation. It is the same standard the blameless incident review later asked of everyone else, set on myself first
  - On a CV: not selected. This is interview evidence for questions about owning a mistake or earning a team's trust, not a bullet for the page
  - Emphasise for: interview evidence of candour under pressure and of incident response

- **Led the Kubernetes rollout across the entire tech stack** `#devops` `#architecture`
  - Situation: the move was under active discussion when I joined and decided before I became technical lead, then stalled - nothing happened on it between the decision and my taking the team on
  - Action: restarted it in earnest about six months after becoming technical lead and led the implementation across the estate, on self-managed clusters rather than EKS. Roughly twelve months from restarting to the first service running in Kubernetes, and twelve to eighteen months start to finish
  - Result: implemented across the whole stack and completed during my tenure. Scaling moved from manual to automatic on demand for the majority of services, which raised utilisation of the underlying EC2 fleet, reduced infrastructure costs and cut the effort spent managing the infrastructure; deployment frequency improved, letting teams ship more often
  - Contribution: led the implementation across the estate, including restarting it after it had stalled. The decision to adopt Kubernetes was taken before I became technical lead and I was not party to it
  - Emphasise for: platform, SRE, infrastructure, migration delivery

- **Ran self-managed Kubernetes in production, and autoscaled the web and worker fleets** `#devops` `#architecture`
  - Situation: self-managed clusters rather than EKS, on an EC2 fleet, multi-availability-zone throughout
  - Action: ran cluster version upgrades, node group rotation and the scaling rules the clusters ran under, with the web tier on EC2 instances behind Auto Scaling Groups and workers scaled on the depth of the Resque job queues
  - Result: capacity followed the backlog rather than a schedule, and no single availability zone carried the platform
  - Contribution: my team's to run, and I led the team. The detailed cluster operations sat with the engineers performing them rather than with me
  - Emphasise for: platform, SRE, infrastructure, and any spec naming self-managed Kubernetes, cluster lifecycle, version upgrades, autoscaling or queue-driven scaling

- **Planned capacity and reserved instance commitments around a seasonal peak** `#devops` `#cost`
  - Situation: throughput rose by an order of magnitude at the start of the UK academic year in September, with a smaller peak in January
  - Action: set out the instance requirements and the reserved instance commitments matching steady-state need across the EC2 fleet - and more so once Kubernetes ran on it - holding on-demand capacity back to absorb the peaks rather than reserving for them
  - Contribution: my team's, and I led the team
  - Emphasise for: platform, SRE, infrastructure, FinOps, and any spec naming capacity planning, cloud cost or reserved instances

- **Found and removed unmanaged AWS spend using Cost Explorer** `#devops` `#cost`
  - Situation: money going on resources nobody was using - EBS volumes left behind after the instances they belonged to had gone, and snapshots kept well past the retention period we had set ourselves, because the lifecycle rules meant to expire them were not doing so. The retention policy held on paper while the storage kept accumulating
  - Action: analysed the account in Cost Explorer to find it, removed the orphaned resources and corrected the lifecycle rules
  - Result: the cleanup held rather than needing to be repeated. The saving is not available as a figure
  - Contribution: mine
  - Emphasise for: FinOps, platform, DevOps, and any spec naming cloud cost management or AWS cost optimisation

- **Managed a team of six** `#leadership` `#mentoring`
  - Situation: a team of six including me and five reports, one of them at the company's Staff Engineer grade
  - Action: owned the one-to-ones and mentorship outright and ran performance reviews jointly with the CTO. One-to-ones with each developer weekly to fortnightly, wider in scope than the work - how the person was doing generally, and whether there was anything the business could do to help. Trust ran both ways: alongside admitting my own mistakes openly, developers were given real responsibility and the room to prove themselves capable in it rather than being supervised until they had, and decisions I made were open to challenge from the team, and were challenged
  - Result: the regularity is what made the feedback continuous rather than something saved up for a review
  - Contribution: sole owner of the day-to-day management relationship; the review cycle was shared with the CTO
  - Emphasise for: engineering management, team lead, and any spec asking for experience managing engineers at staff level

- **Shielded the development team from interruption so they could concentrate** `#leadership` `#delivery`
  - Situation: questions, requests and escalations from elsewhere in the business reaching developers directly
  - Action: took them myself instead, cut the standing weekly meetings by folding what they covered into the daily stand-up in smaller pieces, and rerouted the hot-fix channel described below for the same reason
  - Result: the team had uninterrupted stretches to work in
  - Contribution: mine. The wider culture and the office environment were already good and were not my doing - what I changed was the team's exposure to interruption
  - Emphasise for: engineering management, team lead, and any spec asking how a manager protects focus time or supports the people doing the work

- **Helped developers gain promotions and meet their career goals** `#leadership` `#mentoring`
  - Situation: a developer role checklist that already existed when I arrived, setting out every level from junior developer through developer and senior developer to technical lead, and the attributes the company expected at each. It gave people a way to evidence that they had met a level
  - Action: worked through the checklist with each person in one-to-ones to establish what they still had to demonstrate, then made sure sprint planning put work in front of them where they could demonstrate exactly that - so the framework drove what people were given to do, rather than only being an assessment at review time
  - Result: two promotions - one junior developer to developer, and one developer to senior developer, each within about a year of that person joining the company
  - Contribution: the framework was the company's; using it to route work, and pushing both cases forward, was mine
  - Emphasise for: engineering management, staff+ IC, team lead

- **Brought an underperforming engineer up to the team's standards through a performance plan, and closed the side channel feeding the problem** `#leadership` `#mentoring`
  - Situation: in 2022, an engineer joined the team from another department of the business, where engineering practices differed - it was common there for product managers to contact engineers directly, and for fixes to be applied by connecting directly to instances. Neither was how this team worked, and some of those hot fixes caused more serious issues when their side effects had not been fully thought through
  - Action: opened with a joint discussion between the engineer, the CTO and me, then followed up in the regular one-to-ones, where the practice was worked through, formalised as a performance plan, and its adherence checked. Told the product manager that going directly to engineers was no longer acceptable - work came through the team and was scheduled, and urgent fixes went through the incident management process. The change added steps and could delay a fix, and met resistance for it, from the product owner whose route it closed rather than from anyone in engineering. The case for it was the harm the unreviewed hot fixes had already caused, and I had the CTO's backing in holding the line
  - Result: the direct-to-engineer hot fixes stopped, the product manager routed work through the correct channels, and the engineer met the team's standards and stayed on the team - a difficult first couple of months, then resolved
  - Contribution: worked alongside the CTO throughout. This was my first leadership role in technology, and the workflow was collaborative - I proposed ideas and learned from the CTO as we went. The one-to-ones were mine to run
  - Note: 2022 is recalled as the year rather than a precise date - render as "2022" rather than asserting a month
  - Emphasise for: engineering management, team lead, and any spec naming performance management, underperformance, engineering standards or ways of working

- **Upskilled the wider development team on Kubernetes and serverless** `#mentoring` `#architecture`
  - Situation: weekly tech talks were an established expectation of all developers when I arrived, in a culture built around self-development, across a development team of 30 people beyond my own team of six
  - Action: my team took on educating the rest of engineering in the technologies we were adopting, including the Kubernetes migration and serverless
  - Contribution: my team supplied the Kubernetes and serverless content within that existing forum
  - Emphasise for: staff+ IC, platform advocacy - evidence of contributing to an established learning culture

- **Cut local environment setup from days to hours, and made shipping on day one real** `#delivery` `#devops` `#mentoring`
  - Situation: a couple of days to get a local environment working, at the point I joined in September 2018
  - Task: a developer should be able to commit, get reviewed, merge and release to production on their first day of work. I pushed this consistently as the standard onboarding should be held to
  - Action: adopted Docker for local development, and a CLI tools repo that stood the entire stack up locally with a single command
  - Result: down to a matter of hours by the time I left, most of it spent waiting for Docker images to download, and several developers - including members of my own team - shipped to production within their first day
  - Contribution: the case for the standard was mine, as was starting the CLI tooling behind it (below). Getting to a first-day release took a lot of moving parts and was not mine alone
  - Emphasise for: platform, developer experience, engineering management, roles naming onboarding or time-to-first-commit

- **Started the internal CLI tooling, then deliberately handed it to the team** `#delivery` `#devops` `#mentoring`
  - Situation: individual bash scripts were being passed from developer to developer as people joined
  - Action: consolidated them into a single repo with a structure that made them easy to share and extend, presented the tools and their uses to the whole tech team, then left it open for developers to add their own as they saw fit - which they did, and it grew organically from there. Once the project was well established, tooling was built inside sprints as part of the Kubernetes migration, so the tooling for the new platform existed from the day the platform did
  - Result: the tools ended up carrying production deployments - once Ansible was deprecated, Hubot ran releases through this tooling instead of through playbooks. Seeded rather than owned: distributing the ownership on purpose is why it kept growing without me, far enough that something started as a way to share bash scripts became the deployment path for the estate
  - Contribution: the idea for a suite of tools was mine, as were the first couple of tools in the repo
  - Emphasise for: platform, developer experience, staff+ IC, internal tooling, roles naming developer productivity

- **Introduced AWS CDK and built an internal constructs library** `#devops` `#architecture`
  - Situation: the estate used Terraform, Ansible and Puppet, and different projects had settled on different serverless tooling - the Serverless Framework, SAM Local and LocalStack. That experimenting predated me, and I worked in those projects but started no new development on any of the three. The cost being paid was context-switching: an engineer moving between projects met a different framework in each
  - Task: consolidate onto one toolchain
  - Action: chose CDK, whose release had made a first-party option available. The reasoning was longevity and currency - AWS is less likely to drop its own tool than a third party is to stop maintaining theirs, and first-party tooling tracks new services rather than lagging behind them - and the trial was a proof that CDK fitted the existing workflow rather than a comparison between candidates, tested against real AWS rather than local emulation. Beyond adopting it, built an own constructs library to standardise common patterns: SQS queues provisioned with dead letter queues and automatic alerting into PagerDuty as a single construct, and API Gateway endpoints with their monitoring attached the same way
  - Result: CDK became the default for new infrastructure and Ansible and Puppet were deprecated, with Terraform staying in place for the estate-wide resources described below. The constructs library was used by every microservice deployed serverless, around half a dozen of them, and by the whole development team of 30 rather than only my own team of six
  - Contribution: team adoption, own constructs library
  - Note: this is platform work proper - making the right thing the easy thing for every other engineer, rather than just picking a tool
  - Emphasise for: platform, DevOps, infrastructure, developer experience

- **Provisioned the estate's global and networking infrastructure in Terraform** `#devops` `#architecture`
  - Situation: the estate-wide resources that sit underneath and across every service, already held in Terraform
  - Action: wrote and owned the Terraform for predominantly global resources - IAM chief among them - alongside VPC and VPN configuration, subnets, and legacy data stores including S3, plus connections between VPCs in different regions carrying data transfer between them for a small number of specific cases
  - Contribution: wrote and owned the Terraform for these resources
  - Note: why Terraform rather than CDK - these resources stayed in the tool that already held them while CDK took new per-service infrastructure
  - Emphasise for: platform, DevOps, infrastructure, cloud networking, and any spec naming Terraform specifically

- **Proposed restructuring the AWS estate onto Organizations with per-developer accounts** `#devops` `#architecture` `#leadership`
  - Situation: two accounts, production and development, shared across the engineering function
  - Action: proposed a single AWS Organization with many accounts beneath it, including a development and playground account for each developer, so that experimentation could not reach anything shared
  - Result: not taken forward. A migration from Google to Microsoft Teams was running at the same time and was time-sensitive, and the account restructure was judged too large to take on alongside it
  - Contribution: mine to propose; the decision not to proceed was taken with the business, on sequencing rather than on the merits
  - On a CV: not selected by default - a proposal that did not ship is interview material rather than a bullet. Where a spec names AWS Organizations, multi-account strategy or landing zones, the honest line is the proposal and the reasoning behind it, never an implementation
  - Emphasise for: interview evidence of estate-wide structural change argued for from a team lead seat

- **Held secrets in Consul, and implemented AWS Secrets Manager across the serverless projects** `#devops` `#security`
  - Situation: Consul, already in place when I joined in September 2018
  - Action: implemented AWS Secrets Manager as part of the serverless projects built during the role
  - Contribution: Consul predated me and was operated rather than introduced; Secrets Manager was my team's to implement
  - Note: the same Secrets Manager pattern is used at Parsons Group, so it is current rather than historical - see `roles/2022-parsons-group-director-sole-developer.md`
  - Emphasise for: platform, DevOps, security, and any spec naming secrets management or operational security practices

- **Ran MongoDB self-managed on EC2, replicated across availability zones** `#devops` `#data` `#architecture`
  - Situation: MongoDB on EC2 instances rather than a managed database service
  - Action: operated it as a replicated cluster - read-write replicas distributed across multiple availability zones, with read replicas alongside them carrying read traffic off the write path
  - Result: no single zone held the datastore. Still self-managed on EC2 in April 2023, at the end of the tenure - it was not migrated onto a managed service
  - Contribution: my team's to build and operate. I led that team and worked in the cluster, rather than standing the topology up single-handed
  - Emphasise for: platform, SRE, infrastructure, and any spec drawing a line between databases operated and databases consumed

- **Took ownership of the streaming analytics pipeline and moved it onto CDK** `#devops` `#data` `#architecture`
  - Situation: Kinesis streams feeding Kinesis Data Analytics, which ran the aggregations over time windows, with Kinesis Firehose for delivery and Amazon Redshift as the warehouse - built before my team held it, and running in production by the time it came to us
  - Action: developed the pipeline further, and moved it from a hand-rolled deployment onto AWS CDK
  - Result: provisioned the same way as the rest of the new infrastructure
  - Contribution: my team's to own, develop and re-platform. I led that team
  - Emphasise for: platform, data engineering, and any spec naming streaming, event streaming, real-time data, Kinesis or a data warehouse

- **Found and fixed incorrect aggregations of customer data in the streaming pipeline** `#data` `#devops` `#architecture`
  - Situation: aggregations over customer event data coming out wrong, raised with us by customers. Inherited with the pipeline rather than introduced by my team, and one of the first pieces of work we were given after taking it on
  - Action: traced it to Kinesis Data Analytics applications configured with a time window larger than the service documentation allowed, and corrected them
  - Contribution: my team diagnosed it and implemented the fix. I led that team
  - Emphasise for: platform, data engineering, distributed systems, and any spec naming production debugging, streaming or real-time data

- **Took the platform multi-region when US customers wanted their data held locally** `#devops` `#architecture`
  - Situation: a multi-tenanted SaaS platform serving universities, with tenants sharing the platform and isolation enforced in the application and data layers - the multi-tenancy in place before I joined. Customers in the US region wanted their data held locally, North American expansion was already in the sales pipeline, and the first customer to arrive was promised data in their own region as part of winning them. Provisioning followed that commitment rather than preceded it, so the date was set outside engineering
  - Task: hold US customer data in its own region, to a date set by the sale
  - Action: built the multi-region deployment. One component was due for deprecation and awkward to stand up again in the new region, so the US and Canada deployment used the EU region's instance of it instead, over VPC peering that already existed between the two - it held nothing subject to residency
  - Result: the commitment to the customer was met exactly, and serving those users from a nearer region cut latency as well. The residency line was drawn around the data rather than around every component, and the effort went where it changed the answer
  - Contribution: built and owned the multi-region deployment
  - Emphasise for: platform, DevOps, infrastructure, and any spec naming multi-region deployment, data residency or multi-tenancy

- **Conducted candidate interviews throughout the role** `#hiring`
  - Situation: hiring decisions were taken collectively by the interviewing team rather than resting with a single hiring manager. A candidate was interviewed by a panel of six, and a no from any one of them was decisive at that stage - the panel had to agree rather than out-vote, which put the standard in every interviewer's hands, including the most junior on the panel
  - Action: interviewed candidates throughout the role, and have been in the minority in saying no to a candidate, though not as the only objector
  - Contribution: interviewed throughout and shared in the decisions; mine was one voice in each, not the casting one, and the process was the company's
  - Emphasise for: engineering management, hiring-involved IC roles

- **Answered the technical sections of university tender documents** `#stakeholder` `#security`
  - Situation: tender documents from universities in the UK, Canada and the United States, covering disaster recovery, data residency and other compliance requirements alongside the general technical questions
  - Action: translated how the platform actually worked into answers a procurement panel could evaluate
  - Contribution: helped complete the technical responses
  - Emphasise for: engineering management, solutions architecture, edtech, and any role with bid, pre-sales, procurement or compliance exposure

- **Helped oversee the migration from G Suite to Microsoft Teams** `#delivery`
  - Situation: one of the last pieces of work before leaving
  - Action: helped oversee the transition across the business
  - Contribution: shared oversight of the transition
  - Emphasise for: engineering management, delivery, platform migration

- **Acted as the point of contact for cross-business stakeholder requests** `#leadership`
  - Action: handled cross-business stakeholder requests - data deletion requests, and providing incident summaries
  - Emphasise for: engineering management, roles with compliance exposure

## Technical surface

- **Languages:** Node.js, TypeScript, Bash, PHP (legacy, being migrated away from)
- **Frameworks and job processing:** Fat-Free Framework (F3) and Resque (php-resque) on the inherited extraction service, both migrated away from
- **Cloud, compute and orchestration:** AWS, serverless, microservices, with Amazon API Gateway fronting the serverless REST APIs; self-managed Kubernetes rather than EKS, on a fleet of EC2 instances; Auto Scaling Groups for the web tier and for workers scaled on Resque queue depth, multi-availability-zone throughout. On the inherited stack the Resque workers were replaced by a serverless workflow, and the MongoDB cluster stayed on EC2 throughout
- **Platform shape:** a multi-tenanted SaaS platform, tenants sharing the platform with isolation enforced in the application and data layers, deployed across multiple AWS regions. The multi-tenancy predated me; the multi-region deployment was mine to build and own
- **Document processing:** conversion of documents, images, video and audio into proprietary internal formats consumed by the e-book reader, on which its commenting and annotation were built; text extraction from PDF with coordinate data; normalisation of EPUB, docx and other document formats to PDF via an external conversion API
- **Infrastructure as code:** AWS CDK (introduced during the role) as the default for new per-service infrastructure, alongside Terraform, which held the estate-wide resources - IAM and other global resources, VPC and VPN configuration, subnets, and legacy data stores including S3. The Serverless Framework, SAM Local and LocalStack were trialled hands-on for serverless work and local development before CDK was settled on. Ansible carried deployments until it was deprecated, on playbooks I maintained rather than wrote from scratch; Puppet deprecated
- **Secrets management:** Consul, pre-existing on the estate; AWS Secrets Manager, implemented for the serverless projects
- **Datastores:** MongoDB - self-managed on EC2 as a replicated cluster spanning availability zones, with read replicas, rather than a managed service - alongside PostgreSQL on RDS, deployed Multi-AZ and my team's to operate, and DocumentDB and DynamoDB
- **Search and caching:** Elasticsearch, used substantially across the platform; Redis on an ElastiCache cluster, carrying caching and queues
- **Web serving:** nginx
- **Streaming and analytics:** Kinesis streams, Kinesis Data Analytics for windowed aggregations, Kinesis Firehose, and Amazon Redshift as the warehouse
- **Testing:** Jest for Node.js. On the serverless projects, unit tests ran locally and a dedicated test environment was deployed during the build for E2E and integration tests against real AWS - no local emulation of AWS services. Developers could also deploy the stack to an environment of their own when they needed one
- **CI/CD:** CircleCI for continuous integration across the estate, with GitHub Actions running tests and building artifacts on some newer services towards the end of the tenure; deployments triggered from Slack through Hubot, which ran Ansible playbooks at first and the internal CLI tools once Ansible was deprecated - ChatOps throughout, rather than continuous deployment or a reconciliation loop
- **Observability:** Prometheus for metrics and Loki for log aggregation, with Grafana and CloudWatch for dashboards; PagerDuty for alerting and paging, wired into provisioned infrastructure by default via the internal CDK constructs. The Prometheus and Loki stack was built by my team; I worked in it daily and ran incident management on top of it rather than setting it up
- **Local development:** Docker, with a CLI tools repo bringing the whole stack up locally in one command
- **Tooling:** a set of internal CLI tools for developer productivity, written in Bash; an internal AWS CDK constructs library for standardised infrastructure patterns
- **Collaboration:** G Suite, then Microsoft Teams following the migration
- **Ways of working:** 24x7 on-call rota, blameless incident review; daily stand-ups, sprint planning, mid-sprint and end-of-sprint reviews, with new work estimated collaboratively in the stand-ups

**Scope:** a back-end and platform role throughout - no front-end development.

**Figures not available:** interviews conducted, incident volumes, the cost saving on the PHP to serverless migration, how long the extraction service had gone without active development, any throughput or corpus figures for it, the time sprint planning took before and after estimation moved out of it, the deployment-frequency, utilisation and cost gains from the Kubernetes rollout, and how long the performance plan ran before the issues were resolved.

## Tailoring notes

- **Access control and network policy were AWS-layer, not Kubernetes-layer.** Roles and service accounts were configured through AWS IAM, and network segmentation through VPC, subnet and VPN configuration. The clusters were not governed by Kubernetes RBAC objects or by Kubernetes Network Policies. Platform specs often name both layers in a single line as though they were one skill; the IAM and the VPC work answer the AWS half precisely, and the Kubernetes half is a different set of objects.

- **Estimation is one story told in two bullets, and the second one leads.** Architect and technical lead specs routinely ask for estimation alongside architecture and requirements work. The ceremonies bullet carries the responsibility - four ceremonies run across four years, with estimation inside them - and the stand-up change carries the judgement: a problem, a decision that was mine, and what followed. Where only one line is available, spend it on the change, because a responsibility is a job description and a change is evidence. The estimating itself was the team's and both bullets say so

- **Leads for hands-on roles:** the extraction service arc - picked up stale, extended, debugged, then migrated off F3 to serverless. Told end to end it is the strongest hands-on evidence in the history, and the concurrency fix is the most technically specific thing in it. The Kubernetes work follows
- **The CV states the final title only, for the whole tenure, and renders it as Platform Technical Lead.** The `title_history` above is the record and carries the grade as the company wrote it; the team led was the platform team, and naming it in the heading is what tells a platform spec at a glance which part of the estate this was. A CV heading does not need to narrate the promotion
- **The estate was microservices with a team behind each, so service boundaries were team boundaries.** Where two services had to interact, the work ran between the teams owning them as much as between the codebases - the extraction API was specced with the front-end team that consumed it, and a sizeable share of the platform team's sprint went to requests arriving from other teams. Bring this forward for any spec naming cross-team collaboration, shared services, internal customers or coordinating between service owners
- **The work from the Senior Developer years still goes on the CV**, just without being labelled by the title held at the time. September 2018 to March 2020 is sole-developer ownership of a service another team's product depended on, and - from around March 2019 - running the team's ceremonies. Both are among the strongest evidence in the role and neither depends on the title to land
- **On the Kubernetes rollout, the claim is the rollout.** The bullet says what was led - the implementation across the estate, completed within the tenure - and does not narrate the adoption decision, which sat elsewhere. Saying what was led is already precise, and a CV bullet that claims the implementation cannot be read as claiming the choice. The decision only needs raising where a spec asks who selected the platform
- **On the CDK bullet, the claim ends at the constructs library.** What CDK replaced is context, not achievement: Ansible and Puppet are named above because the record should be complete, but a CV line spent on retired tooling buys nothing, and the Terraform bullet already says which resources stayed where. Bring the deprecation forward only for a spec naming Ansible or Puppet, or one asking about consolidating a mixed IaC estate. For a spec naming the Serverless Framework, SAM or LocalStack, the evidence is the evaluation - trialled hands-on, then CDK chosen, with testing against real AWS rather than local emulation. That is a tool-selection story, not production use, and the skills grid should not carry those tools as working ones
- **The MongoDB cluster is the evidence for "operated, not consumed".** Platform and persistence specs increasingly draw that line in as many words, and DocumentDB, DynamoDB and RDS sit on the wrong side of it - the Multi-AZ Postgres was operated by the team but the service was managed, so it answers a spec naming RDS rather than one naming self-managed persistence. Self-managed replicas on EC2, spanning availability zones, sit on the right side. Bring it forward for any spec naming distributed databases, replication, self-managed persistence or high availability at the data layer; leave it off where the datastore is incidental to the role. The attribution is shared, and the bullet says so - the team built and ran it, and I led the team
- **The reliability commitment was an SLA, not an SLO.** 99.9% uptime, written into customer contracts and set outside engineering. There was no separate internal objective held stricter than the contractual one, and no error budget governing what the team worked on. Platform and SRE specs increasingly name SLOs, SLAs and error budgets together as though they were one requirement - where they do, the SLA bullet answers the part that exists, and the on-call rota and blameless incident review carry the rest. The three are different artefacts and an interviewer who runs them will hear the difference
- **The Kinesis pipeline is the answer to "streaming platforms".** Platform specs routinely list distributed systems, event-driven architecture and streaming as alternatives; the first two are answered several times over across the history, and this is the only evidence for the third. It is also the second inherited-system arc in this role, and it runs the same course as the extraction service - taken on, debugged, then re-platformed. Two independent instances of that arc are the pattern worth naming for a spec asking about maturing what already exists
- **Secrets management spans two roles, and the current one is Secrets Manager.** Consul predates me here and Secrets Manager was adopted for the serverless work; the same pattern is in daily use at Parsons Group. For a spec naming secrets management, lead with Secrets Manager and let Consul carry the breadth. Where a spec pairs it with RBAC, the evidence is the IAM policy in the Terraform above and the tenant isolation in the application and data layers
- **Leads for leadership roles:** incident review process and developer promotions
- **The promotions and the performance plan are the two directions of one competency.** A manager screen reads for both: developing people upwards and managing underperformance. Where a spec names performance management, underperformance or difficult conversations, the performance-plan bullet leads and the promotions bullet supports; where it names growth or career development, the order reverses. The performance-plan case also answers specs about raising or holding engineering standards, because the resolution ran through process - scheduling and incident management - rather than through the individual alone
- **Leads for client-facing or pre-sales roles:** the tender work - technical depth translated for a non-engineering audience, against international university procurement, which few backend CVs carry
- **Domain keywords:** higher education, edtech, tender response, disaster recovery, data residency, data sovereignty, compliance, multi-region, multi-tenancy
- **Note:** this is the longest role at 4 years 7 months and carries most of the leadership evidence
- **Both 2023 AWS certifications were earned during this role.** They are recorded in `qualifications.md`, but worth knowing the certs and this tenure are the same period - it evidences the self-development culture point rather than sitting as an unconnected line
