# Commands — Master Data

5 command wrapper yang membungkus pipeline **DEFINE → BUILD → VERIFY →
REVIEW → SHIP** per Product Backlog (PB) item: `/grill` → `/dev` → `/qa`
→ `/gate` → `/promote`. Tiap command sengaja tipis — tidak ada logika baru,
cuma orkestrasi urutan + gate di atas skill yang sudah ada
(`brd-grill`/`prd-grill`, `exec-todo`, testing skills, `code-review-and-
quality`/`security-review`, `branching`/`deployment`).

Sama seperti `agents/`, command **tidak punya format lintas-platform
tunggal** — tiap platform yang mendukung command custom punya lokasi dan
dialek frontmatter sendiri. Jadi satu command di sini = satu folder
`commands/<nama>/` berisi satu file per platform yang benar-benar
mendukungnya, isi instruksi sama secara substansi, cuma format beda.

```
commands/
  <nama-command>/
    claude-code.md   # .claude/commands/<nama>.md
    opencode.md        # .opencode/commands/<nama>.md
    cursor.md             # .cursor/commands/<nama>.md
```

## Cara pakai

Salin file platform yang relevan ke lokasi yang platform itu baca:

| Platform | Lokasi project | Lokasi global |
|---|---|---|
| Claude Code | `.claude/commands/<nama>.md` | `~/.claude/commands/<nama>.md` |
| OpenCode | `.opencode/commands/<nama>.md` | `~/.config/opencode/commands/<nama>.md` |
| Cursor | `.cursor/commands/<nama>.md` | (ikuti config Cursor kamu) |

## Frontmatter per platform (ringkas)

| Platform | Field yang didukung | Placeholder argumen | Catatan |
|---|---|---|---|
| Claude Code | `description`, `argument-hint`, `allowed-tools` | `$ARGUMENTS` | body = prompt, memanggil skill lewat `Skill` tool |
| OpenCode | `description`, `agent`, `model` (opsional) | `$ARGUMENTS`, `$1`/`$2` | body = prompt, memanggil skill lewat `skill({ name: "..." })` |
| Cursor | **tidak ada frontmatter** — plain markdown | **tidak ada placeholder terdokumentasi** — command cuma insert prompt apa adanya | body mengarahkan agent menerapkan instruksi skill terkait dari `.cursor/skills/<nama>/SKILL.md` langsung (bukan tool call, karena Cursor baca SKILL.md native) |

## Platform yang sengaja tidak dibuatkan file command di sini

**Antigravity** — tidak ada mekanisme command custom yang terdokumentasi
resmi dan reliable. Yang ada cuma "legacy command TOML", yang menurut
catatan proyek serupa (addyosmani/agent-skills) **buggy/tidak ke-discover**
di sebagian rilis Antigravity — solusi mereka sendiri adalah "invoke skill
di bawahnya langsung", bukan lewat command wrapper. Path yang confirmed
jalan di Antigravity: skill di `.agents/skills/<nama>.md` **otomatis**
di-compile jadi slash command `/<nama>` — jadi kalau mau `/grill` dkk di
Antigravity, jalur yang benar adalah menjadikan skill itu sendiri
user-invocable (bukan menambah command wrapper terpisah), bukan sesuatu
yang bisa disediakan lewat folder `commands/` ini.

**Codex CLI** — mekanisme "custom prompts" (`~/.codex/prompts/<nama>.md`)
sudah **dinyatakan deprecated oleh OpenAI sendiri**, hanya bisa di lokasi
user-global (bukan per-project, jadi tidak bisa didistribusikan lewat
repo ini), dan dipanggil dengan nama berbeda (`/prompts:<nama>`, bukan
`/<nama>`). OpenAI mengarahkan pemakaian skill langsung
(`@nama-skill`) sebagai gantinya. Untuk Codex, jalankan tiap tahap
pipeline dengan memanggil skill-nya langsung: `@brd-grill`/`@prd-grill`
untuk `/grill`, `@exec-todo` untuk `/dev`, dst — bukan lewat command.

## Kenapa `/qa`/`/gate` command terpisah dari `/dev`

Lihat [`README.md` § Pipeline](../README.md#pipeline-define--ship) dan
[`guides/new-feature-flow.md`](../guides/new-feature-flow.md) di root repo
untuk penjelasan lengkap alurnya. Ringkasnya: `exec-todo` (`/dev`) cuma
menjalankan cheap check (unit test/type-check/build) per item lalu
berhenti — full E2E/manual verification dan review sengaja dipisah jadi
`/qa` dan `/gate` supaya biaya waktu/token untuk test/review penuh tidak
otomatis kepakai tiap kali satu item kecil selesai.
