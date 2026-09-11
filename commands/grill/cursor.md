Pipeline stage: DEFINE. Next stage is /dev.

Turn the Product Backlog item the user just named (read it from whatever
text follows this command, or ask if none was given — don't guess) into a
written, confirmed plan before any code gets touched.

1. Decide whether this PB already has a BRD (from a business/system
   analyst — pasted text or a file) that needs reading first, or can go
   straight to implementation planning:
   - Has a BRD: apply the `brd-reader` skill's instructions
     (`.cursor/skills/brd-reader/SKILL.md`). It hands off to `prd-grill`
     itself once the BRD is confirmed understood — let that handoff happen,
     don't apply `prd-grill` again separately. It never authors a new BRD.
   - No BRD exists: apply the `prd-grill` skill's instructions
     (`.cursor/skills/prd-grill/SKILL.md`) directly.
   - If unclear which applies, ask the user rather than assuming.
2. If the user's input looks like a "refine <slug>" request, pass that
   through as-is to whichever skill owns the existing doc.
3. When done, report the exact file path(s) written (BRD.md and/or PRD.md
   + ISSUES.md) and tell the user to run /dev next.

Not the place to write code — both skills only write planning documents.
Not for a PB that already has a confirmed, still-open PRD+ISSUES pair —
that goes straight to /dev.
