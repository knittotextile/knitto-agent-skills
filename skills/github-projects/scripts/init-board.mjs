#!/usr/bin/env node
// init-board.mjs — put an EXISTING board on the Wave convention: add the
// Wave field (Tracking, W0..W5), Application options with distinct colors,
// Start Date, Target Date, Estimate (jam). Existing fields, options and item
// values are kept. For a NEW board use new-board.mjs instead: copying the
// template also brings the views, which the API cannot create.
//
// Usage:
//   node scripts/init-board.mjs --project <board URL> [--applications "Web,API,Mobile"]
//     [--drop-legacy] [--yes]
//
// --drop-legacy deletes the old Delivery Stage / Owner text fields (data in
// them is lost); without it they are left alone.

import { parseArgs, boardConfig, run, getProject, planConventionFields, confirmOrExit } from "./lib.mjs";

run(() => {
  const { flags } = parseArgs();
  const project = getProject(boardConfig(flags));
  const applications = String(flags.applications || "").split(",").map((s) => s.trim()).filter(Boolean);
  const { plan, apply } = planConventionFields(project, { applications, dropLegacy: Boolean(flags["drop-legacy"]) });
  if (!plan.length) { console.log(`OK: "${project.title}" sudah memakai konvensi Wave.`); return; }
  confirmOrExit(flags, plan);
  apply();
  console.log(`done: ${project.url}\nnext: atur view sekali di web sesuai references/views.md (group by Wave, filter -wave:Tracking)`);
});
