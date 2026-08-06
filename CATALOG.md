# Katalog Skill

Index semua skill di repo ini. Update tabel ini setiap menambah/mengubah
skill (lihat [`CONTRIBUTING.md`](CONTRIBUTING.md)).

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`brd-grill`](skills/brd-grill/SKILL.md) | Ubah Product Backlog mentah jadi BRD (dampak proses/UI/kamus data) lewat tanya-jawab satu-pertanyaan-per-giliran, opsional tabel estimasi effort terkalibrasi, lalu hand-off ke `prd-grill` | planning, brd, requirements, estimation | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`prd-grill`](skills/prd-grill/SKILL.md) | Ubah ide mentah (atau BRD dari `brd-grill`) jadi PRD/rencana lewat tanya-jawab satu-pertanyaan-per-giliran, lalu tulis PRD+ISSUES (atau ikuti konvensi phase-plan repo yang sudah ada) | planning, prd, docs | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`code-review-and-quality`](skills/code-review-and-quality/SKILL.md) | Metodologi review lima-axis (correctness, readability, architecture, security, performance) dengan severity label dan quality gate | review, quality, security, performance | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`branching`](skills/branching/SKILL.md) | Kelola branch di model paired-branch (`-main`/`-dev`) + cherry-pick ke `releases/sandbox` staging + promosi ke `releases/main` production — mencegah staging ketinggalan/duplikat fitur | git, branching, staging, deploy | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |

## Legenda kompatibilitas

- `claude-code` — Claude Code (`.claude/skills/`)
- `opencode` — OpenCode (`.opencode/skills/`)
- `antigravity` — Google Antigravity (`.agents/skills/`)
- `commandcode` — Command Code (`.commandcode/skills/`)
- `cursor` — Cursor, via adapter `cursor.mdc`

## Agents

Agent (subagent) tidak punya format lintas-platform tunggal — satu file per
platform. Lihat [`agents/README.md`](agents/README.md) untuk konvensi
lengkap.

| Agent | Deskripsi Singkat | Delegasi ke skill | Platform tersedia |
|---|---|---|---|
| [`reviewer`](agents/reviewer/) | Reviewer independen, dipanggil proaktif saat sesi/fitur dinyatakan selesai atau saat diminta review diff | `code-review-and-quality` | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` |
