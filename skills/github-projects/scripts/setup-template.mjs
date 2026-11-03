#!/usr/bin/env node
// setup-template.mjs — turn a project into an org Wave template: ensure the
// convention fields (init-board), drop the legacy Delivery Stage / Owner
// fields, and mark it as an org template.
//
// Views cannot be set through the API; configure them once in the web UI
// (references/views.md) — every board copied from the template inherits them.
//
// Usage:
//   # copy an existing board's structure (no items) into a new template project
//   node scripts/setup-template.mjs --create-from <board URL> --title "<Org> Wave Template" [--yes]
//   # or prepare an existing project
//   node scripts/setup-template.mjs --project <URL> [--keep-legacy] [--yes]

import { parseArgs, boardConfig, run, graphql, getProject, confirmOrExit, copyProject, planConventionFields } from "./lib.mjs";

run(() => {
  const { flags } = parseArgs();
  let cfg;
  if (flags["create-from"]) {
    if (typeof flags.title !== "string") throw new Error("--create-from needs --title");
    const src = boardConfig({ ...flags, project: flags["create-from"] });
    confirmOrExit(flags, [`copy ${src.org} project #${src.number} (views, fields, workflows; no items) as "${flags.title}"`]);
    const p = copyProject(src.org, src.number, flags.title);
    console.log(`created: #${p.number} ${p.url}`);
    cfg = { org: src.org, number: p.number };
  } else {
    cfg = boardConfig(flags);
  }

  const project = getProject(cfg);
  const { plan, apply } = planConventionFields(project, { dropLegacy: !flags["keep-legacy"] });
  plan.push(`mark "${project.title}" as an org template`);
  if (!flags["create-from"]) confirmOrExit(flags, plan);
  else for (const l of plan) console.log(`  - ${l}`);

  apply();
  graphql(`mutation($p:ID!){markProjectV2AsTemplate(input:{projectId:$p}){projectV2{id}}}`, { p: project.id });
  console.log(`template ready: ${project.url}\nnext: configure the views once in the web UI (references/views.md)`);
});
