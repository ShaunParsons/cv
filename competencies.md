---
type: competencies
---

# Competencies and skills

Source of truth for the `Key Competencies` and `Technical Skills` grids on the CV. Same rules as `roles/*.md`: a superset of what any single CV shows, and every item traces to evidence in a role file or `profile.md` - an item with no source behind it does not go on a CV, however well it matches a spec.

The grids render as labelled lines - a bold group label, then its items comma-separated - running the full width of the page, a shape chosen for how an applicant tracking system parses the PDF: a full-width line extracts as written. Selection is the register's job: pick the items the spec makes strongest, grouped under labels drawn from the sections below and ordered as the register weights them. The names here are the names to use on the page - keeping them stable keeps keyword matching consistent from one application to the next.

## Key Competencies

Grouped by what they evidence. The groups also supply the bold labels on the page - Leading, Building, Operating - though a tailored CV may regroup or relabel where the spec reads better.

Building:

- **Serverless Architecture** - Talis Education, Parsons Group
- **Event-Driven Architecture** - Parsons Group (event sourcing, CQRS), Talis Education (Kinesis streaming)
- **Multi-Tenant SaaS** - Talis Education, Opilio Technologies
- **Multi-Region Deployment** - Talis Education
- **Infrastructure as Code** - Talis Education (CDK, Terraform), Parsons Group (CDK)
- **API Design** - Talis Education (extraction API, specced cross-team), Farmfoods (RESTful API)
- **Data Protection** - Parsons Group (PII held apart from the event log and expired by TTL), Farmfoods (worked inside PCI scope), Talis Education (Secrets Manager, IAM, in-region data for North American customers)
- **Automated Testing** - Amigo Technology, Talis Education, Opilio Technologies
- **CI/CD** - every role from Amigo Technology onwards
- **Greenfield Product Development** - Opilio Technologies, Parsons Group, Talis Education (internal CDK constructs library)

Leading:

- **Technical Leadership** - Talis Education
- **Engineering Management** - Talis Education (team of six, five reports)
- **Mentoring** - Talis Education (two promotions, wider team upskilled)
- **Incident Management** - Talis Education (24x7 rota, 99.99% uptime)
- **Capacity Planning** - Talis Education (sprint capacity and infrastructure both)
- **Agile Delivery** - Talis Education (ceremonies, velocity reporting)
- **Hiring** - Talis Education (candidate interviews throughout)

Operating:

- **Stakeholder Management** - Farmfoods (board level), Talis Education (tenders), Opilio Technologies (prospective clients)
- **Project Management** - Parsons Group (markets against a fixed date), Talis Education (sprint delivery)
- **Supplier Management** - Parsons Group
- **Cost Engineering** - Parsons Group (sub-$10 platform), Talis Education (reserved instance planning)
- **Developer Experience** - Talis Education (onboarding, CLI tooling, CDK constructs)
- **Product-Minded Engineering** - Opilio Technologies (rebuild prioritised from client feedback)
- **AI-Assisted Development** - this repository; the register in `CLAUDE.md` governs when it may lead

## Technical Skills

Working skills only - each with the role files behind it. The exposure list at the end exists so the line between the two never has to be re-derived.

Languages and runtimes:

- **Node.js** - Talis Education, Parsons Group, Opilio Technologies, Amigo Technology
- **TypeScript** - Talis Education
- **JavaScript** - throughout
- **Bash** - Talis Education (internal CLI tooling)
- **PHP** - Talis Education, Farmfoods; legacy work, migrated away from

Front end:

- **Vue.js** - Parsons Group, Opilio Technologies
- **React** - Amigo Technology

AWS:

