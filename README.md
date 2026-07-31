# cv

Source of truth for my CV, structured so each application gets a CV written for
*that* role rather than one generic document sent everywhere.

## How it fits together

```
roles/*.md          one file per past role - a superset of any single CV
qualifications.md   degrees, schooling, certifications
    │
    ▼               /generate-cv - read a job spec, select and reframe
cv.md               generated, then reviewed and edited by hand - gitignored
    │
    ▼               make - validate, then pandoc + weasyprint
dist/index.html     an intermediate; the PDF is printed from it
dist/cv.pdf         the deliverable
```

The split is the point. Choosing what goes on the CV is a judgement call and
runs through a skill; turning that choice into a document is not, and runs
through `make`. Edit `cv.md` and re-run `make` as often as you like - the render
is deterministic and does not consult the roles again.

```
/generate-cv                          a generic CV
/generate-cv https://…/job            tailored to a spec on the web
/generate-cv ~/Downloads/role.pdf     tailored to a spec you were sent

make          everything          make check   validate cv.md only
make pdf      dist/cv.pdf         make pages   assert the two-page limit
make html     dist/index.html     make dated   a dated copy to attach
                                  make setup   create .venv, check tooling
```

First run needs `pandoc` on `PATH` and `make setup` for the WeasyPrint venv.

Roles are captured by interview: `/add-role` asks about one job in five waves,
pushes for hard numbers, and writes a structured file. Everything it records is
publishable - this repo is public, so nothing candid goes in it.

Rendering is [Pandoc](https://pandoc.org) with the
[WeasyPrint](https://weasyprint.org) PDF engine: the PDF is printed from the
generated HTML, so one stylesheet governs the whole chain. Fonts are vendored,
so a build touches the network at no point and renders the same anywhere.

`cv.md` is gitignored on purpose. It is written for one application and rewritten
for the next, so it is a working file rather than a record - `roles/*.md` is what
gets kept. Nothing here is published as a web page; the CV goes to one reader at
a time.

## TODO

- [x] `/add-role` skill for capturing roles
- [x] Capture the roles themselves
- [x] Tailoring skill: job spec in, `cv.md` out
- [x] Add `style.css`
- [x] Add `Makefile` with `html` and `pdf` targets
