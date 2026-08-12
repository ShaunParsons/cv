# cv - render cv.md to HTML and PDF.
#
# One HTML file is produced, and the PDF is rendered from that exact file, so
# the two outputs cannot drift apart. Everything here is deterministic: the
# tailoring step that writes cv.md is a separate, deliberate act (/generate-cv).
#
#   make          everything, including the dated copy to attach
#   make html     dist/index.html
#   make pdf      dist/cv.pdf
#   make check    validate cv.md without rendering
#   make pages    render and fail unless the PDF is exactly two pages
#   make dated    a dated copy for attaching to an application
#   make setup    create .venv and check the toolchain
#   make clean    remove dist/

SHELL := /bin/bash

SRC      := cv.md
DIST     := dist
TEMPLATE := template.html
STYLE    := style.css
VENV     := .venv

# A local .env, if present, supplies the contact details. It is gitignored;
# .env.example documents the shape. Anything already exported in the shell wins
# over the file, and a checkout without one renders fine, minus those lines.
-include .env
export

# .env is read as a makefile, so a value is taken literally - but people write
# .env files with shell quoting out of habit, and an address has spaces in it.
# Drop double quotes so both spellings work. Note this cannot be patsubst: that
# operates per whitespace-separated word, so `"1 Example Street"` would never match
# the pattern and the quotes would survive into the masthead. Single quotes are
# left alone - an address is far more likely to contain an apostrophe than to
# be wrapped in one.
unquote = $(subst ",,$(1))

# The values are handed to pandoc inside shell single quotes, so an apostrophe
# in an address ("12 King's Road") would otherwise close the quote and break
# the build. This is the standard POSIX escape: ' -> '\''
shquote = $(subst ','\'',$(1))

# The email is publishable, so unlike the address and phone it is hardcoded
# here rather than read from the environment.
EMAIL := cv@shaunparsons.co.uk

# Prefer a repo-local venv, fall back to whatever is on PATH.
PANDOC     := $(shell command -v pandoc 2>/dev/null || echo $$HOME/.local/bin/pandoc)
WEASYPRINT := $(shell test -x $(VENV)/bin/weasyprint && echo $(VENV)/bin/weasyprint || command -v weasyprint 2>/dev/null)
PYTHON     := $(shell command -v python3 2>/dev/null)
# The PDF renderer uses WeasyPrint's Python API rather than its CLI, so it
# needs a python that can import weasyprint - the venv's, or the one whose
# site-packages backs a weasyprint found on PATH.
RENDER_PY  := $(shell test -x $(VENV)/bin/python && echo $(VENV)/bin/python || command -v python3 2>/dev/null)

# Home address and phone are read from the environment at render time and are
# never committed. An unset variable simply omits the line, so a render on a
# fresh checkout is safe by default rather than by remembering.
ADDRESS := $(call unquote,$(CV_ADDRESS))
PHONE   := $(call unquote,$(CV_PHONE))

# The CV is two pages. Not one, not three - see CLAUDE.md.
PAGES := 2

.PHONY: all html pdf check pages dated setup clean help

# The dated copy is what actually gets attached to an application, so it is the
# default rather than an extra step to remember. It pulls in html and pdf.
all: dated

help:
	@sed -n 's/^#   //p' Makefile

# --- checks ----------------------------------------------------------------

check:
	@$(PYTHON) scripts/validate_cv.py $(SRC)

.PHONY: _require-pandoc _require-weasyprint
_require-pandoc:
	@test -x "$(PANDOC)" || { \
	  echo "pandoc not found. Run 'make setup' for install instructions." >&2; exit 1; }

_require-weasyprint:
	@test -n "$(WEASYPRINT)" && test -x "$(WEASYPRINT)" || { \
	  echo "weasyprint not found. Run 'make setup'." >&2; exit 1; }

# --- render ----------------------------------------------------------------

$(DIST):
	@mkdir -p $(DIST)

# Assets sit beside the HTML so the relative URLs in style.css resolve for both
# WeasyPrint and a browser.
.PHONY: assets
assets: | $(DIST)
	@cp $(STYLE) $(DIST)/
	@mkdir -p $(DIST)/assets
	@cp -r assets/fonts $(DIST)/assets/

html: check _require-pandoc assets
	@$(PANDOC) $(SRC) \
	  --from=markdown \
	  --to=html5 \
	  --template=$(TEMPLATE) \
	  --standalone \
	  --metadata=email:'$(EMAIL)' \
	  $(if $(ADDRESS),--metadata=address:'$(call shquote,$(ADDRESS))',) \
	  $(if $(PHONE),--metadata=phone:'$(call shquote,$(PHONE))',) \
	  --output=$(DIST)/index.html
	@echo "built $(DIST)/index.html$(if $(ADDRESS),, (no address - CV_ADDRESS unset))"

# Page count is the one property of the render that the *content* controls
# rather than the stylesheet, so it is asserted rather than eyeballed in a
# viewer. pdfinfo comes from poppler-utils, already required for PDF job specs;
# if it is missing the check is skipped rather than failing an otherwise good
# render.
PDFINFO := $(shell command -v pdfinfo 2>/dev/null)
count_pages = $$($(PDFINFO) $(DIST)/cv.pdf | awk '/^Pages:/ {print $$2}')

# The PDF is rendered from the built HTML, not from cv.md again.
#
# scripts/render_pdf.py wraps WeasyPrint's API rather than shelling out to its
# CLI, for two things the CLI cannot do:
#
#   - When a role's bullets run over the page break, it repeats the role
#     heading at the top of the new page with "(Continued)" - a render-time
#     concern, since only the renderer knows where the break falls, so neither
#     cv.md nor /generate-cv is aware of pagination.
#   - pdf/ua-1 emits a tagged PDF: a structure tree of real H1/H2/H3, P and
#     L/LI/LBody elements alongside the page content. Untagged, anything
#     reading the file back - an applicant tracking system parsing it into
#     fields, a screen reader - has only glyph positions to go on and
#     reconstructs the reading order by guesswork. Tagged, the order and the
#     nesting are stated. It costs about 3KB and changes not a pixel.
pdf: html _require-weasyprint
	@$(RENDER_PY) scripts/render_pdf.py $(DIST)/index.html $(DIST)/cv.pdf
	@echo "built $(DIST)/cv.pdf"
	@if [ -n "$(PDFINFO)" ]; then n=$(call count_pages); \
	  [ "$$n" = "$(PAGES)" ] || \
	    echo "warning: $$n pages, expected $(PAGES) - trim cv.md" >&2; \
	fi

# Renders and fails on the wrong length, for use in a generation loop.
pages: pdf
	@test -n "$(PDFINFO)" || { \
	  echo "pdfinfo not found - apt install poppler-utils." >&2; exit 1; }
	@n=$(call count_pages); \
	if [ "$$n" = "$(PAGES)" ]; then echo "$$n pages - ok"; else \
	  echo "$$n pages, expected $(PAGES). Trim or expand cv.md; do not change" >&2; \
	  echo "style.css to make it fit." >&2; exit 1; fi

# The dated copy carries the target company where cv.md is tailored, taken
# from the `tailored-for` front matter ("<role> at <company>"), so dist/
# doubles as a record of which application each PDF was generated for. A
# generic CV, or a tailored-for line with no " at ", falls back to the plain
# dated name.
dated: pdf
	@company=$$(sed -n 's/^tailored-for:[[:space:]]*//p' $(SRC) | head -1 \
	  | tr -d '"' | sed -n 's/.* at //p' | tr ' ' '-' | tr -cd 'A-Za-z0-9-'); \
	out="$(DIST)/CV-Shaun-Parsons-$${company:+$$company-}$$(date +%Y-%m-%d).pdf"; \
	cp $(DIST)/cv.pdf "$$out"; \
	echo "built $$out"

# --- housekeeping ----------------------------------------------------------

setup:
	@echo "checking toolchain..."
	@test -x "$(PANDOC)" \
	  && echo "  pandoc      $$($(PANDOC) --version | head -1)" \
	  || echo "  pandoc      MISSING - apt install pandoc, or download a static binary from https://github.com/jgm/pandoc/releases into ~/.local/bin"
	@test -d $(VENV) || { echo "  creating $(VENV)..."; $(PYTHON) -m venv $(VENV); }
	@$(VENV)/bin/pip install --quiet weasyprint
	@echo "  weasyprint  $$($(VENV)/bin/weasyprint --version)"
	@echo "toolchain ok."

clean:
	@rm -rf $(DIST)
	@echo "removed $(DIST)/"
