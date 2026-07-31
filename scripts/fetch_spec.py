#!/usr/bin/env python3
"""Pull a job spec down to plain text, from a URL, a PDF or a local file.

The tailoring step reads the spec and decides what to emphasise. That decision
is a judgement call, but *getting hold of the text* should not be - this script
does the fetching so the same spec always yields the same input, whatever it
arrived as.

    python3 scripts/fetch_spec.py https://example.com/jobs/123
    python3 scripts/fetch_spec.py ~/Downloads/role.pdf
    python3 scripts/fetch_spec.py spec.txt --out .job-spec.txt
"""

from __future__ import annotations

import argparse
import html
import http.client
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) cv-fetch-spec/1.0"

# Chrome and script content never carry the spec, and stripping them first stops
# a page of navigation drowning the requirements.
DROP_BLOCKS = re.compile(
    r"<(script|style|noscript|svg|head|nav|footer|header)\b.*?</\1>",
    re.I | re.S,
)
BLOCK_END = re.compile(r"</(p|div|li|tr|h[1-6]|section|article|br)\s*>", re.I)
TAG = re.compile(r"<[^>]+>")


def from_url(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            ctype = resp.headers.get("Content-Type", "")
            raw = resp.read()
    except urllib.error.HTTPError as exc:
        sys.exit(f"fetch_spec: {url} returned HTTP {exc.code} {exc.reason}")
    except urllib.error.URLError as exc:
        sys.exit(f"fetch_spec: could not reach {url} - {exc.reason}")
    except (OSError, http.client.HTTPException) as exc:
        # Job boards behind a CDN often just drop the connection on a
        # non-browser client rather than answering.
        sys.exit(
            f"fetch_spec: {url} closed the connection ({type(exc).__name__}). "
            "Copy the spec text into a file and pass that instead."
        )

    if "pdf" in ctype.lower() or url.lower().endswith(".pdf"):
        tmp = ".job-spec-download.pdf"
        with open(tmp, "wb") as fh:
            fh.write(raw)
        try:
            return from_pdf(tmp)
        finally:
            os.unlink(tmp)

    charset = "utf-8"
    if "charset=" in ctype:
        charset = ctype.split("charset=")[-1].split(";")[0].strip() or "utf-8"
    return strip_html(raw.decode(charset, errors="replace"))


def strip_html(doc: str) -> str:
    doc = DROP_BLOCKS.sub(" ", doc)
    doc = BLOCK_END.sub("\n", doc)
    doc = TAG.sub(" ", doc)
    doc = html.unescape(doc)
    doc = re.sub(r"[ \t\xa0]+", " ", doc)
    doc = re.sub(r" *\n *", "\n", doc)
    doc = re.sub(r"\n{3,}", "\n\n", doc)
    return doc.strip()


def from_pdf(path: str) -> str:
    if not shutil.which("pdftotext"):
        sys.exit(
            "fetch_spec: pdftotext not found - install poppler-utils "
            "(apt install poppler-utils) to read a PDF job spec"
        )
    out = subprocess.run(
        ["pdftotext", "-layout", path, "-"],
        capture_output=True,
        text=True,
    )
    if out.returncode != 0:
        sys.exit(f"fetch_spec: pdftotext failed on {path}\n{out.stderr.strip()}")
    return re.sub(r"\n{3,}", "\n\n", out.stdout).strip()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", help="URL, PDF path, or plain text/markdown file")
    ap.add_argument("--out", help="write here instead of stdout")
    args = ap.parse_args()

    src = os.path.expanduser(args.source)

    if src.lower().startswith(("http://", "https://")):
        text = from_url(src)
    elif not os.path.exists(src):
        sys.exit(f"fetch_spec: no such file - {src}")
    elif src.lower().endswith(".pdf"):
        text = from_pdf(src)
    else:
        with open(src, encoding="utf-8", errors="replace") as fh:
            text = fh.read().strip()

    if len(text) < 200:
        print(
            f"fetch_spec: warning - only {len(text)} characters extracted; "
            "the spec may be behind JavaScript or a login, in which case paste "
            "the text into a file and pass that instead",
            file=sys.stderr,
        )

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(text + "\n")
        print(f"wrote {args.out} ({len(text)} characters)")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
