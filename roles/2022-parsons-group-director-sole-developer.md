---
company: Parsons Group Limited
title: Director / Sole Developer
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

Family-run online retailer, making and importing what it sells, with an events arm alongside it. Grew out of an existing operation and was incorporated as a limited company in April 2022, at which point the split became one day a week here and four days at Talis Education. Became the full-time focus from April 2023.

Two directors, plus two contractors engaged for finance and general admin. The remit covers making, sourcing, supplier and venue relationships, event delivery, marketing, and the statutory finance side.

## Achievements

- **Built an internal Event Sourced (CQRS) business dashboard** `#architecture` `#devops`
  - Situation: the business's own social media presence and marketing automation, developed from 2025 onwards - recent work, and current
  - Action: built an internal dashboard on a Node.js backend and a Vue.js front end, fully event-sourced and deployed fully serverless on AWS - Cognito, API Gateway, Lambda, SQS, SNS, DynamoDB, DynamoDB Streams, CloudFront, S3, EventBridge, CloudWatch and Secrets Manager - with REST APIs on API Gateway powering the front end, command and notification topics carrying cross-service communication, and AWS CDK for infrastructure as code
  - Result: the business's social presence and marketing automation run from it - the LLM caption generation below, plus an integration with Klaviyo
  - Contribution: sole developer
  - Emphasise for: backend, platform, serverless, architecture, event-driven

- **Built LLM caption generation into the dashboard's social publishing** `#architecture` `#ai`
  - Situation: social publishing reaching Facebook, Instagram, Twitter and Bluesky, with Klaviyo alongside it carrying the newsletter campaigns and automated flows used across the business
  - Action: generated captions for social media content with an LLM, and published the posts directly to those channels
  - Result: in daily use by the business's external contractors covering marketing and social media, not only by me - generative AI in production and in daily business use by people other than its author, not a prototype
  - Contribution: sole developer
  - Emphasise for: any spec naming LLMs, generative AI or shipped AI features; marketing automation and social media tooling

- **Integrated four e-commerce channels into one order and inventory flow** `#architecture` `#data`
  - Situation: Shopify, Etsy, eBay and Amazon, each otherwise worked in its own admin console. The system dates back to around 2016, built for the family operation the company grew out of and predating the 2022 incorporation, and runs separately from the event-sourced dashboard above
  - Action: pulled orders in from each channel and pushed stock levels back out to each, across all four APIs
  - Result: one order and inventory flow behind four separate third-party APIs, with what each channel advertises following what is actually held
  - Contribution: sole developer
  - Emphasise for: e-commerce, marketplace and multi-channel retail, API integration, and any spec naming third-party integration, order management or inventory synchronisation

- **Authored a reusable event-sourcing library** `#architecture`
  - Situation: first written in late 2019 as part of a personal project, predating the 2022 incorporation of Parsons Group by over two years
  - Action: wrote an own event-sourcing implementation, tied into the AWS ecosystem via DynamoDB and DynamoDB Streams
  - Result: reused across personal projects and Parsons Group work, and it is what the event-sourced dashboard above is built on
  - Contribution: sole author
  - Note: this file records the library because Parsons Group is where it is used, not because it was written here. A CV bullet placing the authoring inside the April 2022 onwards role misdates it by more than two years - claim the authorship, and let the dashboard carry the date
  - Emphasise for: architecture, staff+ IC, event-driven and distributed systems

- **Designed PII retention into the event store, so an append-only log still forgets** `#architecture` `#security` `#data`
  - Situation: event sourcing is append-only, which sits directly against a retention limit - the event carrying personal data is the one record the design says never to alter
  - Task: hold personal data to a retention period without compromising the log
  - Action: split it across two tables. One holds the events; a second holds only the personal data attached to them, with a DynamoDB TTL set to the retention period. When the TTL fires and DynamoDB removes the record, that deletion propagates through DynamoDB Streams into the read models, so the projections drop the data too rather than holding a copy of what the store has forgotten. Seeing the same data again resets the window, so the clock measures time since last contact rather than time since first
  - Result: retention enforced by the infrastructure rather than by a scheduled job somebody has to remember to run, and the event log keeps its integrity because the personal data was never held in it
  - Contribution: sole developer - the design is mine
  - Emphasise for: architecture, event-driven and distributed systems, data protection, and any spec naming GDPR, PII, data retention or privacy by design

- **Run the whole platform for under $10 a month** `#devops` `#cost`
  - Action: chose an architecture that sits inside the free tier wherever it can - serverless compute, on-demand storage and event-driven messaging rather than anything running continuously
  - Result: AWS spend below $10 per month, covering the dashboard, the integrations and everything supporting them
  - Contribution: sole developer - the design decisions and the bill are both mine
  - On a CV: not selected. This bullet is the record of the bill; on the page a cost line on a platform this size earns nothing against the dashboard and library above

- **Sustained delivery of production systems while running the business** `#delivery`
  - Action: continued to design and ship production systems throughout the period away from full-time employment
  - Contribution: sole developer - no other technical staff in the business
  - Note: the one-line summary of the dashboard and library above, for a CV with no room for the detail

- **Built and manage a supplier network across the UK and internationally** `#stakeholder`
  - Task: source and buy for a business that makes and imports what it sells
  - Action: built and hold sourcing and buying relationships with suppliers across the UK and overseas, developed over several years
  - Contribution: mine to own - sourcing, negotiation and the ongoing relationship
  - Emphasise for: any role with vendor, partner or third-party management; procurement-adjacent work

