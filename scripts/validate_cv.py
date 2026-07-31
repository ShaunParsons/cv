#!/usr/bin/env python3
"""Structural check on cv.md, run before every render.

cv.md is written by the /generate-cv skill and then edited by hand, so the
structure the stylesheet relies on has to be checked rather than assumed. A
heading at the wrong level or a role line missing its italic job title still
renders - it just renders wrong, and the first you would know about it is the
PDF you attached to an application.

Errors block the build. Warnings print and let it through.

Usage:  python3 scripts/validate_cv.py [cv.md]
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field

# Fenced div classes the stylesheet knows how to lay out. Anything else is a
# typo - pandoc would emit the div and the styling would silently not apply.
KNOWN_DIVS = {"summary", "grid"}

# "Company, Location - *Job Title*", with either a hyphen or an em/en dash.
ROLE_HEADING = re.compile(r"^(?P<where>.+?,\s*.+?)\s+[-–—]\s+\*(?P<title>.+)\*$")

# A date line has to carry a year or say Present, or the stylesheet is applying
# date styling to something that is not a date.
DATE_LINE = re.compile(r"(\b(19|20)\d{2}\b|\bPresent\b)", re.I)

# Contact details must never be committed - they are injected at render time
# from CV_ADDRESS and CV_PHONE. See CLAUDE.md.
UK_POSTCODE = re.compile(r"\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b")
UK_PHONE = re.compile(r"(\+44\s?\d|\b07\d{3}\s?\d{6}\b|\b0\d{3}\s?\d{3}\s?\d{4}\b)")

EXPERIENCE_HEADING = re.compile(r"^professional experience$", re.I)


@dataclass
class Report:
    path: str = "cv.md"
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def error(self, line: int | None, msg: str) -> None:
        where = f"{self.path}:{line}: " if line else ""
        self.errors.append(f"{where}{msg}")

    def warn(self, line: int | None, msg: str) -> None:
        where = f"{self.path}:{line}: " if line else ""
        self.warnings.append(f"{where}{msg}")


def split_front_matter(lines: list[str], rep: Report) -> tuple[dict[str, str], int]:
    """Return (metadata, index of first body line)."""
    if not lines or lines[0].strip() != "---":
        rep.error(1, "missing YAML front matter - the file must open with '---'")
        return {}, 0

    for i in range(1, len(lines)):
        if lines[i].strip() in ("---", "..."):
            meta: dict[str, str] = {}
            for raw in lines[1:i]:
                if ":" in raw and not raw.startswith((" ", "\t", "#")):
                    k, _, v = raw.partition(":")
                    meta[k.strip()] = v.strip().strip("'\"")
            return meta, i + 1

    rep.error(1, "YAML front matter is never closed - expected a second '---'")
    return {}, 0


def check(path: str) -> Report:
    rep = Report(path)

    try:
        with open(path, encoding="utf-8") as fh:
            lines = fh.read().splitlines()
    except FileNotFoundError:
        rep.error(None, f"{path} does not exist - run /generate-cv to create it")
        return rep

    meta, start = split_front_matter(lines, rep)

    if not meta.get("name"):
        rep.error(None, "front matter is missing 'name:' - the masthead renders empty without it")

    # --- walk the body -----------------------------------------------------
    div_stack: list[tuple[str, int]] = []
    summary_count = 0
    grid_ranges: list[tuple[int, int]] = []   # (open_line, close_line), 1-based
    section = None                            # current h2, lower-cased
    role_headings: list[tuple[int, str]] = []
    in_experience = False

    for idx in range(start, len(lines)):
        n = idx + 1
        line = lines[idx]
        stripped = line.strip()

        # Fenced divs: ::: name  /  ::: {.name}  /  :::
        if stripped.startswith(":::"):
            body = stripped.lstrip(":").strip()
            if not body:
                if not div_stack:
                    rep.error(n, "closing ':::' with no matching opening fence")
                else:
                    name, open_line = div_stack.pop()
                    if name == "grid":
                        grid_ranges.append((open_line, n))
            else:
                name = body.strip("{}").lstrip(".").split()[0].lstrip(".")
                if name not in KNOWN_DIVS:
                    rep.error(
                        n,
                        f"unknown fenced div ':::{name}' - the stylesheet only "
                        f"styles {sorted(KNOWN_DIVS)}, so this would render unstyled",
                    )
                if name == "summary":
                    summary_count += 1
                div_stack.append((name, n))
            continue

        # Headings
        if stripped.startswith("#"):
            # A heading needs a blank line above it. Without one, pandoc folds it
            # into the paragraph or bullet before it as a lazy continuation line:
            # the section never opens, the heading text appears mid-sentence, and
            # everything under it is absorbed into the previous role. A fence or
            # another heading closes the block, so only running text can swallow
            # one.
            if idx > start:
                prev = lines[idx - 1].strip()
                if prev and not prev.startswith((":::", "#")):
                    rep.error(
                        n,
                        f"no blank line before '{stripped[:44]}'\n"
                        "      pandoc folds it into the block above instead of "
                        "starting a section",
                    )

            level = len(stripped) - len(stripped.lstrip("#"))
            text = stripped[level:].strip()

            if level == 1:
                rep.error(
                    n,
                    "'# ' heading in the body - the name comes from front matter "
                    "and the template renders the masthead; use '## ' for a section",
                )
            elif level == 2:
                section = text.lower()
                in_experience = bool(EXPERIENCE_HEADING.match(text.strip()))
            elif level == 3:
                if in_experience:
                    role_headings.append((n, text))
            elif level >= 4:
                rep.error(
                    n,
                    f"heading level {level} ('{text[:40]}') is deeper than the "
                    "stylesheet goes - use nested bullets instead of '####'",
                )
            continue

        # Contact details must not be committed.
        if UK_POSTCODE.search(line):
            rep.error(n, "looks like a postcode - the address is injected from $CV_ADDRESS at render time, never committed")
        if UK_PHONE.search(line):
            rep.error(n, "looks like a phone number - the phone is injected from $CV_PHONE at render time, never committed")

    for name, open_line in div_stack:
        rep.error(open_line, f"':::{name}' is never closed - add a ':::' fence")

    # --- summary -----------------------------------------------------------
    if summary_count == 0:
        rep.error(None, "no ':::summary' block - the opening paragraph will render as an ordinary paragraph")
    elif summary_count > 1:
        rep.error(None, f"{summary_count} ':::summary' blocks - there should be exactly one")

    # --- role headings -----------------------------------------------------
    if not role_headings:
        rep.warn(None, "no '### ' role headings under Professional Experience")

    for n, text in role_headings:
        m = ROLE_HEADING.match(text)
        if not m:
            rep.error(
                n,
                f"role heading does not parse: '{text[:60]}'\n"
                "      expected:  ### Company, Location - *Job Title*\n"
                "      the job title must be in *italics* or it renders in bold with the company",
            )
            continue

        # The line after the heading (skipping blanks) must be the date line.
        j = n
        while j < len(lines) and not lines[j].strip():
            j += 1
        if j >= len(lines):
            rep.error(n, "role heading has nothing after it - a date line is required")
            continue

        nxt = lines[j].strip()
        if nxt.startswith(("#", "-", "*", ":::")):
            rep.error(
                j + 1,
                f"expected a date line directly after '{text[:40]}', found '{nxt[:40]}'\n"
                "      the stylesheet styles the paragraph after a role heading as the dates",
            )
        elif not DATE_LINE.search(nxt):
            rep.warn(j + 1, f"date line '{nxt[:40]}' carries no year or 'Present'")

    # --- grids -------------------------------------------------------------
    for open_line, close_line in grid_ranges:
        body = lines[open_line:close_line - 1]
        items = [b for b in body if b.strip().startswith(("-", "*", "+"))]
        if not items:
            rep.error(open_line, "':::grid' contains no bullet list - it lays out a three-column list of items")
        for offset, b in enumerate(body):
            if b.startswith(("  -", "\t-", "  *", "\t*")):
                rep.error(
                    open_line + offset + 1,
                    "nested bullet inside ':::grid' - the competency columns take a flat list only",
                )
        if len(items) and len(items) < 3:
            rep.warn(open_line, f"only {len(items)} items in a three-column grid - it will look sparse")

    return rep


def main() -> int:
    path = sys.argv[1] if len(sys.argv) > 1 else "cv.md"
    rep = check(path)

    for w in rep.warnings:
        print(f"warning: {w}", file=sys.stderr)

    if rep.errors:
        print(f"\n{path} failed validation:\n", file=sys.stderr)
        for e in rep.errors:
            print(f"  error: {e}", file=sys.stderr)
        print(
            f"\n{len(rep.errors)} error(s). Fix these and re-run 'make'.\n",
            file=sys.stderr,
        )
        return 1

    print(f"{path}: ok" + (f" ({len(rep.warnings)} warning(s))" if rep.warnings else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
