#!/usr/bin/env python3
"""Post-process Playwright's own HTML report to add video speed controls.

Playwright's built-in `html` reporter (enabled in playwright.config.ts)
already writes docs/qa/playwright-report/index.html with everything a
report needs: status filters (All/Passed/Failed/Flaky/Skipped) with
counts, a search box, per-test steps, file:line locations, browser
project badges, and retries as tabs. This script does not reimplement any
of that — it only appends one small vanilla-JS snippet before `</body>`
that finds `<video>` elements (a plain HTML5 tag, not part of Playwright's
internal React bundle, so this stays stable across Playwright versions)
and adds slow-motion playback controls next to them, since a real run is
fast enough to be hard to follow at 1x.

Usage:
    python scripts/build_report.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPORT_PATH = ROOT / "docs" / "qa" / "playwright-report" / "index.html"

MARKER = "<!-- webapp-testing:video-speed-controls -->"

DEFAULT_PLAYBACK_RATE = 0.5

INJECTED_SCRIPT = f"""{MARKER}
<style>
.wt-speed-controls {{
  display: flex; align-items: center; gap: .3rem; margin: .4rem 0 0;
  font: 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}}
.wt-speed-controls span {{ color: var(--color-fg-muted, #666); margin-right: .2rem; }}
.wt-speed-btn {{
  border: 1px solid var(--color-border-default, #d0d7de); background: var(--color-canvas-default, #fff);
  color: var(--color-fg-default, #1f2328); border-radius: 6px; padding: .15rem .45rem;
  font-size: .72rem; cursor: pointer; font-variant-numeric: tabular-nums;
}}
.wt-speed-btn:hover {{ border-color: #2563eb; }}
.wt-speed-btn.active {{ background: #2563eb; border-color: #2563eb; color: #fff; }}
</style>
<script>
(function () {{
  var DEFAULT_RATE = {DEFAULT_PLAYBACK_RATE};
  var RATES = [0.25, 0.5, 1, 1.5];

  function enhance(video) {{
    if (video.dataset.wtEnhanced) return;
    video.dataset.wtEnhanced = "1";
    video.defaultPlaybackRate = DEFAULT_RATE;
    video.playbackRate = DEFAULT_RATE;

    var bar = document.createElement("div");
    bar.className = "wt-speed-controls";
    var label = document.createElement("span");
    label.textContent = "Speed:";
    bar.appendChild(label);
    RATES.forEach(function (rate) {{
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wt-speed-btn" + (rate === DEFAULT_RATE ? " active" : "");
      btn.textContent = rate + "\\u00d7";
      btn.addEventListener("click", function () {{
        video.playbackRate = rate;
        bar.querySelectorAll(".wt-speed-btn").forEach(function (b) {{
          b.classList.toggle("active", b === btn);
        }});
      }});
      bar.appendChild(btn);
    }});
    if (video.parentNode) {{
      video.parentNode.insertBefore(bar, video.nextSibling);
    }}
  }}

  function sweep() {{
    document.querySelectorAll("video").forEach(enhance);
  }}

  sweep();
  new MutationObserver(sweep).observe(document.body, {{ childList: true, subtree: true }});
}})();
</script>
"""


def main() -> int:
    if not REPORT_PATH.is_file():
        print(f"error: {REPORT_PATH} not found — run the suite first (run_e2e.py)", file=sys.stderr)
        return 1

    html = REPORT_PATH.read_text(encoding="utf-8")
    if MARKER in html:
        print(f"{REPORT_PATH} already has video speed controls injected — nothing to do")
        return 0

    if "</body>" not in html:
        print(f"error: {REPORT_PATH} has no </body> tag — unexpected report format", file=sys.stderr)
        return 1

    html = html.replace("</body>", INJECTED_SCRIPT + "</body>")
    REPORT_PATH.write_text(html, encoding="utf-8")
    print(f"Added video speed controls to {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
