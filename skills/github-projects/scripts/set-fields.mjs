#!/usr/bin/env node
// set-fields.mjs — set board fields on one issue in a single call; adds the
// issue to the board first if it isn't there yet.
//
// Usage:
//   node scripts/set-fields.mjs <owner/repo#n> [--status Ready] [--wave W1]
//     [--application Studio] [--assignee login1,login2] [--estimate 4]
//     [--target-date 2026-11-30] [--org knittotextile] [--project 15] [--yes]

import {
  parseArgs, boardConfig, run, parseIssueRef, getProject, getIssue, itemIdFor,
  addToProject, fieldValue, setField, confirmOrExit, addAssignees, splitLogins, parseIssueRef as _p,
} from "./lib.mjs";
import { pathToFileURL } from "node:url";

export const FIELD_FLAGS = {
  status: "Status",
  wave: "Wave",
  application: "Application",
  estimate: "Estimate",
  "target-date": "Target Date",
};

export function applyFields(project, issue, values, flags, assignees = []) {
  const fvs = Object.entries(values).map(([name, raw]) => fieldValue(project, name, raw));
  let itemId = itemIdFor(issue, project);
  const plan = [];
  if (!itemId) plan.push(`add ${issue.url} to board "${project.title}"`);
  for (const fv of fvs) plan.push(`${fv.field.name} = ${fv.label}`);
  if (assignees.length) plan.push(`Assignees += ${assignees.join(", ")}`);
  confirmOrExit(flags, plan);
  if (!itemId) itemId = addToProject(project, issue.id);
  for (const fv of fvs) setField(project, itemId, fv);
  addAssignees(_p(issue.url), assignees);
  console.log(`done: ${issue.url}`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) run(() => {
  const { flags, positional } = parseArgs();
  if (!positional[0]) throw new Error("usage: set-fields.mjs <owner/repo#n> --wave W1 ... [--yes]");
  const values = {};
  for (const [flag, name] of Object.entries(FIELD_FLAGS)) if (typeof flags[flag] === "string") values[name] = flags[flag];
  const assignees = splitLogins(flags.assignee);
  if (!Object.keys(values).length && !assignees.length) throw new Error("no field flags given");
  const project = getProject(boardConfig(flags));
  applyFields(project, getIssue(parseIssueRef(positional[0])), values, flags, assignees);
});
