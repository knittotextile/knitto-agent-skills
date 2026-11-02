# Template Issue

Title: `[Wn] Judul` or `[Wn-lanjutan] Judul` (see `model.md`).

```md
Wave: W1 | Parent: knittotextile/repo#12 | Repo: knittotextile/repo | Branch: feature/<slug> (from releases/staging) | Depends: knittotextile/repo#10

## 1. Definition

What feature or problem is this. Context and background.
Out-of-scope: what this issue explicitly does NOT cover.

## 2. Changes

- Repo and branch where the change happens.
- Files, endpoints, or UI components to change.
- Concrete steps in order.

## 3. Success Criteria

- [ ] Functional: observable behavior after the change.
- [ ] Test: command to run plus expected evidence.
  Example: `npm test`, curl request, manual steps, screenshot or log.
  An issue without this checkbox is NOT Ready.
- [ ] Regression: what must NOT break.

## 4. Keputusan terbuka

Optional. Open questions with who decides, or remove this section.
```

Header rules:

- `Parent:` — mandatory for `[Wn-lanjutan]`; `-` for a top-level `[Wn]` issue.
- `Depends:` — comma-separated `owner/repo#n` (or `#n` in the same repo), `-` for none.
  `next-task.mjs` reads this line to decide what is blocked.
- `Branch:` — `feature/<slug>`, cut from `releases/staging`.
