#!/usr/bin/env node
// set-status.mjs — change one issue's board Status.
//
// Usage:
//   node scripts/set-status.mjs <owner/repo#n> <Backlog|Ready|In Progress|Done> [--yes]

import { parseArgs, boardConfig, run, parseIssueRef, getProject, getIssue } from "./lib.mjs";
import { applyFields } from "./set-fields.mjs";

run(() => {
  const { flags, positional } = parseArgs();
  const [ref, ...statusParts] = positional;
  const status = statusParts.join(" ");
  if (!ref || !status) throw new Error('usage: set-status.mjs <owner/repo#n> "In Progress" [--yes]');
  const project = getProject(boardConfig(flags));
  applyFields(project, getIssue(parseIssueRef(ref)), { Status: status }, flags);
});
