#!/usr/bin/env python3
"""Write the preprint's authorship into the PDF metadata.

Chrome copies the document title into the PDF but drops <meta name="author">,
so a preprint lands in a reader's library with no authors on it. This fills
Author, Subject and Keywords from the same strings the paper prints, so the
file and the paper cannot disagree.

    python3 set_pdf_metadata.py <pdf> [<pdf> ...]
"""
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter

TITLE = ("Four Gaps and One Chain: Where Thailand’s Smart-City and "
         "Digital-Government Promotion Stops Short of Action")
AUTHOR = "Poon Thiengburanathum; Non Arkaraprasertkul"
SUBJECT = ("Preprint v1.0 — SCITI Research Series. Why Thailand’s smart cities and "
           "digital government stall between monitoring and push, measured across 118 "
           "city records, 76 headline projects and four open audits.")
KEYWORDS = ("smart city; digital government; Thailand; inter-agency coordination; "
            "public procurement; open data; monitoring-to-push chain; early warning")


def stamp(path: Path) -> None:
    reader = PdfReader(str(path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata({
        "/Title": TITLE,
        "/Author": AUTHOR,
        "/Subject": SUBJECT,
        "/Keywords": KEYWORDS,
        "/Creator": "SCITI Research Series — research/smart-city-gaps/build.mjs",
    })
    with open(path, "wb") as fh:
        writer.write(fh)
    check = PdfReader(str(path)).metadata
    print(f"  {path.name}: author={check.author!r} title={check.title[:48]!r}…")


if __name__ == "__main__":
    targets = [Path(a) for a in sys.argv[1:]]
    if not targets:
        targets = [Path(__file__).parent / "SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf"]
    for t in targets:
        stamp(t)
