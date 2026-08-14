#!/usr/bin/env python3
"""Move the artefacts of one application out of dist/ and into its record.

`dist/` is build output and `make clean` empties it, so the CV that was actually
sent has to leave before it is regenerated for the next application. This moves
it - and any covering letter or application answers written alongside it - into
`applications/<slug>/`, which is where the record of that application lives.

    python3 scripts/file_application.py montu-uk-tech-lead \
        --cv "dist/CV-Shaun-Parsons-Montu -2026-08-01.pdf" \
        --note dist/covering-letter-montu.md

The moves are the deterministic half of filing an application; writing the
record around them is not, and stays with the skill that asks for this.
"""

import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPLICATIONS = ROOT / "applications"
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def die(message):
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def tidy(name):
    """Normalise a filename that came out of the renderer.

    `make dated` builds the name from the tailored-for line in cv.md, so a
    trailing space or a double space arrives intact and then has to be quoted
    forever after. Collapse it here rather than living with it.
    """
    stem, dot, suffix = name.rpartition(".")
    stem = re.sub(r"\s+", " ", stem).strip().replace(" -", "-").replace("- ", "-")
    return f"{stem}{dot}{suffix}"


def move(source, target_dir, force):
    source = Path(source)
    if not source.is_file():
        die(f"{source} is not a file")
    target = target_dir / tidy(source.name)
    if target.exists() and not force:
        die(f"{target} already exists - pass --force to replace it")
    shutil.move(str(source), str(target))
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", help="the application's directory under applications/")
    parser.add_argument("--cv", help="the dated CV PDF to file")
    parser.add_argument("--note", action="append", default=[],
                        help="a covering letter, application answers or similar; repeatable")
    parser.add_argument("--force", action="store_true",
                        help="replace a file of the same name in the record")
    args = parser.parse_args()

    if not SLUG.match(args.slug):
        die(f"'{args.slug}' is not a slug - lower case, digits and hyphens, e.g. montu-uk-tech-lead")
    if not args.cv and not args.note:
        die("nothing to file - pass --cv, --note, or both")

    target_dir = APPLICATIONS / args.slug
    record = target_dir / "application.md"
    if not record.is_file():
        die(f"no record at {record.relative_to(ROOT)} - write it from applications/TEMPLATE.md first")

    moved = []
    if args.cv:
        moved.append(move(args.cv, target_dir, args.force))
    for note in args.note:
        moved.append(move(note, target_dir, args.force))

    for path in moved:
        print(f"filed {path.relative_to(ROOT)}")
    print(f"\nnow name them in {record.relative_to(ROOT)}: `cv:` in the frontmatter, "
          f"the rest under `## Materials sent`.")


if __name__ == "__main__":
    main()
