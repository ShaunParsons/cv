---
type: competencies
---

# Competencies and skills

Source of truth for the `Key Competencies` and `Technical Skills` grids on the
CV. Same rules as `roles/*.md`: a superset of what any single CV shows, and
every item traces to evidence in a role file or `profile.md` - an item with no
source behind it does not go on a CV, however well it matches a spec.

The grids render as three-column flat lists, and around twelve items each
fills four rows cleanly. Selection is the register's job: pick the twelve that
the spec makes strongest, in the order the register weights them. The names
here are the names to use on the page - keeping them stable keeps keyword
matching consistent from one application to the next.

## Key Competencies

Grouped by what they evidence. The groups are a selection aid, not headings
for the CV - the grid stays flat.

Building:

- **Serverless Architecture** - Talis Education, Parsons Group
- **Event-Driven Architecture** - Parsons Group (event sourcing, CQRS), Talis
  Education (Kinesis streaming)
- **Multi-Tenant SaaS** - Talis Education, Opilio Technologies
- **Multi-Region Deployment** - Talis Education
- **Infrastructure as Code** - Talis Education (CDK, Terraform), Parsons Group
  (CDK)
- **API Design** - Talis Education (extraction API, specced cross-team),
  Farmfoods (RESTful API)
- **Automated Testing** - Amigo Technology, Talis Education, Opilio
  Technologies
- **CI/CD** - every role from Amigo Technology onwards
- **Greenfield Product Development** - Opilio Technologies, Parsons Group

Leading:

- **Technical Leadership** - Talis Education
- **Engineering Management** - Talis Education (team of six, five reports)
- **Mentoring** - Talis Education (two promotions, wider team upskilled)
- **Incident Management** - Talis Education (24x7 rota, 99.99% uptime)
- **Capacity Planning** - Talis Education (sprint capacity and infrastructure
  both)
- **Agile Delivery** - Talis Education (ceremonies, velocity reporting)
- **Hiring** - Talis Education (candidate interviews throughout)

Operating:

- **Stakeholder Management** - Farmfoods (board level), Talis Education
  (tenders), Opilio Technologies (prospective clients)
- **Project Management** - Parsons Group (markets against a fixed date), Talis
  Education (sprint delivery)
- **Supplier Management** - Parsons Group
- **Cost Engineering** - Parsons Group (sub-$10 platform), Talis Education
  (reserved instance planning)
- **Developer Experience** - Talis Education (onboarding, CLI tooling, CDK
  constructs)
- **Product-Minded Engineering** - Opilio Technologies (rebuild prioritised
  from client feedback)
- **AI-Assisted Development** - this repository; the register in `CLAUDE.md`
  governs when it may lead

## Technical Skills

Working skills only - each with the role files behind it. The exposure list at
the end exists so the line between the two never has to be re-derived.

Languages and runtimes:

- **Node.js** - Talis Education, Parsons Group, Opilio Technologies, Amigo
  Technology
- **TypeScript** - Talis Education
- **JavaScript** - throughout
- **Bash** - Talis Education (internal CLI tooling)
- **PHP** - Talis Education, Farmfoods; legacy work, migrated away from

Front end:

- **Vue.js** - Parsons Group, Opilio Technologies
- **React** - Amigo Technology

AWS:

- **AWS Lambda**, **SQS & SNS**, **EventBridge** - Parsons Group, Talis
  Education
- **DynamoDB** (with Streams) - Parsons Group, Talis Education
- **Kinesis** and **Redshift** - Talis Education (streaming analytics
  pipeline)
- **RDS PostgreSQL** - Talis Education (Multi-AZ), Parsons Group (before the
  move to DynamoDB)
- **ElastiCache Redis** - Talis Education (caching and queues)
- **EC2 & Auto Scaling** - Talis Education
- **S3**, **CloudFront**, **Cognito** - Parsons Group, Talis Education
- **Secrets Manager** - Talis Education, Parsons Group
- **CloudWatch**, **IAM** - Talis Education, Parsons Group

Datastores beyond AWS:

- **PostgreSQL** - Amigo Technology (PL/pgSQL, complex CTEs, pgTAP), Opilio
  Technologies, Farmfoods
- **MongoDB** - Talis Education (self-managed replicated cluster on EC2)
- **MySQL** - Farmfoods (tuning at 300 million rows plus)
- **Elasticsearch** - Talis Education
- **Redis** - Talis Education

Infrastructure and operations:

- **AWS CDK** - Talis Education (introduced, constructs library), Parsons
  Group
- **Terraform** - Talis Education (estate-wide resources)
- **Kubernetes** - Talis Education (self-managed, whole-stack rollout)
- **Docker** - Talis Education
- **nginx** - Talis Education, Amigo Technology
- **Consul** - Talis Education (operated, not introduced)

CI/CD and observability:

- **CircleCI** - Talis Education, Amigo Technology
- **GitHub Actions** - Talis Education, Parsons Group
- **Prometheus**, **Loki**, **Grafana** - Talis Education (daily use; the
  stack was the team's to build)
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

Never listed in the grid. Where a spec names one, the honest line is the
story, told in a bullet, not a grid entry that claims fluency:

- **Go** - a couple of places at Amigo Technology, nowhere else
- **Serverless Framework, SAM, LocalStack** - trialled hands-on at Talis
  Education before CDK was chosen; a tool-selection story, not production use
- **Ansible, Puppet** - operated then deprecated at Talis Education
- **Backbone.js, Marionette, jQuery** - Farmfoods only, and dated; describe
  the reporting suite by what it did unless the spec names them
- **Laravel, Fat-Free Framework (F3)** - maintained or migrated away from,
  never chosen

## Tailoring notes

- **Around twelve items per grid, and the register orders them.** The project
  management register weights `Key Competencies` over `Technical Skills` and
  the section order can follow; the senior developer register does the
  reverse. `CLAUDE.md` carries the registers.
- **The grids select, they never coin.** A spec asking for a technology not
  listed here is answered in the assessment or the covering note, not by a
  grid item - adding one starts an interview about the weakest claim on the
  page.
- **Names stay as written.** "AWS CDK" not "CDK", "PostgreSQL" not "Postgres",
  "SQS & SNS" as a pair - consistent naming is what lets the same true claim
  match the same keyword every time.
