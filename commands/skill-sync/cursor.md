Sync installed skills/agents/commands in this project against the catalog
they came from, applying the `skill-sync` skill's instructions
(`.cursor/skills/skill-sync/SKILL.md`).

1. Apply the skill's steps in order: locate the lockfile(s) and confirm
   scope (project/global/both — ask if both exist), ask which tracked
   skills/agents to sync via a checklist (or just the name given after
   this command if a specific skill/agent was named), resolve and pull
   the source, then classify and sync the selected files.
2. `--rebuild-lock` forces the "no lockfile found" path even if one
   exists, in case it's known to be stale — confirm with the user before
   discarding an existing lockfile.
3. Never overwrite a file classified as a project-scoped override without
   explicit confirmation.
4. Report one summary at the end: which scope(s) synced, up to date /
   auto-updated / kept as override / unresolved conflicts.

Not the initial install — that's INSTALL.md. Not a way to force-overwrite
customizations without asking.
