---
company: Parsons Group Limited
title: Owner / Director
start: 2022-04
end: present
employment: founder
location: Leicester, UK
working: onsite
team_size: 2                     # the two directors
contractors: 2                   # finance, and general admin including social media
concurrent_with: Talis Education
commitment:
  - period: 2022-04 → 2023-04
    note: one day a week, alongside a four-day week at Talis Education
  - period: 2023-04 → present
    note: full-time
---

## Mandate

Family run business specialising in handcrafted leather goods, the import and
distribution of craft supplies, and event organisation. Grew out of an existing
operation and was incorporated as a limited company in April 2022, at which
point the split became one day a week here and four days at Talis Education.
Became the full-time focus from April 2023.

Two directors, plus two contractors engaged for finance and general admin. The
remit covers making, sourcing, supplier and venue relationships, event delivery,
marketing, and the statutory finance side.

## Achievements

- **Built an internal Event Sourced (CQRS) business dashboard** `#architecture`
  `#devops`
  - What: runs the business's social media presence and marketing automation -
    the LLM-generated publishing below, plus an integration with Klaviyo
  - Stack: Node.js backend, Vue.js front end, fully event-sourced
  - Deployment: fully serverless on AWS - Cognito, API Gateway, Lambda, SQS,
    SNS, DynamoDB, DynamoDB Streams, CloudFront, S3, EventBridge, CloudWatch,
    Secrets Manager
  - APIs: REST APIs on API Gateway power the front end
  - Messaging: command and notification topics for cross-service communication
  - Infrastructure: AWS CDK for infrastructure as code
  - Contribution: sole developer
  - Emphasise for: backend, platform, serverless, architecture, event-driven

- **Built LLM-generated social publishing into the dashboard** `#architecture`
  `#ai`
  - What: post content generated with an LLM and published directly to
    Facebook, Instagram, Twitter and Bluesky
  - Klaviyo: integrated alongside the social channels, carrying the newsletter
    campaigns and automated flows used across the business
  - Why it matters: generative AI running in production and in daily business
    use, not a prototype
  - Contribution: sole developer
  - Emphasise for: any spec naming LLMs, generative AI or shipped AI features;
    marketing automation and social media tooling

- **Integrated four e-commerce channels into one order and inventory flow**
  `#architecture` `#data`
  - Channels: Shopify, Etsy, eBay and Amazon
  - Where: runs on an earlier system, separate from the event-sourced dashboard
    above
  - Orders: pulled in from each channel
  - Inventory: stock levels pushed back out to each channel, so what each one
    advertises follows what is actually held
  - Why it matters: four separate third-party APIs behind a single order and
    inventory flow, rather than each channel worked in its own admin
  - Contribution: sole developer
  - Emphasise for: e-commerce, marketplace and multi-channel retail, API
    integration, and any spec naming third-party integration, order management
    or inventory synchronisation

- **Authored a reusable event-sourcing library** `#architecture`
  - What: own event-sourcing implementation, tied into the AWS ecosystem via
    DynamoDB and DynamoDB Streams
  - Reuse: used across personal projects and Parsons Group work
  - Contribution: sole author
  - Emphasise for: architecture, staff+ IC, event-driven and distributed systems

- **Run the whole platform for under $10 a month** `#devops` `#cost`
  - Metric: AWS spend below $10 per month, covering the dashboard, the
    integrations and everything supporting them
  - How: the architecture is chosen to sit inside the free tier wherever it can
    - serverless compute, on-demand storage and event-driven messaging rather
    than anything running continuously
  - Decision: the read models ran on RDS PostgreSQL first and were moved onto
    DynamoDB on cost grounds. RDS needs at least one instance running inside a
    VPC, which is a high fixed cost to carry against a relatively low-throughput
    service; on-demand DynamoDB bills for what the read models actually use
  - Contribution: sole developer - the design decisions and the bill are both
    mine
  - Emphasise for: serverless, cost engineering, FinOps, founder and early
    startup roles, and any spec naming cloud cost

- **Sustained delivery of production systems while running the business**
  `#delivery`
  - What: continued to design and ship production systems throughout the period
    away from full-time employment
  - Contribution: sole developer - no other technical staff in the business
  - Note: the one-line summary of the dashboard and library above, for a CV
    with no room for the detail

