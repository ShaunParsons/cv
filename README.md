# cv

Source of truth for my CV, structured so each application gets a CV written for
*that* role rather than one generic document sent everywhere.

The rendered HTML is published at <https://shaunparsons.github.io/cv>.

## How it fits together

```
roles/*.md          one file per past role - a superset of any single CV
qualifications.md   degrees, schooling, certifications
    │
    ▼               tailoring step: read a job spec, select and reframe
cv.md               generated, not hand-written
    │
    ▼               pandoc + weasyprint, one stylesheet for both
dist/cv.pdf  dist/cv.html
```

Roles are captured by interview: `/add-role` asks about one job in five waves,
pushes for hard numbers, and writes a structured file. Everything it records is
publishable - this repo is public, so nothing candid goes in it.

- **Rendering** - [Pandoc](https://pandoc.org) with the
  [WeasyPrint](https://weasyprint.org) PDF engine, so the PDF and the HTML are
  styled by the same stylesheet and can't drift apart.
- **Publishing** - a GitHub Actions workflow builds on push to `main` and
  deploys the HTML to GitHub Pages.

## TODO

- [x] `/add-role` skill for capturing roles
- [x] Capture the roles themselves
- [ ] Tailoring skill: job spec in, `cv.md` out
- [ ] Add `style.css`
- [ ] Add `Makefile` with `html` and `pdf` targets
- [ ] Add the Pages build/deploy workflow
- [ ] Enable Pages on the repo (source: GitHub Actions)
