#!/usr/bin/env python3
"""Generate an oblique companion face for PT Mono.

PT Mono ships in a single regular weight with no italic, and neither WeasyPrint
nor a browser will reliably synthesise one for a webfont - job titles come out
upright, and the CV loses the distinction between company and role. Rather than
depend on that synthesis, shear the outlines once and vendor the result.

Advance widths are untouched, so the face stays monospaced and metric-compatible
with the regular.

    python3 scripts/make_oblique.py assets/fonts/PTMono-Regular.ttf

Run this only when the upstream font is replaced; the output is committed.
"""

from __future__ import annotations

import math
import sys

from fontTools.misc.transform import Identity
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

SLANT_DEGREES = 12.0


def oblique(src: str, dst: str, degrees: float = SLANT_DEGREES) -> None:
    font = TTFont(src)
    glyf = font["glyf"]
    glyph_set = font.getGlyphSet()
    shear = Identity.skew(math.radians(degrees), 0)

    for name in font.getGlyphOrder():
        pen = TTGlyphPen(glyph_set)
        glyph_set[name].draw(TransformPen(pen, shear))
        glyf[name] = pen.glyph()

    # Keep hmtx advances as they were - shearing must not break the monospace
    # grid - but recompute the side bearings from the new outlines.
    hmtx = font["hmtx"]
    for name in font.getGlyphOrder():
        advance, _ = hmtx[name]
        g = glyf[name]
        g.recalcBounds(glyf)
        hmtx[name] = (advance, getattr(g, "xMin", 0))

    # Declare the face as italic so the CSS font-style match is exact.
    font["head"].macStyle |= 0b10
    font["post"].italicAngle = -degrees
    os2 = font["OS/2"]
    # Clear BOLD (bit 5) and REGULAR (bit 6), set ITALIC (bit 0). Leaving
    # REGULAR set alongside ITALIC is contradictory and fontTools warns on it.
    os2.fsSelection = (os2.fsSelection & ~(1 << 6) & ~(1 << 5)) | (1 << 0)

    name_table = font["name"]
    for record in name_table.names:
        try:
            value = record.toUnicode()
        except UnicodeDecodeError:
            continue
        if record.nameID in (2, 17):
            record.string = "Italic"
        elif record.nameID in (4, 6, 18) and "Regular" in value:
            record.string = value.replace("Regular", "Italic")

    font.flavor = None
    font.save(dst)
    print(f"wrote {dst} ({degrees}° oblique)")

    font.flavor = "woff2"
    woff2 = dst.replace(".ttf", ".woff2")
    font.save(woff2)
    print(f"wrote {woff2}")


if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else "assets/fonts/PTMono-Regular.ttf"
    oblique(source, source.replace("-Regular.ttf", "-Italic.ttf"))
