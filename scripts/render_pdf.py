#!/usr/bin/env python3
"""Render dist/index.html to the PDF, repeating a role heading when its
bullets cross a page break.

A role that runs over the page break otherwise opens the new page with bare
bullets, and a reader (or an applicant tracking system working through the
extracted text) has to look back a page to find their subject. Only the
renderer knows where the break falls, so this cannot be written into cv.md or
decided by /generate-cv: this script renders once to find the break, and when
the page opens mid-role it injects

    <h3 class="continued">Company, Location - <em>Title</em> (Continued)</h3>

into the HTML at the break point and renders again. The heading carries
`break-before: page` (see style.css), so the break lands exactly where it
already fell and the new page opens with its subject named.

The unit moved to the new page is a whole top-level bullet. Where the natural
break falls inside one - mid-sentence, or between its sub-bullets - the whole
bullet goes to the new page rather than a heading landing mid-list, trading a
few empty lines at the foot of the page for a bullet that stays intact under
its heading. `make pages` still arbitrates the total length.

The modified HTML is written back over the input, so dist/index.html remains
the exact source of the PDF - the property the whole toolchain keeps.

Usage:  render_pdf.py dist/index.html dist/cv.pdf
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass

from weasyprint import HTML

# A4 with the 12mm top margin in style.css: content starts 45.4 CSS px down.
# An element within a line-height of that "starts the page"; anything lower
# has continuation content above it.
CONTENT_TOP = 45.4
TOP_TOLERANCE = 14

# Tags that matter: lists for bullet depth, headings for ownership.
TAG = re.compile(r"<(/?)(ul|ol|li|h2|h3)\b([^>]*)>")
ID_ATTR = re.compile(r'\bid="([^"]*)"')
CLASS_ATTR = re.compile(r'\bclass="([^"]*)"')

INJECTED = re.compile(
    r'\n?</ul>\n<h3 class="continued"[^>]*>.*?</h3>\n<ul>\n?', re.S
)

MAX_PASSES = 5


@dataclass
class Block:
    id: str
    kind: str          # 'h2' | 'h3' | 'li'
    pos: int           # offset of the opening '<' in the HTML
    depth: int = 0     # ul/ol nesting for li
    top_ancestor: str | None = None   # id of the depth-1 li this sits under
    inner: str = ""    # inner HTML, headings only
    classes: str = ""


def annotate(html: str) -> str:
    """Give every <li> an id so the rendered pages can be mapped back."""
    out, last, n = [], 0, 0
    for m in TAG.finditer(html):
        closing, tag, attrs = m.group(1), m.group(2), m.group(3)
        if tag == "li" and not closing and not ID_ATTR.search(attrs):
            n += 1
            out.append(html[last:m.start()])
            out.append(f'<li id="cvb-{n}"{attrs}>')
            last = m.end()
    out.append(html[last:])
    return "".join(out)


def index_blocks(html: str) -> list[Block]:
    blocks: list[Block] = []
    depth = 0
    current_top: str | None = None
    for m in TAG.finditer(html):
        closing, tag, attrs = m.group(1), m.group(2), m.group(3)
        if tag in ("ul", "ol"):
            depth += -1 if closing else 1
            continue
        if closing:
            continue
        id_m = ID_ATTR.search(attrs)
        if not id_m:
            continue
        cls = (CLASS_ATTR.search(attrs) or [None, ""])[1]
        if tag == "li":
            if depth == 1:
                current_top = id_m.group(1)
            blocks.append(Block(id_m.group(1), "li", m.start(), depth,
                                current_top if depth > 1 else id_m.group(1)))
        else:
            close = html.find(f"</{tag}>", m.end())
            inner = html[m.end():close].strip() if close != -1 else ""
            blocks.append(Block(id_m.group(1), tag, m.start(), classes=cls,
                                inner=inner))
    return blocks


def plain_text(inner: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", inner)).strip()


def find_injection(html: str, doc) -> tuple[int, str] | None:
    """Return (offset, heading html) for the first page that opens mid-role."""
    blocks = index_blocks(html)
    by_id = {b.id: b for b in blocks}

    first_page: dict[str, int] = {}
    y_pos: dict[str, float] = {}
    for pnum, page in enumerate(doc.pages):
        for name, (_x, y, *_rest) in page.anchors.items():
            if name not in first_page:
                first_page[name] = pnum
                y_pos[name] = y

    n_injected = len(re.findall(r'class="continued"', html))

    for p in range(1, len(doc.pages)):
        on_page = [b for b in blocks if first_page.get(b.id) == p]
        if not on_page:
            continue
        first = on_page[0]
        starts_top = y_pos[first.id] <= CONTENT_TOP + TOP_TOLERANCE

        if first.kind in ("h2", "h3") and starts_top:
            continue    # the page opens with its own heading - nothing to do

        # The block owning the top of the page: the first clean top-level
        # bullet, or the top-level ancestor of whatever straddles the break.
        if first.kind == "li" and starts_top and first.depth == 1:
            target = first
        else:
            prev = [b for b in blocks if b.kind == "li" and b.pos < first.pos]
            owner = first if (first.kind == "li" and starts_top) else \
                (prev[-1] if prev else None)
            if owner is None or owner.top_ancestor not in by_id:
                continue
            target = by_id[owner.top_ancestor]

        role = None
        for b in blocks:
            if b.pos >= target.pos:
                break
            if b.kind == "h3" and "continued" not in b.classes:
                role = b
        if role is None:
            continue

        heading = (
            f'</ul>\n<h3 class="continued" id="continued-{n_injected + 1}">'
            f'{role.inner} <span class="continued-marker">(Continued)</span>'
            f"</h3>\n<ul>\n"
        )
        print(f"page {p + 1} opens mid-role - repeating "
              f"'{plain_text(role.inner)}'")
        return target.pos, heading

    return None


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    html_path, pdf_path = sys.argv[1], sys.argv[2]

    with open(html_path, encoding="utf-8") as fh:
        html = annotate(INJECTED.sub("", fh.read()))

    for _ in range(MAX_PASSES):
        with open(html_path, "w", encoding="utf-8") as fh:
            fh.write(html)
        doc = HTML(html_path).render()
        injection = find_injection(html, doc)
        if injection is None:
            break
        pos, heading = injection
        html = html[:pos] + heading + html[pos:]
    else:
        print("warning: continued-heading passes did not converge",
              file=sys.stderr)

    # pdf/ua-1 emits a tagged PDF: a structure tree of real H2/H3, P and L/LI
    # elements alongside the page content, so anything reading the file back
    # gets stated reading order rather than glyph-position guesswork.
    doc.write_pdf(pdf_path, pdf_variant="pdf/ua-1")
    return 0


if __name__ == "__main__":
    sys.exit(main())
