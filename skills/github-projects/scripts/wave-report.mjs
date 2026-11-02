#!/usr/bin/env node
// wave-report.mjs — progress per Wave: item count per Status and Estimate
// hours done/total. Tracking items are excluded. Read-only.
//
// Usage:
//   node scripts/wave-report.mjs [--application Studio] [--assignee login] [--json]

import { parseArgs, boardConfig, run, getProject, getItems, waveRank } from "./lib.mjs";

const STATUSES = ["Backlog", "Ready", "In Progress", "Done"];

run(() => {
  const { flags } = parseArgs();
  const project = getProject(boardConfig(flags));
  const eq = (a, b) => String(a ?? "").toLowerCase() === String(b).toLowerCase();
  const items = getItems(project)
    .filter((i) => !eq(i.values.Wave, "Tracking"))
    .filter((i) => !flags.application || eq(i.values.Application, flags.application))
    .filter((i) => !flags.assignee || i.assignees.some((a) => eq(a, flags.assignee)));

  const waves = new Map();
  for (const i of items) {
    const w = i.values.Wave || "(tanpa Wave)";
    if (!waves.has(w)) waves.set(w, { wave: w, total: 0, est: 0, estDone: 0, ...Object.fromEntries(STATUSES.map((s) => [s, 0])) });
    const r = waves.get(w);
    const status = STATUSES.includes(i.values.Status) ? i.values.Status : "Backlog";
    r.total++;
    r[status]++;
    const est = Number(i.values.Estimate) || 0;
    r.est += est;
    if (status === "Done") r.estDone += est;
  }
  const rows = [...waves.values()].sort((a, b) => waveRank(a.wave) - waveRank(b.wave));

  if (flags.json) { console.log(JSON.stringify(rows, null, 2)); return; }
  console.log(`# ${project.title}\n`);
  console.log("| Wave | Done/Total | Backlog | Ready | In Progress | Estimate (j) done/total | Progress |");
  console.log("|---|---|---|---|---|---|---|");
  for (const r of rows) {
    const pct = r.total ? Math.round((r.Done / r.total) * 100) : 0;
    console.log(`| ${r.wave} | ${r.Done}/${r.total} | ${r.Backlog} | ${r.Ready} | ${r["In Progress"]} | ${r.estDone}/${r.est} | ${pct}% |`);
  }
});