- **Built and manage a supplier network across the UK and internationally**
  `#stakeholder`
  - What: sourcing and buying relationships with suppliers across the UK and
    overseas, held and developed over several years
  - Contribution: mine to own - sourcing, negotiation and the ongoing
    relationship
  - Emphasise for: any role with vendor, partner or third-party management;
    procurement-adjacent work

- **Ran large-scale craft markets end to end** `#delivery` `#stakeholder`
  - What: organised and delivered public craft markets - venue selection and
    booking, trader recruitment and coordination, day-of staffing and running
    the event itself
  - Metric: in excess of 60 traders at an event, and an average of over 350
    attendees
  - Staffing: brought in contractors for the day, including an event manager
    working alongside us
  - Promotion and logistics: run largely through newsletter campaigns and
    automated flows in Klaviyo
  - Contribution: mine to own
  - Why it matters: project management against a fixed, immovable date, with
    60+ third parties who don't report to me and no second chance if it slips
  - Emphasise for: delivery and programme management, operations, roles needing
    evidence of coordinating people outside your own reporting line

- **Engaged and manage two contractors** `#leadership`
  - Scope: one covering finances, one covering general admin including social
    media
  - Contribution: engaged them and manage them directly
  - Note: the first time I have managed contractors rather than employees
  - Emphasise for: engineering management, roles involving outsourced or
    contract resource

## Technical surface

- **Languages and frameworks:** Node.js, Vue.js
- **Architecture:** event sourcing / CQRS, using an own-authored library;
  event-driven cross-service messaging via command and notification topics
- **Cloud:** AWS - Cognito, API Gateway (REST APIs powering the front end),
  Lambda, SQS, SNS, DynamoDB, DynamoDB Streams, CloudFront, S3, EventBridge,
  CloudWatch, Secrets Manager; RDS PostgreSQL carried the read models before
  they moved onto DynamoDB
- **Infrastructure as code:** AWS CDK
- **Secrets management:** AWS Secrets Manager, used the same way as on the
  serverless projects at Talis Education
- **CI:** GitHub Actions, running the test suite
- **Deployment:** released from my own machine rather than automatically on
  merge - GitHub Actions covers the tests, not the release
- **AI:** LLM-generated post content, in production in the social publishing
  above
- **Social channels:** Facebook, Instagram, Twitter and Bluesky, published to
  directly from the dashboard
- **Marketing automation:** Klaviyo - campaigns and automated flows, used to run
  event promotion and trader communications
- **E-commerce channels:** Shopify, Etsy, eBay and Amazon, integrated through
  their APIs - orders pulled in, stock levels pushed back out, on a system
  separate from the dashboard

**Note:** the only role in the history with front-end work, and so the sole
source of Vue.js.

## Tailoring notes

- **Leads for hands-on roles:** the event-sourced serverless dashboard - it is
  the strongest evidence of recent, current-stack production work
- **The LLM social publishing is the shipped-AI evidence in the history.**
  Specs asking for AI or LLM features in production are answered here; the
  AI-assisted development register in `CLAUDE.md` covers how software is
  built, and this covers what was built. The bullet says which channels and
  stops - the model behind it is not recorded, so no CV line should name one
- **Framing:** at two directors and two contractors this is evidence of
  *breadth* and self-direction rather than headcount - but it does carry
  genuine supplier, venue and contractor management, which the technical roles
  in the history do not
- **Leads for delivery and project management roles:** the markets - a fixed
  date, 60+ external parties, contracted day staff and a measurable turnout.
  The framing is organisation and delivery, not retail
- **This is the only e-commerce evidence in the history, and it is current.**
  Specs asking for e-commerce, marketplace or order-management experience are
  answered here and nowhere else - the card payment work in
  `roles/2015-farmfoods-software-developer.md` is in-branch retail from 2015 and
  the contribution line there is deliberately narrow. Lead with the two
  directions, orders in and stock out, because that is what separates an order
  flow from a catalogue sync
- **Purpose on the CV:** accounts for the period since April 2023 and carries
  the most recent hands-on technical work in the history
