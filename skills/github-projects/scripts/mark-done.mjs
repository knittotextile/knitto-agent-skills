#!/usr/bin/env node
// mark-done.mjs — finish an issue: tick every checkbox under
// `## 3. Success Criteria`, set board Status = Done, and close the issue.
//
// Usage:
//   node scripts/mark-done.mjs <owner/repo#n> [--no-close] [--no-check] [--yes]

import {
  parseArgs, boardConfig, run, parseIssueRef, getProject, getIssue, itemIdFor,
  addToProject, fieldValue, setField, confirmOrExit, gh, refKey,
} from "./lib.mjs";

export function tickSuccessCriteria(body) {
  let inSection = false;
  let ticked = 0;
  const lines = body.split(/\r?\n/).map((l) => {
    if (/^##\s/.test(l)) inSection = /^##\s*(3\.?\s*)?Success Criteria/i.test(l);
    if (inSection && /^\s*[-*]\s\[ \]/.test(l)) { ticked++; return l.replace("[ ]", "[x]"); }
    return l;
  });
  return { body: lines.join("\n"), ticked };
}

run(() => {
  const { flags, positional } = parseArgs();
  if (!positional[0]) throw new Error("usage: mark-done.mjs <owner/repo#n> [--no-close] [--no-check] [--yes]");
  const ref = parseIssueRef(positional[0]);
  const project = getProject(boardConfig(flags));
  const issue = getIssue(ref);
  const done = fieldValue(project, "Status", "Done");
  const { body, ticked } = flags["no-check"] ? { body: issue.body, ticked: 0 } : tickSuccessCriteria(issue.body);
  let itemId = itemIdFor(issue, project);

  const plan = [];
  if (ticked) plan.push(`tick ${ticked} Success Criteria checkbox(es)`);
  if (!itemId) plan.push(`add to board "${project.title}"`);
  plan.push("Status = Done");
  if (!flags["no-close"] && issue.state === "OPEN") plan.push("close issue (completed)");
  confirmOrExit(flags, plan);

  const target = refKey(ref);
  if (ticked) gh(["issue", "edit", String(ref.number), "--repo", `${ref.owner}/${ref.repo}`, "--body-file", "-"], body);
  if (!itemId) itemId = addToProject(project, issue.id);
  setField(project, itemId, done);
  if (!flags["no-close"] && issue.state === "OPEN") {
    gh(["issue", "close", String(ref.number), "--repo", `${ref.owner}/${ref.repo}`, "--reason", "completed"]);
  }
  console.log(`done: ${target}`);
});
