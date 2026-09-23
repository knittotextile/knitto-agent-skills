# Commands — Master Data

5 command wrapper yang membungkus pipeline **DEFINE → BUILD → VERIFY →
REVIEW → SHIP** per Product Backlog (PB) item: `/grill` → `/dev` → `/qa`
→ `/gate` → `/promote`. Tiap command sengaja tipis — tidak ada logika baru,
cuma orkestrasi urutan + gate di atas skill yang sudah ada
(`brd-reader`/`prd-grill`, `exec-todo`, testing skills, `code-review-and-
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
    antigravity.md       # .agents/skills/<nama>/SKILL.md (installed adapter)
```

## Cara pakai

Salin file platform yang relevan ke lokasi yang platform itu baca:

| Platform | Lokasi project | Lokasi global |
|---|---|---|
| Claude Code | `.claude/commands/<nama>.md` | `~/.claude/commands/<nama>.md` |
| OpenCode | `.opencode/commands/<nama>.md` | `~/.config/opencode/commands/<nama>.md` |
| Cursor | `.cursor/commands/<nama>.md` | (ikuti config Cursor kamu) |
| Antigravity 2.0 | `.agents/skills/<nama>/SKILL.md` | `~/.gemini/config/skills/<nama>/SKILL.md` |

## Frontmatter per platform (ringkas)

| Platform | Field yang didukung | Placeholder argumen | Catatan |
|---|---|---|---|
| Claude Code | `description`, `argument-hint`, `allowed-tools` | `$ARGUMENTS` | body = prompt, memanggil skill lewat `Skill` tool |
| OpenCode V2 | `description`, `agent`, `model` (opsional) | `$ARGUMENTS`, `$1`/`$2` | body = prompt, memanggil skill lewat `skill({ id: "..." })` |
| Cursor | **tidak ada frontmatter** — plain markdown | **tidak ada placeholder terdokumentasi** — command cuma insert prompt apa adanya | body mengarahkan agent menerapkan instruksi skill terkait dari `.cursor/skills/<nama>/SKILL.md` langsung (bukan tool call, karena Cursor baca SKILL.md native) |

## Catatan dukungan platform

**Antigravity 2.0** — command pipeline kustom bukan builtin platform command.
Dokumentasi Antigravity mendukung skill sebagai slash command `/<skill-name>`.
Karena itu `antigravity.md` di tiap folder command adalah adapter skill:
pasang sebagai `.agents/skills/<nama>/SKILL.md` (workspace) atau
`~/.gemini/config/skills/<nama>/SKILL.md` (global). Dengan adapter ini,
pipeline tersedia sebagai `/grill`, `/dev`, `/qa`, `/gate`, dan `/promote`.
Skill umum seperti `prd-grill` tetap tersedia dengan ID masing-masing.

Jangan memasang adapter di `.agents/skills/<nama>.md`: Antigravity
mengharapkan sebuah direktori skill dengan file `SKILL.md` di dalamnya.
Workflows lama memang mendukung slash command, tetapi sedang didepresiasi
dan bukan format yang dipakai adapter ini.

**Codex CLI** — mekanisme "custom prompts" (`~/.codex/prompts/<nama>.md`)
sudah **dinyatakan deprecated oleh OpenAI sendiri**, hanya bisa di lokasi
user-global (bukan per-project, jadi tidak bisa didistribusikan lewat
repo ini), dan dipanggil dengan nama berbeda (`/prompts:<nama>`, bukan
`/<nama>`). OpenAI mengarahkan pemakaian skill langsung
(`@nama-skill`) sebagai gantinya. Untuk Codex, jalankan tiap tahap
pipeline dengan memanggil skill-nya langsung: `@brd-reader`/`@prd-grill`
untuk `/grill`, `@exec-todo` untuk `/dev`, dst — bukan lewat command.

## Kenapa `/qa`/`/gate` command terpisah dari `/dev`

Lihat [`README.md` § Pipeline](../README.md#pipeline-define--ship) dan
[`guides/new-feature-flow.md`](../guides/new-feature-flow.md) di root repo
untuk penjelasan lengkap alurnya. Ringkasnya: `exec-todo` (`/dev`) cuma
menjalankan cheap check (unit test/type-check/build) per item lalu
berhenti — full E2E/manual verification dan review sengaja dipisah jadi
`/qa` dan `/gate` supaya biaya waktu/token untuk test/review penuh tidak
otomatis kepakai tiap kali satu item kecil selesai.
