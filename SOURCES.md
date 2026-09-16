# Sources / Attribution

Skill di bawah ini **bukan tulisan asli repo ini** — diadopsi dari repo
open-source berlisensi MIT. Konten body tidak diubah dari sumber aslinya;
yang ditambahkan hanya field frontmatter untuk kompatibilitas lintas-platform
(`license`, `compatible_with`, `metadata.source`) mengikuti format
[`CONTRIBUTING.md`](CONTRIBUTING.md) repo ini.

## [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT)

Skill workflow generik, tidak spesifik ke stack tertentu:

- `code-review-and-quality`
- `incremental-implementation`
- `security-and-hardening`
- `test-driven-development`

`planning-and-task-breakdown` (formerly adopted from this source as a
standalone skill) was folded into
[`skills/prd-grill/references/task-breakdown-technique.md`](skills/prd-grill/references/task-breakdown-technique.md)
— its output convention (`tasks/plan.md`/`tasks/todo.md`) conflicted with
this repo's `docs/prd/todo/<slug>/ISSUES.md` convention, so the technique
(dependency graph, vertical slicing, sizing) was kept and rewritten to
target `ISSUES.md` directly instead of standing alone.

## [affaan-m/ecc](https://github.com/affaan-m/ecc) (MIT)

Skill stack-spesifik (Express + MySQL + React/Vite + Docker), dipilih
manual dari ~350 skill di repo tersebut — bukan clone penuh, karena
sebagian besar isinya di luar cakupan (healthcare, blockchain, homelab,
dll):

- `api-design`
- `backend-patterns`
- `database-migrations`
- `docker-patterns`
- `e2e-testing`
- `mysql-patterns`
- `react-patterns`
- `react-testing`
- `security-review`

## [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance) (Apache-2.0)

Beda dengan skill MIT di atas, ini **bukan konten statis** — `SKILL.md`
di sumbernya membungkus tool `npx modern-web-guidance` yang query ke
database panduan semantik (performa, aksesibilitas, keamanan, forms,
built-in AI, WebMCP) yang di-maintain tim Chrome Google. Instruksi inti
(langkah search/retrieve, catatan npx/Windows, kebijakan browser support)
tidak diubah dari sumber aslinya; yang ditambahkan cuma frontmatter
lintas-platform dan satu catatan scope khusus katalog ini (skip kategori
guide `ui-atoms`/`ui-behaviors`/`ui-components`/`visual-design` karena
project ini sudah punya tim UI/UX + template React sendiri):

- `modern-web-guidance`

Lisensinya **Apache-2.0**, bukan MIT — beda dari skill lain di daftar ini,
jadi jangan disamakan tag/lisensinya di `CATALOG.md`.

## Diinspirasi (bukan disalin) dari repo project privat

- `exec-todo` — digeneralisasi dari versi project-scoped di repo
  `knitto-multichannel-chat` (private), yang aslinya ditulis khusus untuk
  konvensi `doc/phases/todo/*.md` repo tersebut. Versi di sini adalah
  tulisan ulang generik, bukan salinan — lihat
  `skills/exec-todo/references/project-example.md` untuk pola aslinya.
