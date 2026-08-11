# Method

How to turn a requirements matrix into four numbers that are worth reading.

## The method

Forecast from the **outside view first**: how often does this kind of
application, from this kind of route, reach this stage? Only then adjust for
what is specific to this case. Forecasters who work this way stay calibrated -
when they say 30%, it happens about 30% of the time - and the ones who start
from the specifics do not, because a vivid case always feels more likely than it
is. This case is maximally vivid: it is the user's own career.

So, in order:

1. Pick the reference class - route in, seniority, company type.
2. Take the base rate for that class from the table below.
3. Apply named adjustments, each with a direction and a reason.
4. Compound the stages in `scripts/estimate.py`.
5. Sanity-check the result against the base rate you started from. A large
   departure needs an argument, not a shrug.

## Base rates

Gathered July 2026. These drift, and the direction of drift is currently
downwards - Gem's report, on 140M+ applications from 2021 to 2024, finds
passthrough lower at *every* stage and applicants roughly 3x less likely to be
hired than three years earlier. Re-check anything load-bearing.

| Stage | Rate | Source | Confidence |
|---|---|---|---|
| Application -> interview, all industries | 3% | CareerPlug 2025, 10M+ applications | High |
| Application -> initial screen | 13% | refer.me, aggregating | Medium |
| Application -> technical screen, large tech co | 10-15% | secondary aggregation | Low |
| Technical screen -> onsite | 20-30% | secondary aggregation | Low |
| Interview -> offer, technical roles | ~7% | Ashby 2025 | High |
| Interview -> offer, business roles | ~9% | Ashby 2025 | High |
| Interview -> hire, all industries | 27% | CareerPlug 2025 | High |
| Applicants per hire, all industries | 1 in 180 | CareerPlug 2025 | High |
| Applicants per hire, tech | 1 in 191 | CareerPlug 2025 | High |
| Cold application -> offer | 0.1-2% | aggregated | Medium |
| Offer acceptance, tech | ~77% | industry data via NACE 2025 | Medium |
| Offer acceptance, all | 69-92% | NACE 2025 | High |
| Referrals reaching a screen | 57% vs 13% cold | refer.me | Medium |
| Referred candidates hired | ~4x more often | refer.me | Medium |
| Interview from referral -> offer | +35% vs online application | refer.me | Medium |

**The denominator trap.** CareerPlug's 27% interview-to-hire and Ashby's 7%
interview-to-offer cannot both mean the same "interview" - the first is
SMB-weighted across all industries with short funnels, the second is a
tech-heavy pipeline where "interview" covers several stages. Chaining rates
across definitions is the fastest way to a number that is wrong by an order of
magnitude. Pick one funnel definition, name it in the report, and take every
rate in the chain from a compatible source.

## Adjustments

Applied to the base rate, each named in the report with its direction.

**Route in - the largest single factor, and allowed to dominate.** A referral
moves the first-stage estimate by roughly an order of magnitude. Nothing about
the CV comes close. Establish the route before anything else; if it is unknown,
assume cold and say so, because cold is the default and the base rates above are
mostly cold.

**Hard filter failure - not a deduction, a collapse.** A failed hard filter does
not reduce the estimate by a proportion. It sends the first-stage estimate to
near the floor, and every downstream number with it. Do not average a failed
clearance requirement against eight met desirables.

**Must-have coverage.** Scale within the reference class by the fraction met
with direct evidence. Partials count for less than met and more than absent.
Bounded: coverage moves the estimate by up to about 3x in either direction, not
more - a candidate meeting every must-have still faces a pool of others who do
too.

Match enumerated requirements literally, attribution included. Where a spec
itemises a requirement into named components - management broken out into
promotions, hiring decisions, managing underperformers, compensation
decisions, a minimum tenure - each component is matched against the record on
its own, and only evidence with matching ownership meets it: a review cycle
run jointly, or a hiring decision taken collectively, is a partial for a
component that asks for the decision to have been the candidate's. Adjacent
leadership does not cover the components it does not name, and a spec that
itemises this way is usually screening for someone who has already operated
the whole list independently - treat "led a team" as covering it and the
estimate inherits the gap.

**Pool and competition.** Applicant tracking systems rank *relative to the
applicant pool*, not against a fixed threshold, so the same application is
strong for a niche role and invisible for an advertised generalist one. Widely
advertised, remote, generalist, big-name employer: adjust down. Niche stack,
narrow location, obscure company, recently posted: adjust up.

**Seniority alignment.** Overshooting the band is a rejection reason as surely
as undershooting it. A CV aimed above the advertised level reads as a candidate
who will leave, or who will cost more than the band allows.

