# Agent Skills — Master Data

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
lihat section di bawah, itu instruksi yang dibaca agent tersebut.

## Cara menambah skill baru

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 🤖 Untuk AI agent yang membaca repo ini

Kamu (AI agent) sedang diarahkan ke repo ini — lewat link GitHub yang
di-paste user, atau lewat clone lokal. Jangan langsung menyalin semua skill
dan agent secara diam-diam. **Ikuti alur tanya-jawab di bawah ini** sebelum
melakukan instalasi apa pun.

### Langkah 1 — Baca katalog

Baca [`CATALOG.md`](CATALOG.md) untuk daftar skill dan agent yang tersedia
saat ini beserta deskripsi singkatnya. Jangan andalkan daftar hardcoded di
README ini — `CATALOG.md` adalah sumber kebenaran yang paling update.

### Langkah 2 — Tanyakan platform user

Tanyakan platform AI coding agent mana yang dipakai user saat ini (lihat
tabel di atas untuk daftar lengkap): Claude Code, OpenCode, Antigravity,
Command Code, atau Cursor. Ini menentukan file mana yang perlu disalin
(`SKILL.md` langsung vs. `cursor.mdc` untuk skill; file platform yang sesuai
di `agents/<nama-agent>/` untuk agent) dan ke lokasi mana (lihat tabel
lokasi di atas dan di `agents/README.md`).

### Langkah 3 — Tanyakan skill/agent mana yang mau dipasang

Tawarkan pilihan berdasarkan isi `CATALOG.md` — jangan pasang semuanya
sekaligus tanpa ditanya. Contoh pertanyaan yang baik:
- "Mau pasang skill yang mana? (bisa pilih lebih dari satu)" — list nama +
  deskripsi singkat dari `CATALOG.md`.
- "Mau pasang agent `reviewer` juga?" kalau relevan dengan skill yang
  dipilih (mis. `code-review-and-quality` erat kaitannya dengan agent
  `reviewer`, `prd-grill`/`brd-grill` saling terhubung — sebutkan
  keterkaitan ini saat menawarkan, jangan cuma daftar datar).

### Langkah 4 — Tanyakan lokasi instalasi

Tanyakan apakah user mau pasang di level **project** (hanya repo yang
sedang dikerjakan) atau **global** (semua project — lihat kolom "Lokasi
global" di tabel atas / `agents/README.md`).

### Langkah 5 — Eksekusi

Setelah dikonfirmasi, salin folder/file yang dipilih ke lokasi yang sesuai
(bisa pakai `cp -r` atau setara), lalu laporkan path final ke user. Untuk
skill dengan `references/` yang menyebut skill lain (mis. `brd-grill` yang
hand-off ke `prd-grill`), tawarkan untuk memasang skill terkait itu juga
alih-alih memasangnya diam-diam atau mengabaikannya sama sekali.

### Aturan tambahan

- Jangan modifikasi isi `SKILL.md`/agent file saat menyalin, kecuali user
  secara eksplisit minta disesuaikan ke konvensi repo mereka (lihat pola
  "project-scoped override" di [`CONTRIBUTING.md`](CONTRIBUTING.md) dan
  `skills/prd-grill/references/project-override-example.md`).
- Kalau user belum tahu skill apa yang mereka butuhkan, bantu dengan
  menjelaskan dari deskripsi `CATALOG.md`, jangan menebak dan langsung
  memasang.
