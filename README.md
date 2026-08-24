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
| Cursor       | *(tidak baca SKILL.md — lihat adapter)* | —                                  |

**Cursor** memakai model rules (`.cursor/rules/*.mdc`), bukan skill-folder.
Untuk itu tiap skill di sini boleh menyertakan `cursor.mdc` sebagai adapter
turunan dari `SKILL.md` (isi sama, dibungkus frontmatter MDC).

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