**Process shape, for the final stages only.** Where the spec describes a work
sample, a take-home or a structured interview, weight demonstrable work higher:
structured interviews and work samples are the most predictive selection methods
there are (Schmidt & Hunter 1998; Schmidt, Oh & Shaffer 2016 - structured
interview r = .42, general mental ability r = .31, combined above .60), and a
process built on them rewards evidence over credentials. Where the process is an
unstructured conversation, the estimate is genuinely noisier - widen the range
rather than moving the midpoint.

## Three ways this goes wrong

**Imitating an ATS score.** Third-party "match scores" are keyword overlap
computed locally, not what any recruiter sees, and real engines disagree wildly
with each other - one benchmark of 4,200 CVs had the same document score 68 on
one system and 92 on another. Never produce one number and call it fit. Report
counts within each requirement class.

**The 60% rule.** "Men apply at 60% of the requirements, women at 100%" traces
to an unpublished internal Hewlett-Packard memo, not to data; when researchers
actually measured it, both sat around 52-56%. It is not a threshold, and no
apply/don't-apply advice should rest on a percentage of requirements met. What
matters is which class the misses fall in, not how many there are.

**Inside-view optimism.** The specific case always feels more likely than the
reference class, and it is the user's own career, so it will feel more likely
still. If the estimate has drifted far above the base rate, the burden is to
name what about this application is genuinely 10x - and "the CV is a good fit"
is not that, because everyone shortlisted has a CV that fits.

## Valuing the offer

1. **The advertised band**, if the spec has one. It is the best evidence
   available and it beats any benchmark.
2. **Benchmarks**, where it does not, fetched at run time:
   - **ITJobsWatch** - UK medians from advertised vacancies, by title, rolling
     six months. Reflects what employers advertise, which runs below what they
     eventually pay for a strong candidate.
   - **levels.fyi** - self-reported, skewed hard towards large tech employers
     and total compensation. Read it as a ceiling, not a median.
   - **ONS** and published recruiter benchmark reports - broad, slow, useful for
     direction rather than a number.

   Cite which was used and its date. Do not carry a figure from memory; these
   move, and a stale salary quoted confidently is worse than no figure.
3. **Place the user in the band, and say why.** Bottom third for a partial
   match, middle for a solid one, upper third only with strong evidence against
   the must-haves *and* leverage - a competing offer, a scarce skill the spec
   names, an inbound approach.
4. **The first number is not the ceiling.** Employers generally open below what
   they will pay and expect movement. Report the likely offer and the likely
   negotiated figure as separate numbers when the band supports it.
5. **Expected value** = P(offer) x offer value. It is a tool for ranking several
   applications against each other, not a prediction about this one. Say so when
   reporting it - an expected value of £1,800 against a £90,000 job invites
   exactly the wrong reading.

## Calibration discipline

- **Ranges, not points.** "8-15%" is honest; "11.3%" is not, and the decimal is
  a claim to precision that nothing here supports.
- **Round numbers.** 5, 10, 15, 20. Anything finer implies data that does not
  exist.
- **Monotonic by construction.** P(offer) <= P(final) <= P(first). The script
  enforces it; do not restate numbers in prose that contradict it.
- **Say what would change the answer.** Every estimate rests on assumptions -
  the route in, the pool size, whether an inferred hard filter is really hard.
  Name the one that matters most and what it would take to know it.

## Sources

- [CareerPlug 2025 Recruiting Metrics Report](https://www.careerplug.com/recruiting-metrics-and-kpis/)
- [Pin: Recruitment Funnel Benchmarks](https://www.pin.com/blog/recruitment-funnel-benchmarks/) - aggregates Ashby, NACE and SHRM figures
- [Gem 2025 Recruiting Benchmarks](https://www.gem.com/blog/10-takeaways-from-the-2025-recruiting-benchmarks-report) - 140M+ applications, 2021-2024
- [refer.me: referral response rate data](https://www.refer.me/blog/do-job-referrals-actually-work-data-behind-response-rates)
- [Schmidt, Oh & Shaffer 2016, validity of selection methods](https://home.ubalt.edu/tmitch/645/session%204/Schmidt%20&%20Oh%20validity%20and%20util%20100%20yrs%20of%20research%20Wk%20PPR%202016.pdf)
- [Behavioural Insights Team on the 60% claim](https://www.bi.team/blogs/women-only-apply-when-100-qualified-fact-or-fake-news/)
- [Jobloo: how ATS keyword matching actually works](https://jobloo.co/blog/ats-score-keyword-matching-explained/)
- [ITJobsWatch](https://www.itjobswatch.co.uk/) and [levels.fyi](https://www.levels.fyi/) for pay
