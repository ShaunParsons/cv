# cv

Source of truth for my CV. Written once in Markdown, rendered to PDF and HTML.

The rendered HTML is published at <https://shaunparsons.github.io/cv>.

## Planned setup

- **Source** — a single `cv.md`, with `style.css` shared by both outputs.
- **Rendering** — [Pandoc](https://pandoc.org) with the
  [WeasyPrint](https://weasyprint.org) PDF engine, so the PDF and the HTML are
  styled by the same stylesheet and can't drift apart.
- **Publishing** — a GitHub Actions workflow builds on push to `main` and
  deploys the HTML to GitHub Pages.

## TODO

- [ ] Write `cv.md`
- [ ] Add `style.css`
- [ ] Add `Makefile` with `html` and `pdf` targets
- [ ] Add the Pages build/deploy workflow
- [ ] Enable Pages on the repo (source: GitHub Actions)
