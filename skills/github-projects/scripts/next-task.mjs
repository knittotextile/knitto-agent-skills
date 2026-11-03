#!/usr/bin/env node
// next-task.mjs — list issues that can be picked up now: open, Status Ready
// or Backlog, Wave not Tracking, and every `Depends:` issue Done/closed.
// Sorted by Wave (lowest first), Ready before Backlog, then Target Date.
// Read-only.
//
// Usage:
//   node scripts/next-task.mjs [--application Studio] [--assignee login] [--wave W2]
//     [--limit 10] [--all] [--json]
//
// --all also lists blocked items, with the dependency that blocks them.

import { parseArgs, boardConfig, run, getProject, getItems, parseDepends, waveRank, refKey, getIssue, requireWave } from "./lib.mjs";

const PICKABLE = ["ready", "backlog"];

run(() => {
  const { flags } = parseArgs();
  const project = getProject(boardConfig(flags));
  requireWave(project);
  const items = getItems(project);
  const byKey = new Map(items.filter((i) => i.key).map((i) => [i.key, i]));
  const offBoard = new Map();

  const isDone = (ref) => {
    const k = refKey(ref);
    const it = byKey.get(k);
    if (it) return it.values.Status === "Done" || it.state === "CLOSED";
    if (!offBoard.has(k)) {
      try { offBoard.set(k, getIssue(ref).state === "CLOSED"); } catch { offBoard.set(k, false); }
    }
    return offBoard.get(k);
  };

  const eq = (a, b) => String(a ?? "").toLowerCase() === String(b).toLowerCase();
  const rows = items
    .filter((i) => !i.draft && i.state === "OPEN")
    .filter((i) => PICKABLE.includes(String(i.values.Status ?? "").toLowerCase()))
    .filter((i) => i.values.Wave && !eq(i.values.Wave, "Tracking"))
    .filter((i) => !flags.application || eq(i.values.Application, flags.application))
    .filter((i) => !flags.assignee || i.assignees.some((a) => eq(a, flags.assignee)))
    .filter((i) => !flags.wave || eq(i.values.Wave, flags.wave))
    .map((i) => {
      const blockedBy = parseDepends(i.body, i.repo).filter((d) => !isDone(d)).map(refKey);
      return { ...i, blockedBy };
    })
    .filter((i) => flags.all || i.blockedBy.length === 0)
    .sort((a, b) =>
      waveRank(a.values.Wave) - waveRank(b.values.Wave) ||
      PICKABLE.indexOf(a.values.Status.toLowerCase()) - PICKABLE.indexOf(b.values.Status.toLowerCase()) ||
      String(a.values["Target Date"] ?? "9999").localeCompare(String(b.values["Target Date"] ?? "9999")),
    )
    .slice(0, Number(flags.limit || 20));

  if (flags.json) { console.log(JSON.stringify(rows.map(({ body, ...r }) => r), null, 2)); return; }
  if (!rows.length) { console.log("Tidak ada task yang bisa dikerjakan sekarang."); return; }
  for (const r of rows) {
    const v = r.values;
    const meta = [v.Wave, v.Status, v.Application, r.assignees.join(",") || null, v.Estimate != null ? `${v.Estimate}j` : null, v["Target Date"]]
      .filter(Boolean).join(" | ");
    console.log(`${r.blockedBy.length ? "BLOCKED " : ""}${r.key}  ${r.title}\n    ${meta}${r.blockedBy.length ? `\n    menunggu: ${r.blockedBy.join(", ")}` : ""}\n    ${r.url}`);
  }
});
