# CLAUDE.md

## What this repo is

The source of truth for my CV. `cv.md` is written once in Markdown and rendered
to two outputs: a PDF for attaching to applications, and HTML published to
GitHub Pages at <https://shaunparsons.github.io/cv>.

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
- **Everything is generated from `cv.md`.** Never hand-edit anything in `dist/`
  — it's build output and gets overwritten.
- **This repo is public.** Keep personal contact details (home address, phone
  number) out of committed source. Recruiters get those by reply, not by scrape.

Git commit conventions are covered by the global `~/.claude/CLAUDE.md` and are
not repeated here.
