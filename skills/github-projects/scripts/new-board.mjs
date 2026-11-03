#!/usr/bin/env node
// new-board.mjs — create a new board by copying a Wave template project
// (views, fields, workflows, README; no items), so nothing is set up by hand.
//
// Usage:
//   node scripts/new-board.mjs --org <org> --title "<Nama board>"
//     [--template <URL atau nomor>] [--applications "Web,API"] [--yes]
//
// Without --template, the org's template projects are searched for one that
// has a Wave field (e.g. "Knitto Wave Template"); if there are several, pass
// --template. --applications sets the new board's own Application options
// (replacing the template's example options); without it they are kept.

import {
  parseArgs, boardConfig, run, graphql, confirmOrExit, copyProject, getProject, planConventionFields,
} from "./lib.mjs";

function findTemplate(org) {
  const d = graphql(
    `query($org:String!){organization(login:$org){projectsV2(first:100){nodes{number title template fields(first:50){nodes{... on ProjectV2FieldCommon{name}}}}}}}`,
    { org },
  );
  const found = d.organization.projectsV2.nodes.filter((p) => p.template && p.fields.nodes.some((f) => f?.name === "Wave"));
  if (found.length === 1) return found[0].number;
  if (!found.length) throw new Error(`org ${org} belum punya template board ber-Wave; buat dengan setup-template.mjs atau pass --template`);
  throw new Error(`lebih dari satu template ber-Wave: ${found.map((p) => `#${p.number} ${p.title}`).join(", ")} — pilih dengan --template`);
}

run(() => {
  const { flags } = parseArgs();
  if (typeof flags.title !== "string") throw new Error('usage: new-board.mjs --org <org> --title "..." [--template n] [--yes]');
  const org = flags.template ? boardConfig({ ...flags, project: flags.template }).org : flags.org || process.env.GH_PROJECT_ORG;
  if (!org) throw new Error("berikan --org <org> (atau --template <URL template>)");
  const template = flags.template ? boardConfig({ ...flags, project: flags.template }).number : findTemplate(org);
  const applications = String(flags.applications || "").split(",").map((s) => s.trim()).filter(Boolean);
  confirmOrExit(flags, [
    `copy ${org} template #${template} as new board "${flags.title}" (views, fields, workflows; no items)`,
    ...(applications.length ? [`Application options: ${applications.join(", ")} (replacing the template's)`] : []),
  ]);
  const p = copyProject(org, template, flags.title);
  if (applications.length) planConventionFields(getProject({ org, number: p.number }), { applications, replaceApplications: true }).apply();
  console.log(`created: #${p.number} ${p.url}`);
});
