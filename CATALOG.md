# Katalog Skill

Index semua skill di repo ini. Update tabel ini setiap menambah/mengubah
skill (lihat [`CONTRIBUTING.md`](CONTRIBUTING.md)). Skill bertanda 🔷 di
kolom Tag diadopsi dari repo open-source MIT — lihat [`SOURCES.md`](SOURCES.md)
untuk atribusi lengkap, bukan tulisan asli repo ini.

### Alur perencanaan → eksekusi

`brd-grill` → `prd-grill` → `exec-todo` (masing-masing bisa dipakai berdiri
sendiri juga, tapi dirancang saling menyambung).

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`brd-grill`](skills/brd-grill/SKILL.md) | Ubah Product Backlog mentah jadi BRD (dampak proses/UI/kamus data) lewat tanya-jawab satu-pertanyaan-per-giliran, opsional tabel estimasi effort terkalibrasi, lalu hand-off ke `prd-grill` | planning, brd, requirements, estimation | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`prd-grill`](skills/prd-grill/SKILL.md) | Ubah ide mentah (atau BRD dari `brd-grill`) jadi PRD/rencana lewat tanya-jawab satu-pertanyaan-per-giliran, lalu tulis PRD+ISSUES (atau ikuti konvensi phase-plan repo yang sudah ada) | planning, prd, docs | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`exec-todo`](skills/exec-todo/SKILL.md) | Eksekusi checklist dari `prd-grill` sebagai task list ter-tracking, sinkron checkbox file ↔ session, jalankan closing gate (review/verifikasi) repo | planning, execution, workflow | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`incremental-implementation`](skills/incremental-implementation/SKILL.md) 🔷 | Disiplin memecah implementasi jadi langkah kecil yang bisa diverifikasi, bukan satu perubahan besar sekaligus | workflow, implementation | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`planning-and-task-breakdown`](skills/planning-and-task-breakdown/SKILL.md) 🔷 | Pecah spec/requirement jadi task terurut yang implementable, termasuk estimasi scope & identifikasi kerja paralel | planning, workflow | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`test-driven-development`](skills/test-driven-development/SKILL.md) 🔷 | Disiplin TDD — tulis test dulu sebelum implementasi/bugfix/perubahan behavior | testing, workflow | `claude-code`, `opencode`, `antigravity`, `commandcode` |

### Review & kualitas

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`code-review-and-quality`](skills/code-review-and-quality/SKILL.md) | Metodologi review lima-axis (correctness, readability, architecture, security, performance) dengan severity label dan quality gate | review, quality, security, performance | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`security-and-hardening`](skills/security-and-hardening/SKILL.md) 🔷 | Prinsip hardening saat menangani input user, auth, penyimpanan data, atau integrasi eksternal | security | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`security-review`](skills/security-review/SKILL.md) 🔷 | Checklist keamanan saat menambah auth, endpoint API, secret, atau fitur pembayaran/sensitif | security | `claude-code`, `opencode`, `antigravity`, `commandcode` |

### Git & deploy

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`branching`](skills/branching/SKILL.md) | Kelola branch di model paired-branch (`-main`/`-dev`) + cherry-pick ke `releases/sandbox` staging + promosi ke `releases/main` production — mencegah staging ketinggalan/duplikat fitur | git, branching, staging, deploy | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor` (via `cursor.mdc`) |
| [`docker-patterns`](skills/docker-patterns/SKILL.md) 🔷 | Pola Docker/Docker Compose: dev lokal, keamanan container, networking, volume, multi-service | devops, docker | `claude-code`, `opencode`, `antigravity`, `commandcode` |

### Backend & database

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`api-design`](skills/api-design/SKILL.md) 🔷 | Pola desain REST API: resource naming, status code, pagination, filtering, error response, versioning, rate limit | backend, api | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`backend-patterns`](skills/backend-patterns/SKILL.md) 🔷 | Pola arsitektur backend Node.js/Express/Next.js API routes, optimasi database | backend | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`database-migrations`](skills/database-migrations/SKILL.md) 🔷 | Praktik migrasi schema, migrasi data, rollback, zero-downtime deploy (Postgres/MySQL + ORM umum) | database | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`mysql-patterns`](skills/mysql-patterns/SKILL.md) 🔷 | Pola schema, query, indexing, transaction, replication, connection-pool MySQL/MariaDB | database, mysql | `claude-code`, `opencode`, `antigravity`, `commandcode` |

### Frontend & testing

| Skill | Deskripsi Singkat | Tag | Kompatibel Dengan |
|---|---|---|---|
| [`react-patterns`](skills/react-patterns/SKILL.md) 🔷 | Pola React 18/19: hooks, server/client boundary, Suspense, form actions, state management, aksesibilitas | frontend, react | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`react-testing`](skills/react-testing/SKILL.md) 🔷 | Testing komponen React (RTL, Vitest/Jest, MSW, axe) + batas component test vs E2E | testing, react | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`e2e-testing`](skills/e2e-testing/SKILL.md) 🔷 | Pola Playwright E2E: Page Object Model, config, integrasi CI/CD, artifact, strategi flaky test | testing, e2e | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`webapp-testing`](skills/webapp-testing/SKILL.md) | Workflow E2E+TDD siap-eksekusi: script Python (`run_e2e.py`) + config Playwright + CI yaml nyata, bukan cuma pola kode | testing, e2e, tdd, playwright | `claude-code`, `opencode`, `antigravity`, `commandcode` |
| [`test-case-matrix`](skills/test-case-matrix/SKILL.md) | Tulis matrix test case (functional/edge/error/state) dari PRD/issue jadi markdown checklist per-step + traceability matrix, sebelum test code ditulis | testing, qa, planning | `claude-code`, `opencode`, `antigravity`, `commandcode` |

## Legenda kompatibilitas

- `claude-code` — Claude Code (`.claude/skills/`)
- `opencode` — OpenCode (`.opencode/skills/`)
- `antigravity` — Google Antigravity (`.agents/skills/`)
- `commandcode` — Command Code (`.commandcode/skills/`)
- `cursor` — Cursor 2.4+ baca `SKILL.md` native (`.cursor/skills/<name>/`); untuk skill yang menyertakan `cursor.mdc`, itu fallback legacy Cursor pra-2.4, bukan jalur utama lagi
- `codex` — Codex CLI, baca `SKILL.md` native di `.agents/skills/<name>/` — kompatibel otomatis untuk semua skill di katalog ini, tidak perlu diverifikasi per-skill

## Agents

Agent (subagent) tidak punya format lintas-platform tunggal — satu file per
platform. Lihat [`agents/README.md`](agents/README.md) untuk konvensi
lengkap.

| Agent | Deskripsi Singkat | Delegasi ke skill | Platform tersedia |
|---|---|---|---|
| [`reviewer`](agents/reviewer/) | Reviewer independen, dipanggil proaktif saat sesi/fitur dinyatakan selesai atau saat diminta review diff | `code-review-and-quality` | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor`, `codex` |
| [`qa-engineer`](agents/qa-engineer/) | Rencanakan lalu bangun test coverage: selalu mulai dari `test-case-matrix`, baru implementasi via skill testing yang sesuai layer | `test-case-matrix`, `react-testing`, `e2e-testing`, `webapp-testing` | `claude-code`, `opencode`, `antigravity`, `commandcode`, `cursor`, `codex` |
