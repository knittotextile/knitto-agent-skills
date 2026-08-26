#!/usr/bin/env python3
"""Build a custom, self-contained E2E report from playwright-results.json.

Reads docs/qa/playwright-results.json (the Playwright json reporter's
output) and writes docs/qa/report.html — a single portable file, screenshots
embedded as base64. Grouped by describe-block (matching test-case-matrix's
categories). Click a test case row to expand its steps + every screenshot
recorded during it (not just the final one); click any screenshot to open
it full-size in a lightbox with prev/next between that test's media.

Steps and multiple screenshots per test only show up here if the spec
actually records them — wrap actions in the `stepShot` helper from
assets/step-shot-helper.ts (or your own `test.step()` + `testInfo.attach()`
calls) instead of writing a flat test body. A test with no steps/attachments
still renders fine, just with an empty steps list and zero photos.

Usage:
    python scripts/build_report.py
"""
import base64
import html
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESULTS_PATH = ROOT / "docs" / "qa" / "playwright-results.json"
OUT_PATH = ROOT / "docs" / "qa" / "report.html"

STATUS_META = {
    "passed": ("PASS", "#16a34a", "#16a34a1a"),
    "failed": ("FAIL", "#dc2626", "#dc26261a"),
    "timedOut": ("TIMEOUT", "#dc2626", "#dc26261a"),
    "flaky": ("FLAKY", "#d97706", "#d977061a"),
    "skipped": ("SKIP", "#6b7280", "#6b72801a"),
    "interrupted": ("INTERRUPTED", "#6b7280", "#6b72801a"),
}


def embed_image(path_str: str | None) -> str | None:
    if not path_str:
        return None
    path = Path(path_str)
    if not path.is_file():
        return None
    try:
        data = base64.b64encode(path.read_bytes()).decode("ascii")
        return f"data:image/png;base64,{data}"
    except OSError:
        return None


def collect_groups(suites, groups):
    """Walk Playwright's nested suite tree, grouping specs by the innermost
    describe-block title (e.g. 'Auth P0')."""
    for suite in suites:
        nested = suite.get("suites", [])
        specs = suite.get("specs", [])
        if specs:
            bucket = groups.setdefault(suite["title"], [])
            for spec in specs:
                for test in spec.get("tests", []):
                    results = test.get("results", [])
                    if not results:
                        continue
                    result = results[-1]  # final result after any retries

                    media = []
                    for att in result.get("attachments", []):
                        if not att.get("contentType", "").startswith("image/"):
                            continue
                        data_uri = embed_image(att.get("path"))
                        if data_uri:
                            media.append({"name": att.get("name", "screenshot"), "src": data_uri})

                    steps = [
                        {"title": s.get("title", ""), "duration": s.get("duration", 0)}
                        for s in result.get("steps", [])
                        if s.get("title")
                    ]

                    bucket.append(
                        {
                            "title": spec["title"],
                            "status": result.get("status", "unknown"),
                            "duration": result.get("duration", 0),
                            "retries": len(results) - 1,
                            "steps": steps,
                            "media": media,
                        }
                    )
        if nested:
            collect_groups(nested, groups)


