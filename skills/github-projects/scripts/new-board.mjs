#!/usr/bin/env node
// new-board.mjs — create a new org board by copying the template project
// (views, fields, workflows, README; no items), so nothing is set up by hand.
//
// Usage:
//   node scripts/new-board.mjs --title "Knitto <Nama>" [--template <n>] [--yes]
//
// --template defaults to GH_PROJECT_TEMPLATE, else the org template titled
// "Knitto SDLC Template".

import { parseArgs, boardConfig, run, graphql, confirmOrExit, copyProject } from "./lib.mjs";

function findTemplate(org) {
  const d = graphql(
    `query($org:String!){organization(login:$org){projectsV2(first:100){nodes{number title template}}}}`,
    { org },
  );
  const t = d.organization.projectsV2.nodes.find((p) => p.template && p.title === "Knitto SDLC Template");
  if (!t) throw new Error('no org template "Knitto SDLC Template" found; pass --template <n>');
  return t.number;
}

run(() => {
  const { flags } = parseArgs();
  if (typeof flags.title !== "string") throw new Error('usage: new-board.mjs --title "..." [--template n] [--yes]');
  const { org } = boardConfig(flags);
  const template = Number(flags.template || process.env.GH_PROJECT_TEMPLATE || findTemplate(org));
  confirmOrExit(flags, [`copy ${org} template #${template} as new board "${flags.title}"`]);
  const p = copyProject(org, template, flags.title);
  console.log(`created: #${p.number} ${p.url}`);
});
