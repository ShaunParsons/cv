---
company: <Company name>
role: <Job title, as advertised>
status: found            # found | filtered | shortlisted | applied | screening | interviewing | offer | rejected | withdrawn | no-response
stage: found             # furthest point reached: found | assessed | applied | recruiter-screen | first-interview | technical | final | offer
filtered: <why it was dropped, where status is filtered - a standing filter (stack, salary
          floor, location), or the assessment triage, as "assessment - first-stage midpoint
          N%, below the 5% floor">
route: cold              # cold | recruiter | referral | inbound | agency
source: <where the lead came from - the board, the ATS, the sweep modality, the recruiter's name>
salary: <as advertised, or "not stated">
location: <Remote UK / London, hybrid 2 days / ...>
found: <YYYY-MM-DD>
assessed: <YYYY-MM-DD>
applied: <YYYY-MM-DD>
closed: <YYYY-MM-DD - the date of the rejection, offer or withdrawal>
register: <the /generate-cv register used: general | senior-developer | technical-lead | engineering-manager | founder | project-management | ai-assisted>
cv: <the CV file in this directory>
links:
  - <listing URL>
  - <ATS URL, where the application actually went>
---

# <Company> - <Role>

## Job description

<The spec, verbatim. Not a paraphrase: a listing is taken down within weeks, and
a summary drifts towards what was remembered rather than what was asked for.
Where a fetch produced one, `spec.txt` beside this file is the raw copy.>

## Assessment

<The /assess-fit output in short: the four estimates with their reasoning, the
hard filters, what was met and what was not, and the one thing that would have
moved it. Where it was assessed more than once, keep the last pass and say what
moved between them.

The midpoint of the first estimate - the first-stage interview - sets `status`:
above 15% shortlisted, below 5% filtered, and anything between the two stays
`found` at `stage: assessed` until the user decides. Both boundaries fall in the
middle band.>

## Materials sent

<CV register and file, covering letter or application answers, anything else -
each named by the file beside this one.>

## Timeline

- <YYYY-MM-DD> - <what happened>

## Feedback

<Verbatim, and attributed to whoever gave it. Rejections included, especially
the ones that say nothing - a form rejection at 48 hours is data about the
screen, and "we went with someone with more X" is data about the gap.>

## Notes

<Anything worth knowing before applying here again, or before applying somewhere
like it.>
