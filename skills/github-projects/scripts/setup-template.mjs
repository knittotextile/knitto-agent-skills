#!/usr/bin/env node
// setup-template.mjs — turn a project into the org's board template:
// ensure the standard fields exist, add `Tracking` to Wave, drop the legacy
// Delivery Stage field, and mark the project as an org template.
//
// Views cannot be set through the API; configure them once in the web UI
// (references/views.md) — every board copied from the template inherits them.
//
// Usage:
//   # copy an existing board's structure (no items) into a new template project
//   node scripts/setup-template.mjs --create-from 15 --title "Knitto Wave Template" [--yes]
//   # or prepare an existing project
//   node scripts/setup-template.mjs --project 16 [--keep-delivery-stage] [--yes]

import { parseArgs, boardConfig, run, graphql, getProject, confirmOrExit, copyProject } from "./lib.mjs";

const REQUIRED = [
  { name: "Start Date", dataType: "DATE" },
  { name: "Target Date", dataType: "DATE" },
  { name: "Estimate (jam)", dataType: "NUMBER" },
];
const SELECTS = {
  Wave: ["Tracking", "W0", "W1", "W2", "W3", "W4", "W5"],
  Application: ["Studio", "Atlas", "Inspector", "Cross-system"],
};
// Distinct colors so each application reads at a glance on every view.
const COLORS = { Studio: "BLUE", Atlas: "GREEN", Inspector: "ORANGE", "Cross-system": "PURPLE", Tracking: "GRAY" };

function selectOptions(fieldId) {
  return graphql(
    `query($id:ID!){node(id:$id){... on ProjectV2SingleSelectField{options{id name color description}}}}`,
    { id: fieldId },
  ).node.options;
}

run(() => {
  const { flags } = parseArgs();
  const cfg = boardConfig(flags);

  if (flags["create-from"]) {
    if (typeof flags.title !== "string") throw new Error("--create-from needs --title");
    confirmOrExit(flags, [`copy ${cfg.org} project #${flags["create-from"]} (views, fields, workflows; no items) as "${flags.title}"`]);
    const p = copyProject(cfg.org, Number(flags["create-from"]), flags.title);
    console.log(`created: #${p.number} ${p.url}`);
    cfg.number = p.number;
  } else if (!flags.project) {
    throw new Error("pass --create-from <n> --title ... or --project <n>");
  }

  const project = getProject(cfg);
  const plan = [];
  const missing = REQUIRED.filter((f) => !project.fields[f.name.toLowerCase()] && !project.fields[f.name.replace(/\s*\(.*\)$/, "").toLowerCase()]);
  for (const f of missing) plan.push(`create field ${f.name} (${f.dataType})`);
  const selectFixes = [];
  for (const [name, wanted] of Object.entries(SELECTS)) {
    const f = project.fields[name.toLowerCase()];
    if (!f) { plan.push(`create field ${name} (${wanted.join(", ")})`); selectFixes.push({ name, wanted, field: null }); continue; }
    const have = f.options.map((o) => o.name);
    const add = wanted.filter((w) => !have.includes(w));
    const recolor = f.options.some((o) => COLORS[o.name] && o.color !== COLORS[o.name]);
    if (add.length || recolor) { plan.push(`${name}: ${add.length ? `add option(s) ${add.join(", ")}` : "set colors"}`); selectFixes.push({ name, wanted, field: f }); }
  }
  const legacy = project.fields["delivery stage"];
  if (legacy && !flags["keep-delivery-stage"]) plan.push("delete legacy field Delivery Stage");
  plan.push(`mark "${project.title}" as an org template`);
  if (!flags["create-from"]) confirmOrExit(flags, plan);
  else for (const l of plan) console.log(`  - ${l}`);

  for (const f of missing) {
    graphql(`mutation($p:ID!,$n:String!,$t:ProjectV2CustomFieldType!){createProjectV2Field(input:{projectId:$p,name:$n,dataType:$t}){clientMutationId}}`,
      { p: project.id, n: f.name, t: f.dataType });
  }
  for (const s of selectFixes) {
    const existing = s.field ? selectOptions(s.field.id) : [];
    const byName = new Map(existing.map((o) => [o.name, o]));
    const ordered = [...s.wanted, ...existing.map((o) => o.name).filter((n) => !s.wanted.includes(n))];
    // Passing the existing option id keeps every item's value intact.
    const options = ordered.map((n) => ({
      ...(byName.get(n)?.id ? { id: byName.get(n).id } : {}),
      name: n,
      color: COLORS[n] ?? byName.get(n)?.color ?? "BLUE",
      description: byName.get(n)?.description ?? "",
    }));
    if (s.field) {
      graphql(`mutation($f:ID!,$o:[ProjectV2SingleSelectFieldOptionInput!]){updateProjectV2Field(input:{fieldId:$f,singleSelectOptions:$o}){clientMutationId}}`,
        { f: s.field.id, o: options });
    } else {
      graphql(`mutation($p:ID!,$n:String!,$o:[ProjectV2SingleSelectFieldOptionInput!]){createProjectV2Field(input:{projectId:$p,name:$n,dataType:SINGLE_SELECT,singleSelectOptions:$o}){clientMutationId}}`,
        { p: project.id, n: s.name, o: options });
    }
  }
  if (legacy && !flags["keep-delivery-stage"]) {
    graphql(`mutation($f:ID!){deleteProjectV2Field(input:{fieldId:$f}){clientMutationId}}`, { f: legacy.id });
  }
  graphql(`mutation($p:ID!){markProjectV2AsTemplate(input:{projectId:$p}){projectV2{id}}}`, { p: project.id });
  console.log(`template ready: ${project.url}\nnext: configure the views once in the web UI (references/views.md)`);
});