def render(groups: dict, meta: dict) -> str:
    total = passed = failed = flaky = skipped = 0
    total_duration = 0
    sections_html = []
    galleries_js = {}  # case_id -> [data uri, ...] for the lightbox
    case_counter = 0

    for group_name, cases in groups.items():
        rows = []
        for case in cases:
            case_counter += 1
            case_id = f"c{case_counter}"
            total += 1
            total_duration += case["duration"]
            status = case["status"]
            if status == "passed":
                passed += 1
            elif status in ("failed", "timedOut", "interrupted"):
                failed += 1
            elif status == "flaky":
                flaky += 1
            elif status == "skipped":
                skipped += 1

            label, color, bg = STATUS_META.get(status, (status.upper(), "#6b7280", "#6b72801a"))
            media = case["media"]
            galleries_js[case_id] = [m["src"] for m in media]

            retry_note = f' <span class="retry-note">({case["retries"]} retry)</span>' if case["retries"] else ""
            media_count_badge = (
                f'<span class="media-count">{len(media)} photo</span>'
                if len(media) != 1
                else '<span class="media-count">1 photo</span>'
            )
            if not media:
                media_count_badge = '<span class="media-count muted">no photo</span>'

            # Main row — click to expand the detail row below it.
            rows.append(
                f'<tr class="case-row" data-target="{case_id}">'
                f'<td><span class="status-pill" style="color:{color};background:{bg}">{label}</span></td>'
                f'<td class="title-cell">{html.escape(case["title"])}{retry_note}</td>'
                f'<td class="dur-cell">{case["duration"] / 1000:.1f}s</td>'
                f'<td class="meta-cell">{media_count_badge} <span class="chevron">▾</span></td>'
                f"</tr>"
            )

            # Detail row — steps list + full media strip, hidden by default.
            steps_html = "".join(
                f'<li><span class="step-title">{html.escape(s["title"])}</span>'
                f'<span class="step-dur">{s["duration"] / 1000:.1f}s</span></li>'
                for s in case["steps"]
            ) or '<li class="no-steps">No step detail recorded for this test.</li>'

            media_html = "".join(
                f'<button class="thumb-btn" data-case="{case_id}" data-index="{i}">'
                f'<img class="thumb" src="{m["src"]}" alt="{html.escape(m["name"])}" loading="lazy">'
                f'<span class="thumb-label">{html.escape(m["name"])}</span>'
                f"</button>"
                for i, m in enumerate(media)
            ) or '<p class="no-shot">No screenshots captured.</p>'

            rows.append(
                f'<tr class="detail-row" id="detail-{case_id}" hidden>'
                f'<td colspan="4">'
                f'<div class="detail-grid">'
                f'<div class="steps-col"><h4>Steps</h4><ol class="steps-list">{steps_html}</ol></div>'
                f'<div class="media-col"><h4>Screenshots</h4><div class="thumb-grid">{media_html}</div></div>'
                f"</div>"
                f"</td></tr>"
            )
        sections_html.append(
            f'<section class="group">'
            f'<h2>{html.escape(group_name)} <span class="group-count">{len(cases)} test</span></h2>'
            f'<table><tbody>{"".join(rows)}</tbody></table>'
            f"</section>"
        )

    pass_rate = f"{(passed / total * 100):.0f}%" if total else "—"

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>E2E Report — {html.escape(meta.get("project", "webapp"))}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {{
  --bg: #f8fafc; --card-bg: #ffffff; --border: #e2e8f0;
  --text: #0f172a; --text-muted: #64748b; --accent: #2563eb; --hover: #f1f5f9;
}}
@media (prefers-color-scheme: dark) {{
  :root {{
    --bg: #0b1220; --card-bg: #131c2e; --border: #253148;
    --text: #e5e9f0; --text-muted: #93a0b4; --accent: #60a5fa; --hover: #1a2540;
  }}
}}
* {{ box-sizing: border-box; }}
body {{
  margin: 0; padding: 2rem 1.5rem 4rem;
  background: var(--bg); color: var(--text);
  font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
}}
.wrap {{ max-width: 1050px; margin: 0 auto; }}
header {{ margin-bottom: 1.5rem; }}
h1 {{ font-size: 1.4rem; margin: 0 0 .25rem; }}
.meta {{ color: var(--text-muted); font-size: .85rem; }}
.summary {{
  display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: .75rem; margin: 1.25rem 0 2rem;
}}
.stat {{
  background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px;
  padding: .9rem 1rem;
}}
.stat .n {{ font-size: 1.5rem; font-weight: 700; line-height: 1.1; }}
.stat .l {{ color: var(--text-muted); font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; margin-top: .2rem; }}
.stat.passed .n {{ color: #16a34a; }}
.stat.failed .n {{ color: #dc2626; }}
.stat.flaky .n {{ color: #d97706; }}
.group {{
  background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px;
  padding: 1rem 1.25rem; margin-bottom: 1rem; overflow-x: auto;
}}
.group h2 {{ font-size: 1rem; margin: 0 0 .75rem; display: flex; align-items: baseline; gap: .5rem; }}
.group-count {{ font-size: .75rem; color: var(--text-muted); font-weight: 400; }}
table {{ width: 100%; border-collapse: collapse; min-width: 560px; }}
td {{ padding: .6rem .4rem; border-top: 1px solid var(--border); vertical-align: middle; }}
tr.case-row:first-child td {{ border-top: none; }}
tr.case-row {{ cursor: pointer; }}
tr.case-row:hover td {{ background: var(--hover); }}
.status-pill {{
  display: inline-block; font-size: .68rem; font-weight: 700; letter-spacing: .03em;
  padding: .2rem .5rem; border-radius: 999px; white-space: nowrap;
}}
.title-cell {{ width: 100%; }}
.retry-note {{ color: var(--text-muted); font-size: .75rem; }}
.dur-cell {{ color: var(--text-muted); white-space: nowrap; font-variant-numeric: tabular-nums; }}
.meta-cell {{ white-space: nowrap; color: var(--text-muted); font-size: .8rem; }}
.media-count.muted {{ opacity: .6; }}
.chevron {{ display: inline-block; margin-left: .35rem; transition: transform .15s; }}
tr.case-row.open .chevron {{ transform: rotate(180deg); }}
.detail-row td {{ padding: 0; border-top: none; }}
.detail-grid {{
  display: grid; grid-template-columns: minmax(160px, 260px) 1fr; gap: 1.25rem;
  padding: 1rem; background: var(--hover); border-radius: 8px; margin: 0 0 .75rem;
}}
.detail-grid h4 {{ margin: 0 0 .5rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }}
.steps-list {{ margin: 0; padding-left: 1.1rem; }}
.steps-list li {{ display: flex; justify-content: space-between; gap: .5rem; padding: .2rem 0; font-size: .85rem; }}
.step-dur {{ color: var(--text-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }}
.no-steps {{ list-style: none; margin-left: -1.1rem; color: var(--text-muted); font-size: .85rem; }}
.thumb-grid {{ display: flex; flex-wrap: wrap; gap: .6rem; }}
.thumb-btn {{
  border: 1px solid var(--border); background: var(--card-bg); border-radius: 8px;
  padding: .35rem; cursor: pointer; width: 128px; text-align: left; font: inherit; color: inherit;
}}
.thumb-btn:hover {{ border-color: var(--accent); }}
.thumb {{ width: 100%; height: 76px; object-fit: cover; border-radius: 5px; display: block; }}
.thumb-label {{ display: block; font-size: .68rem; color: var(--text-muted); margin-top: .3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }}
.no-shot {{ color: var(--text-muted); font-size: .85rem; margin: 0; }}
footer {{ text-align: center; color: var(--text-muted); font-size: .75rem; margin-top: 2rem; }}

#lightbox {{
  position: fixed; inset: 0; background: rgba(0,0,0,.85); display: none;
  align-items: center; justify-content: center; z-index: 100; padding: 3rem 1rem;
}}
#lightbox.open {{ display: flex; }}
#lightbox img {{ max-width: 100%; max-height: 100%; border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,.5); }}
#lightbox .lb-close, #lightbox .lb-prev, #lightbox .lb-next {{
  position: fixed; background: rgba(255,255,255,.12); color: #fff; border: none;
  border-radius: 999px; width: 42px; height: 42px; font-size: 1.1rem; cursor: pointer;
}}
#lightbox .lb-close {{ top: 1.25rem; right: 1.25rem; }}
#lightbox .lb-prev {{ left: 1.25rem; top: 50%; transform: translateY(-50%); }}
#lightbox .lb-next {{ right: 1.25rem; top: 50%; transform: translateY(-50%); }}
#lightbox .lb-caption {{ position: fixed; bottom: 1.5rem; left: 0; right: 0; text-align: center; color: #cbd5e1; font-size: .8rem; }}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>E2E Test Report</h1>
    <div class="meta">{html.escape(meta.get("project", ""))} · generated {html.escape(meta.get("generated", ""))}</div>
  </header>
  <div class="summary">
    <div class="stat"><div class="n">{total}</div><div class="l">Total</div></div>
    <div class="stat passed"><div class="n">{passed}</div><div class="l">Passed</div></div>
    <div class="stat failed"><div class="n">{failed}</div><div class="l">Failed</div></div>
    <div class="stat flaky"><div class="n">{flaky}</div><div class="l">Flaky</div></div>
    <div class="stat"><div class="n">{skipped}</div><div class="l">Skipped</div></div>
    <div class="stat"><div class="n">{pass_rate}</div><div class="l">Pass rate</div></div>
    <div class="stat"><div class="n">{total_duration / 1000:.1f}s</div><div class="l">Duration</div></div>
  </div>
  {"".join(sections_html)}
  <footer>Generated by webapp-testing's build_report.py — click a test case to see its steps and screenshots, click a screenshot to view it full size.</footer>
</div>

<div id="lightbox">
  <button class="lb-close" id="lbClose">✕</button>
  <button class="lb-prev" id="lbPrev">‹</button>
  <img id="lbImg" src="" alt="">
  <button class="lb-next" id="lbNext">›</button>
  <div class="lb-caption" id="lbCaption"></div>
</div>

<script>
const GALLERIES = {json.dumps(galleries_js)};
let currentGallery = [];
let currentIndex = 0;

document.querySelectorAll('.case-row').forEach(row => {{
  row.addEventListener('click', () => {{
    const id = row.dataset.target;
    const detail = document.getElementById('detail-' + id);
    const isOpen = row.classList.toggle('open');
    detail.hidden = !isOpen;
  }});
}});

function openLightbox(caseId, index) {{
  currentGallery = GALLERIES[caseId] || [];
  currentIndex = index;
  if (!currentGallery.length) return;
  render_();
  document.getElementById('lightbox').classList.add('open');
}}
function render_() {{
  document.getElementById('lbImg').src = currentGallery[currentIndex];
  document.getElementById('lbCaption').textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
}}
function closeLightbox() {{
  document.getElementById('lightbox').classList.remove('open');
}}
function step_(delta) {{
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + delta + currentGallery.length) % currentGallery.length;
  render_();
}}

document.querySelectorAll('.thumb-btn').forEach(btn => {{
  btn.addEventListener('click', (e) => {{
    e.stopPropagation();
    openLightbox(btn.dataset.case, parseInt(btn.dataset.index, 10));
  }});
}});
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => step_(-1));
document.getElementById('lbNext').addEventListener('click', () => step_(1));
document.getElementById('lightbox').addEventListener('click', (e) => {{
  if (e.target.id === 'lightbox') closeLightbox();
}});
document.addEventListener('keydown', (e) => {{
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step_(-1);
  if (e.key === 'ArrowRight') step_(1);
}});
</script>
</body>
</html>
"""


def main() -> int:
    if not RESULTS_PATH.is_file():
        print(f"error: {RESULTS_PATH} not found — run the suite first (run_e2e.py)", file=sys.stderr)
        return 1

    data = json.loads(RESULTS_PATH.read_text(encoding="utf-8"))
    groups: dict[str, list] = {}
    collect_groups(data.get("suites", []), groups)

    meta = {"project": ROOT.name, "generated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(render(groups, meta), encoding="utf-8")
    print(f"Report written to {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
