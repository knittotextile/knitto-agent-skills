#!/usr/bin/env node
// lint-board.mjs — report board items that break the Wave convention.
// Read-only; exits 1 when any problem is found.
//
// Checks per issue (Tracking items are only checked for a Wave value):
//   - Wave or Application empty, or no Assignees
//   - title lacks a `[Wn]` / `[Wn-lanjutan]` prefix, or its Wn differs from the Wave field
//   - `[Wn-lanjutan]` that is not a sub-issue of anything
//   - body header `Wave:` differs from the Wave field
//   - Delivery Stage still filled while Wave is empty (legacy item)
//
// Usage:
//   node scripts/lint-board.mjs [--application Studio] [--open-only] [--json]

import { parseArgs, boardConfig, run, getProject, getItems, parseHeader, TITLE_RE } from "./lib.mjs";

run(() => {
  const { flags } = parseArgs();
  const project = getProject(boardConfig(flags));
  const items = getItems(project)
    .filter((i) => !flags["open-only"] || i.state === "OPEN")
    .filter((i) => !flags.application || String(i.values.Application ?? "").toLowerCase() === String(flags.application).toLowerCase());

  const findings = [];
  for (const i of items) {
    const v = i.values;
    const problems = [];
    const tracking = String(v.Wave ?? "").toLowerCase() === "tracking";
    if (!v.Wave) problems.push(v["Delivery Stage"] ? `Wave kosong (Delivery Stage lama: ${v["Delivery Stage"]})` : "Wave kosong");
    if (!tracking) {
      if (!v.Application) problems.push("Application kosong");
      if (!i.draft && !i.assignees.length) problems.push("Assignees kosong");
      const m = i.title.match(TITLE_RE);
      if (!m) problems.push("judul tanpa prefix [Wn] / [Wn-lanjutan]");
      else {
        if (v.Wave && m[1].toUpperCase() !== String(v.Wave).toUpperCase()) problems.push(`prefix judul ${m[1]} ≠ field Wave ${v.Wave}`);
        if (m[2] && !i.parent) problems.push("[Wn-lanjutan] belum jadi sub-issue dari induk");
      }
      const hw = parseHeader(i.body).wave;
      if (!i.draft && hw && v.Wave && hw.toUpperCase() !== String(v.Wave).toUpperCase()) problems.push(`header body Wave: ${hw} ≠ field Wave ${v.Wave}`);
    }
    if (problems.length) findings.push({ key: i.key ?? `(draft) ${i.title}`, title: i.title, url: i.url, problems });
  }

  if (flags.json) console.log(JSON.stringify(findings, null, 2));
  else if (!findings.length) console.log(`OK: ${items.length} item di "${project.title}" sesuai konvensi.`);
  else {
    for (const f of findings) console.log(`${f.key}  ${f.title}\n    - ${f.problems.join("\n    - ")}`);
    console.log(`\n${findings.length} dari ${items.length} item perlu dirapikan.`);
  }
  if (findings.length) process.exitCode = 1;
});
