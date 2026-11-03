#!/usr/bin/env node
// add-subtask.mjs — create a `[Wn-follow-up]` issue as a sub-issue of an
// existing `[Wn]` parent, put it on the board, and fill Wave/Application/
// Status, and Assignees. The parent's own Status is never touched (a Done parent
// stays Done).
//
// Usage:
//   node scripts/add-subtask.mjs --parent <owner/repo#n> --title "Judul tanpa prefix"
//     [--repo owner/repo] [--branch feature/x] [--depends "o/r#1, o/r#2"]
//     [--body-file path.md] [--wave W2] [--application Studio] [--assignee login1,login2]
//     [--estimate 4] [--target-date 2026-11-30] [--status Backlog] [--yes]
//
// --wave defaults to the parent's `[Wn]` title prefix (or its Wave field).
// --application defaults to the parent's board value and --assignee to the
// parent's assignees; the run fails if neither supplies them.
// --body-file holds sections 1-4; the header line is generated. Without it,
// an empty 3-scope skeleton is used.

import { readFileSync } from "node:fs";
import {
  parseArgs, boardConfig, run, parseIssueRef, getProject, getIssue, itemIdFor,
  addToProject, fieldValue, setField, addSubIssue, confirmOrExit, gh, graphql, refKey, addAssignees, splitLogins, requireWave } from "./lib.mjs";

const SKELETON = `## 1. Definition

Out-of-scope:

## 2. Changes

## 3. Success Criteria

- [ ] Functional:
- [ ] Test:
- [ ] Regression:
`;

function parentBoardValues(project, parentIssue) {
  const itemId = itemIdFor(parentIssue, project);
  if (!itemId) return {};
  const d = graphql(
    `query($id:ID!){node(id:$id){... on ProjectV2Item{fieldValues(first:30){nodes{
      ... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2FieldCommon{name}}}
      ... on ProjectV2ItemFieldTextValue{text field{... on ProjectV2FieldCommon{name}}}
    }}}}}`,
    { id: itemId },
  );
  const out = {};
  for (const v of d.node.fieldValues.nodes) if (v?.field?.name) out[v.field.name] = v.name ?? v.text;
  return out;
}

run(() => {
  const { flags } = parseArgs();
  if (typeof flags.parent !== "string" || typeof flags.title !== "string") {
    throw new Error('usage: add-subtask.mjs --parent owner/repo#n --title "..." [--yes]');
  }
  const parentRef = parseIssueRef(flags.parent);
  const project = getProject(boardConfig(flags));
  requireWave(project);
  const parent = getIssue(parentRef);
  if (/^\[W\d+-(follow-up|lanjutan)\]/i.test(parent.title)) {
    throw new Error(`parent "${parent.title}" is itself a subtask; use its [Wn] parent (${parent.parent ? `${parent.parent.repository.nameWithOwner}#${parent.parent.number}` : "unknown"})`);
  }
  const inherited = parentBoardValues(project, parent);

  const wave = flags.wave || parent.title.match(/^\[(W\d+)/i)?.[1]?.toUpperCase() || inherited.Wave;
  if (!wave || !/^W\d+$/i.test(wave)) throw new Error(`cannot derive Wave from parent "${parent.title}"; pass --wave Wn`);
  const application = flags.application || inherited.Application;
  const assignees = flags.assignee ? splitLogins(flags.assignee) : parent.assignees.nodes.map((a) => a.login);
  if (!application) throw new Error("Application is mandatory: pass --application (parent has none)");
  if (!assignees.length) throw new Error("Assignees are mandatory: pass --assignee (parent has none)");

  const repo = flags.repo || `${parentRef.owner}/${parentRef.repo}`;
  const cleanTitle = flags.title.replace(/^\[W\d+(-follow-up|-lanjutan)?\]\s*/i, "");
  const title = `[${wave.toUpperCase()}-follow-up] ${cleanTitle}`;
  const header = [
    `Wave: ${wave.toUpperCase()}`,
    `Parent: ${parentRef.owner}/${parentRef.repo}#${parentRef.number}`,
    `Repo: ${repo}`,
    `Branch: ${flags.branch || "feature/<slug>"} (from releases/staging)`,
    `Depends: ${flags.depends || "-"}`,
  ].join(" | ");
  const sections = typeof flags["body-file"] === "string" ? readFileSync(flags["body-file"], "utf8") : SKELETON;
  const body = `${header}\n\n${sections.trim()}\n`;

  const values = { Wave: wave.toUpperCase(), Application: application, Status: flags.status || "Backlog" };
  if (flags.estimate) values.Estimate = flags.estimate;
  if (flags["target-date"]) values["Target Date"] = flags["target-date"];
  const fvs = Object.entries(values).map(([n, v]) => fieldValue(project, n, v));

  confirmOrExit(flags, [
    `create issue in ${repo}: "${title}"`,
    `header: ${header}`,
    `assign ${assignees.join(", ")}`,
    `link as sub-issue of ${refKey(parentRef)} (parent status unchanged)`,
    `add to board "${project.title}" with ${fvs.map((f) => `${f.field.name}=${f.label}`).join(", ")}`,
  ]);

  const url = gh(["issue", "create", "--repo", repo, "--title", title, "--body-file", "-"], body).trim().split(/\s+/).pop();
  const child = getIssue(parseIssueRef(url));
  addSubIssue(parent.id, child.id);
  addAssignees(parseIssueRef(url), assignees);
  const itemId = itemIdFor(child, project) || addToProject(project, child.id);
  for (const fv of fvs) setField(project, itemId, fv);
  console.log(`created: ${url}`);
});
