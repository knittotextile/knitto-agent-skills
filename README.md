# Agent Skills — Master Data

> Cari skill yang tersedia? Lihat [`CATALOG.md`](CATALOG.md) duluan — daftar
> lengkap skill & agent beserta deskripsi singkatnya ada di sana.

Kumpulan **skill lintas-platform** untuk AI coding agent: Claude Code, OpenCode,
Antigravity (Google), Command Code, dan Cursor. Satu skill = satu folder =
satu file `SKILL.md` yang bisa langsung dipakai di semua platform tersebut
(kecuali Cursor, yang punya adapter terpisah — lihat bawah).

## Kenapa satu format bisa dipakai di banyak agent?

Semua platform ini membaca skill dari folder `SKILL.md` dengan frontmatter
YAML + body markdown, dan field yang tidak mereka kenali **diabaikan**, bukan
menyebabkan error. Jadi satu `SKILL.md` yang ditulis dengan superset field
(lihat `skills/_template/SKILL.md`) otomatis kompatibel di:

| Platform     | Lokasi yang dibaca (project-level)     | Lokasi global                     |
|--------------|-----------------------------------------|------------------------------------|
| Claude Code  | `.claude/skills/<name>/`               | `~/.claude/skills/<name>/`        |
| OpenCode     | `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` | `~/.config/opencode/skills/`, dst |
| Antigravity  | `.agents/skills/<name>/`               | `~/.gemini/config/skills/<name>/` |
| Command Code | `.commandcode/skills/<name>/`          | `~/.commandcode/skills/<name>/`   |
| Cursor (2.4+) | `.cursor/skills/<name>/`              | `~/.cursor/skills/<name>/`        |
| Codex CLI    | `.agents/skills/<name>/`               | `~/.agents/skills/<name>/`        |
| Cursor       | *(tidak baca SKILL.md — lihat adapter)* | —                                  |

**Cursor 2.4+** sudah baca `SKILL.md` native di `.cursor/skills/<name>/` —
struktur dan frontmatter-nya (name, description, opsional metadata/scripts/
references/assets) kompatibel langsung dengan format superset yang dipakai
repo ini, tidak perlu adapter apa pun. Skill di sini yang masih menyertakan
`cursor.mdc` (adopsi dari sebelum Cursor 2.4 support native skill) tetap
jalan sebagai fallback lewat model rules (`.cursor/rules/*.mdc`) untuk
instalasi Cursor lama, tapi bukan lagi cara utama.

**Codex CLI** juga baca `SKILL.md` native, di `.agents/skills/<name>/`
(sama seperti Antigravity/OpenCode) — format `SKILL.md` sudah jadi open
standard yang diadopsi lintas tool, jadi skill apa pun di sini otomatis
kompatibel Codex tanpa perubahan.

**Catatan OpenCode — skill ≠ slash command.** Berbeda dari Claude Code
(yang otomatis membuat `/nama-skill` untuk tiap skill), OpenCode hanya
membaca `SKILL.md` lewat tool `skill` yang dipanggil agent sendiri saat
relevan — **tidak ada** `/nama-skill` otomatis di OpenCode. Kalau user
OpenCode mau memanggil skill secara eksplisit lewat `/`, perlu file
command *terpisah* (lihat [docs commands OpenCode](https://opencode.ai/docs/commands/))
di `.opencode/commands/<nama-skill>.md` (project) atau
`~/.config/opencode/commands/<nama-skill>.md` (global), isinya minimal:

```markdown
---
description: <deskripsi singkat dari CATALOG.md>
---
Use the "<nama-skill>" skill (call skill({ name: "<nama-skill>" })) to handle this request: $ARGUMENTS
```

Ini bukan bagian dari `SKILL.md` itu sendiri — kalau user OpenCode mau
akses `/nama-skill`, buatkan file wrapper ini sebagai langkah tambahan
saat instalasi (lihat [`INSTALL.md`](INSTALL.md) Langkah 5).

## Struktur repo

```
skills/
  <nama-skill>/
    SKILL.md          # wajib — format superset, dipakai Claude Code/OpenCode/Antigravity/Command Code
    cursor.mdc         # opsional — adapter untuk Cursor
    scripts/            # opsional — kode executable yang dipanggil skill
    references/         # opsional — dokumentasi/detail yang di-load on-demand
    assets/              # opsional — template, contoh, file statis
skills/_template/       # salin folder ini untuk membuat skill baru

agents/
  <nama-agent>/
    claude-code.md     # subagent Claude Code
    opencode.md          # subagent OpenCode
    antigravity.md         # subagent Antigravity
    commandcode.md           # subagent Command Code
    cursor.md                  # subagent Cursor
  README.md               # konvensi lengkap tiap platform — lihat ini dulu

CATALOG.md               # index semua skill & agent: nama, deskripsi singkat, tag, kompatibilitas
CONTRIBUTING.md          # cara menambah/mengubah skill + aturan frontmatter
SOURCES.md                # atribusi skill yang diadopsi dari repo open-source (MIT), bukan tulisan asli repo ini
```

Agent (subagent) tidak punya format lintas-platform tunggal seperti skill —
tiap platform pakai dialek frontmatter sendiri, jadi satu folder agent di
sini berisi satu file per platform dengan body (system prompt) yang sama.
Agent di sini sengaja ditulis tipis dan **mendelegasikan metodologi ke
skill terkait** (mis. agent `reviewer` memanggil skill
`code-review-and-quality`), supaya metodologi tetap satu sumber kebenaran.
Detail lengkap ada di [`agents/README.md`](agents/README.md).

## Cara pakai (untuk konsumen skill)

1. Salin folder `skills/<nama-skill>/` ke lokasi skill platform kamu (lihat
   tabel di atas), **atau**
2. Symlink/clone repo ini lalu arahkan konfigurasi platform ke folder
   `skills/` di sini (mis. OpenCode & Antigravity keduanya mengenali
   `.agents/skills/`).

Cara tercepat: paste link repo ini ke AI agent kamu dan minta dipasangkan —
lihat [`INSTALL.md`](INSTALL.md), itu instruksi wajib yang dibaca agent
tersebut sebelum menyalin skill/agent apa pun.

## Cara menambah skill baru

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md).
