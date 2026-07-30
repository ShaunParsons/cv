# CLAUDE.md

## What this repo is

The source of truth for my CV, structured so that CVs can be generated bespoke
for a given job spec rather than hand-edited each time.

`roles/*.md` is the source of truth - one file per past role, each a **superset**
of what any single CV would show. A tailoring step selects and reframes from
those to produce a CV aimed at a specific role, rendered to PDF (for attaching
to applications) and HTML (published to GitHub Pages at
<https://shaunparsons.github.io/cv>).

`qualifications.md` holds degrees, schooling and certifications.

`cv.md` is generated output, not source. Do not hand-edit it.

## Build

Rendering is Pandoc with the WeasyPrint PDF engine:

```
make html   # dist/cv.html
make pdf    # dist/cv.pdf
make        # both
```

Requires `pandoc` (brew) and `weasyprint` (pip).

## Conventions

- **One stylesheet, two outputs.** `style.css` styles both the HTML and the PDF
  - that's the whole reason for the WeasyPrint engine over a LaTeX one. Any
  styling change must be checked against *both* renders before committing; it's
  easy to fix the HTML and silently break page-breaking in the PDF.
- **Never hand-edit anything in `dist/` or `cv.md`.** Both are build output and
  get overwritten. Edit `roles/*.md` instead.
- **Never invent a detail on a CV.** No metric, date, or title that the user
  hasn't confirmed. An invented figure survives right up until an interviewer
  asks about it. **Omit what can't be verified** - no `unverified` placeholder,
  just leave the line out. An achievement without a number still reads as an
  achievement; one carrying a hedge reads as a draft.
- **`roles/*.md` is the source of truth, and reads like it.** Each file states
  what happened; it never annotates or corrects an existing CV. Nothing in this
  repo should refer to "the current CV" - an old PDF may be a useful prompt
  while capturing a role, but it has no standing here and will be gone in a
  year.
- **Write for the same audience as the CV.** The repo is public, so assume every
  role file is read by the recruiter or hiring manager who receives the
  generated CV. That is the test for anything written here: not "is it true",
  but "does it hold up in front of the person it's about to be sent to".

  In practice that rules out notes reading as coaching on what to conceal -
  "do not claim...", "never mention...", "this would be indefensible". Even
  where the underlying caution is correct, that reader sees a candidate
  managing what they can get away with. State the fact precisely instead and
  the wrong claim becomes impossible without any instruction: *"the decision was
  taken before I became technical lead; I led the implementation"* carries
  everything "do not claim the call" was there to enforce, and reads as candour.
  It also rules out talking the work down - "the shortest role", "the most
  junior title", "explains the gap" - which volunteers a weakness nobody asked
  about. Where something was never established, leave it out rather than
  writing a note about leaving it out.

  Tailoring metadata (`Emphasise for:`, `Leads for:`, `Contribution:`) survives
  this test comfortably. Being visibly careful about attribution and about
  which figures exist is an asset in front of that reader, not a liability.
- **This repo is public, and everything in it is publishable.** No compensation
  figures, no reasons for leaving a role, no named criticism of former
  employers, no personal contact details (home address, phone number).
  Recruiters get contact details by reply, not by scrape. There is no private
  file mechanism here and none should be added - treat every file as though it
  is already on the internet.
- **Contact details.** The email address is hardcoded in the source. Home
  address and phone number are **environment variables** read at render time -
  `CV_ADDRESS` and `CV_PHONE` - and are never committed in any form. A build
  with them unset must still succeed and simply omit those lines; that is the
  correct output for the HTML published to Pages, which should never carry a
  home address or mobile number.