- **Ran large-scale craft markets end to end** `#delivery` `#stakeholder`
  - Situation: public craft markets running to a fixed, immovable date, with 60+ third parties who don't report to me and no second chance if it slips
  - Action: selected and booked venues, recruited and coordinated traders, brought in contractors for the day including an event manager working alongside us, promoted the events largely through newsletter campaigns and automated flows in Klaviyo, and ran the day itself
  - Result: in excess of 60 traders at an event, and an average of over 350 attendees
  - Contribution: mine to own
  - Emphasise for: delivery and programme management, operations, roles needing evidence of coordinating people outside your own reporting line

- **Engaged and manage a team of external contractors** `#leadership`
  - Situation: two directors and no employees, against a remit spanning making, sourcing, marketing, events and the statutory finance side
  - Action: engaged one contractor covering finances, one covering general admin including marketing and social media, and further contractors to staff the markets above, the event manager among them
  - Contribution: engaged them and manage them directly
  - Note: the first time I have managed contractors rather than employees
  - On a CV: carries as "managed a team of external contractors working on various parts of the business, including marketing, social media and finance"
  - Emphasise for: engineering management, technical lead and above, roles involving outsourced or contract resource - management evidence that runs to the present rather than stopping at the last employer

## Technical surface

- **Languages and frameworks:** Node.js, Vue.js
- **Architecture:** event sourcing / CQRS, using an own-authored library; event-driven cross-service messaging via command and notification topics
- **Cloud:** AWS - Cognito, API Gateway (REST APIs powering the front end), Lambda, SQS, SNS, DynamoDB, DynamoDB Streams, CloudFront, S3, EventBridge, CloudWatch, Secrets Manager
- **Infrastructure as code:** AWS CDK
- **Secrets management:** AWS Secrets Manager, used the same way as on the serverless projects at Talis Education
- **CI:** GitHub Actions, running the test suite
- **Deployment:** released from my own machine rather than automatically on merge - GitHub Actions covers the tests, not the release
- **AI:** LLM-generated captions for social media content, in production in the social publishing above
- **Social channels:** Facebook, Instagram, Twitter and Bluesky, published to directly from the dashboard
- **Marketing automation:** Klaviyo - campaigns and automated flows, used to run event promotion and trader communications
- **E-commerce channels:** Shopify, Etsy, eBay and Amazon, integrated through their APIs - orders pulled in, stock levels pushed back out, on a system separate from the dashboard

## Tailoring notes

- **The CV heading renders this role as Technical Director.** The company has two directors and this is the technical one: the stack, the architecture and what gets built next are decided here, along with running the platform and carrying its cost. The front matter holds the statutory title as the record, and Companies House carries "Director"; "Technical Director" states which of the two. The bullets keep "as sole developer" alongside it, because that is the scope and it is also the strongest thing about the role - a business's platform designed, built and operated by one person. There is no technical team here and no line should imply one, which rules out "Technical Lead" and "Lead Engineer" as renderings; both would also collide with the Technical Lead title held concurrently at Talis Education. "Senior Developer" and "Solutions Architect" aim at the wrong thing in the other direction - a conferred grade with no framework behind it, and a function this role does not perform
- **The timelines split: the dashboard has been developed from 2025 onwards, and the e-commerce integration has run since around 2016.** A claim about the duration of production software at Parsons Group rests on the e-commerce system; the dashboard's strength is that it is current, not long-lived, and no line should read as though it has been in development since the company began
- **The business is "a family-run online retailer" here as well as on a CV.** This file describes it at the same level of abstraction the CV does, and the product lines are not part of the record - the repo is public, and what the company sells is its business rather than a candidate's evidence. What the role required is all in the achievements: making, sourcing, supplier and venue relationships, event delivery, and the software. The company sells physical products and the platform exists to run the business, not the other way round. A summary line must keep that order - "run Parsons Group as sole developer of a platform" reads as though the platform is the company's product, which it is not. Name the business first and place the software behind it: *"I now run Parsons Group, a family-run online retailer, where I am sole developer of an internal event-sourced serverless platform hosted on AWS..."*. The dashboard bullet carries "internal" for the same reason, and the platform is *hosted on* AWS rather than "an AWS platform"
- **Leads for hands-on roles:** the event-sourced serverless dashboard - it is the strongest evidence of recent, current-stack production work
- **The LLM social publishing is the shipped-AI evidence in the history.** Specs asking for AI or LLM features in production are answered here; the AI-assisted development register in `CLAUDE.md` covers how software is built, and this covers what was built. The bullet says which channels and stops - the model behind it is not recorded, so no CV line should name one
- **Framing:** at two directors and two contractors this is evidence of *breadth* and self-direction rather than headcount - but it does carry genuine supplier, venue and contractor management, which the technical roles in the history do not
- **Leads for delivery and project management roles:** the markets - a fixed date, 60+ external parties, contracted day staff and a measurable turnout. The framing is organisation and delivery, not retail
- **This is the only e-commerce evidence in the history, and it is current.** Specs asking for e-commerce, marketplace or order-management experience are answered here and nowhere else - the card payment work in `roles/2015-farmfoods-software-developer.md` is in-branch retail from 2015 and the contribution line there is deliberately narrow. Lead with the two directions, orders in and stock out, because that is what separates an order flow from a catalogue sync
- **Purpose on the CV:** accounts for the period since April 2023 and carries the most recent hands-on technical work in the history
