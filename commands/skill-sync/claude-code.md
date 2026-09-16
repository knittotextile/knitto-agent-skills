---
description: "Check installed skills/agents/commands against their source and update the ones that changed upstream"
argument-hint: "[skill-or-agent-name] [--rebuild-lock]"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, Skill, AskUserQuestion]
---

# /skill-sync

Sync installed skills/agents/commands in this project against the
catalog they came from, using [`skill-sync`](../../skills/skill-sync/SKILL.md).

## Steps

1. Apply the `skill-sync` skill's steps in order: locate the lockfile(s)
   and confirm scope (project/global/both — ask if both exist), ask which
   tracked skills/agents to sync via an interactive checklist (or just
   `$ARGUMENTS` if a specific skill/agent name was given), resolve and pull
   the source, then classify and sync the selected files.
2. `--rebuild-lock` forces Step 0's "no lockfile found" path even if one
   exists, in case it's known to be stale or corrupted — confirm with the
   user before discarding an existing lockfile.
3. Never overwrite a file classified as a project-scoped override without
   explicit confirmation — see the skill's Step 3 classification table.
4. Report one summary at the end: which scope(s) synced, up to date /
   auto-updated / kept as override / unresolved conflicts.

## What this is not

- Not the initial install — that's `INSTALL.md`.
- Not a way to force-overwrite customizations without asking.