- **AWS Lambda**, **SQS & SNS**, **EventBridge** - Parsons Group, Talis Education
- **API Gateway** - Talis Education (serverless APIs), Parsons Group (REST APIs powering the front end)
- **DynamoDB** (with Streams) - Parsons Group, Talis Education
- **Kinesis** and **Redshift** - Talis Education (streaming analytics pipeline)
- **RDS PostgreSQL** - Talis Education (Multi-AZ)
- **ElastiCache Redis** - Talis Education (caching and queues)
- **EC2 & Auto Scaling** - Talis Education
- **S3**, **CloudFront**, **Cognito** - Parsons Group, Talis Education
- **Secrets Manager** - Talis Education, Parsons Group
- **CloudWatch**, **IAM** - Talis Education, Parsons Group

Datastores beyond AWS:

- **PostgreSQL** - Amigo Technology (PL/pgSQL, complex CTEs, pgTAP), Opilio Technologies, Farmfoods
- **MongoDB** - Talis Education (self-managed replicated cluster on EC2)
- **MySQL** - Farmfoods (tuning at 300 million rows plus)
- **Elasticsearch** - Talis Education
- **Redis** - Talis Education

Infrastructure and operations:

- **AWS CDK** - Talis Education (introduced, constructs library), Parsons Group
- **Terraform** - Talis Education (estate-wide resources)
- **Kubernetes** - Talis Education (self-managed, whole-stack rollout)
- **Docker** - Talis Education
- **Linux** - `profile.md` (Ubuntu as the daily driver throughout), Talis Education (the EC2 fleet and self-managed Kubernetes ran on it)
- **nginx** - Talis Education, Amigo Technology
- **Consul** - Talis Education (operated, not introduced)

CI/CD and observability:

- **CircleCI** - Talis Education, Amigo Technology
- **GitHub Actions** - Talis Education, Parsons Group
- **Prometheus**, **Loki**, **Grafana** - Talis Education (daily use; the stack was the team's to build)
- **PagerDuty** - Talis Education

Testing:

- **Jest** - Talis Education
- **pgTAP** - Amigo Technology

Tooling and integrations:

- **Git** - throughout; earns its own slot per `profile.md`
- **Claude Code** - this repository
- **Heroku** - Amigo Technology, Opilio Technologies
- **Sequelize** - Opilio Technologies (own tenant-isolation layer on top)
- **Salesforce** - Amigo Technology
- **Klaviyo** - Parsons Group
- **Shopify, Etsy, eBay & Amazon APIs** - Parsons Group

### Exposure, not working skills

Never listed in the grid. Where a spec names one, the honest line is the story, told in a bullet, not a grid entry that claims fluency:

- **Go** - a couple of places at Amigo Technology, nowhere else
- **Serverless Framework, SAM, LocalStack** - already in use across projects at Talis Education when I joined, and worked in, but no new development started on any of them; CDK consolidated the estate onto one toolchain. Where a spec names one, the honest line is the consolidation, not fluency in the tool
- **Ansible, Puppet** - operated then deprecated at Talis Education
- **Backbone.js, Marionette, jQuery** - Farmfoods only, and dated; describe the reporting suite by what it did unless the spec names them
- **Laravel, Fat-Free Framework (F3)** - maintained or migrated away from, never chosen

## Tailoring notes

- **Three or four labelled lines per grid, and the register orders them.** The project management register weights `Key Competencies` over `Technical Skills` and the section order can follow; the senior developer register does the reverse. `CLAUDE.md` carries the registers.
- **The grids select, they never coin.** A spec asking for a technology not listed here is answered in the assessment or the covering note, not by a grid item - adding one starts an interview about the weakest claim on the page.
- **Names stay as written.** "AWS CDK" not "CDK", "PostgreSQL" not "Postgres", "SQS & SNS" as a pair - consistent naming is what lets the same true claim match the same keyword every time.
- **A name is a term, not a clause.** The lines run full-width, so length does not decide a name - "Event-Driven Architecture" and "Greenfield Product Development" fit as written. What matters is that a grid line reads as a run of the crisp terms a spec searches on, and renaming changes what a name matches, so it is a decision to take here, once, rather than improvised per generation. Every line carries a bold group label - `scripts/validate_cv.py` warns on one that reaches a grid without it.
