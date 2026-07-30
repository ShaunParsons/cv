# CLAUDE.md

## What this repo is

The source of truth for my CV, structured so that CVs can be generated bespoke
for a given job spec rather than hand-edited each time.

`roles/*.md` is the source of truth — one file per past role, each a **superset**
of what any single CV would show. A tailoring step selects and reframes from
those to produce a CV aimed at a specific role, rendered to PDF (for attaching
to applications) and HTML (published to GitHub Pages at
<https://shaunparsons.github.io/cv>).

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
  — that's the whole reason for the WeasyPrint engine over a LaTeX one. Any
  styling change must be checked against *both* renders before committing; it's
  easy to fix the HTML and silently break page-breaking in the PDF.
- **Never hand-edit anything in `dist/` or `cv.md`.** Both are build output and
  get overwritten. Edit `roles/*.md` instead.
- **Never invent a detail on a CV.** No metric, date, or title that the user
  hasn't confirmed. Unknown figures are recorded as `metric: unverified` and
  simply go unstated — an invented one survives right up until an interviewer
  asks about it.
- **This repo is public, and everything in it is publishable.** No compensation
  figures, no reasons for leaving a role, no named criticism of former
  employers, no personal contact details (home address, phone number).
  Recruiters get contact details by reply, not by scrape. There is no private
  file mechanism here and none should be added — treat every file as though it
  is already on the internet.
- **Contact details.** The email address is hardcoded in the source. Home
  address and phone number are **environment variables** read at render time —
  `CV_ADDRESS` and `CV_PHONE` — and are never committed in any form. A build
  with them unset must still succeed and simply omit those lines; that is the
  correct output for the HTML published to Pages, which should never carry a
  home address or mobile number.
