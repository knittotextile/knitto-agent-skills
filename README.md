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
lihat section di bawah, itu instruksi yang dibaca agent tersebut.

## Cara menambah skill baru

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 🤖 Untuk AI agent yang membaca repo ini

Kamu (AI agent) sedang diarahkan ke repo ini — lewat link GitHub yang
di-paste user, atau lewat clone lokal. **WAJIB** ikuti Langkah 1–5 di bawah
ini secara berurutan sebelum menyalin file apa pun. Ini bukan saran, ini
aturan mengikat:

- **DILARANG** menyalin skill/agent apa pun tanpa lebih dulu menyelesaikan
  Langkah 2 dan Langkah 3 (checklist eksplisit dari user).
- **DILARANG** menebak platform atau menebak skill yang "kelihatannya
  relevan" lalu langsung memasangnya diam-diam.
- **DILARANG** melompati/menggabung langkah di luar cara yang sudah
  ditentukan di masing-masing langkah (mis. Langkah 2 dan 3 memang
  dirancang menyatu dalam satu alur — lihat instruksinya — tapi Langkah 4
  dan 5 tetap terpisah, jangan digabung sendiri).

Tujuannya: siapa pun yang "caplok" skill dari repo ini lewat AI agent
harus dapat pengalaman yang sama — cepat, jelas, dan tidak salah pasang
(salah folder platform, salah skill, atau ke lokasi yang tidak dia mau).

### Langkah 1 — Baca katalog

Baca [`CATALOG.md`](CATALOG.md) untuk daftar skill dan agent yang tersedia
saat ini beserta deskripsi singkatnya. Jangan andalkan daftar hardcoded di
README ini — `CATALOG.md` adalah sumber kebenaran yang paling update.

### Langkah 2 — Tanyakan platform user (WAJIB, jangan ditebak, boleh lebih dari satu)

Tanyakan platform AI coding agent mana yang dipakai user saat ini (lihat
tabel di atas untuk daftar lengkap): Claude Code, OpenCode, Antigravity,
Command Code, dan/atau Cursor — tampilkan sebagai **checklist multi-select**,
karena user bisa saja pakai lebih dari satu platform sekaligus (mis. Claude
Code untuk coding harian + Cursor di editor lain) dan mau pasang skill yang
sama ke semuanya dalam satu alur. Platform yang dipilih menentukan file mana
yang perlu disalin per platform (`SKILL.md` langsung vs. `cursor.mdc` untuk
skill; file platform yang sesuai di `agents/<nama-agent>/` untuk agent) dan
ke lokasi mana masing-masing (lihat tabel lokasi di atas dan di
`agents/README.md`).

Tanyakan ini sebagai pertanyaan **tersendiri dan pertama**, sebelum apa pun
di bawah — begitu platform (satu atau lebih) terjawab, langsung lanjut ke
Langkah 3 dalam respons yang sama tanpa jeda tambahan.

### Langkah 3 — Tampilkan checklist skill + agent, dikelompokkan per kategori (WAJIB)

Begitu platform diketahui, langsung tampilkan **satu checklist gabungan**
(multi-select), tapi **dikelompokkan per kategori**, bukan satu daftar rata
tanpa struktur. Sumber kategori dan urutannya adalah heading-heading `##`/`###`
yang sudah ada di `CATALOG.md` (mis. "Alur perencanaan → eksekusi", "Review &
kualitas", "Git & deploy", "Backend & database", "Frontend & testing", lalu
"Agents" sebagai kategori sendiri di akhir) — jangan bikin kategori baru versi
sendiri, ikuti persis pembagian yang sudah ada di `CATALOG.md` saat itu
dibaca, karena daftar skill akan terus bertambah dan berubah.

Format checklist per kategori: tampilkan nama kategori sebagai header
kelompok, lalu di bawahnya list tiap skill/agent dalam kategori itu sebagai
satu baris checkbox `nama` + deskripsi-singkat (ambil dari kolom "Deskripsi
Singkat" di `CATALOG.md`, jangan diringkas ulang atau ditulis versimu
sendiri). Semua kategori tampil sekaligus dalam satu pesan/checklist, bukan
ditanya satu kategori per giliran. Contoh kerangka (isi nama & deskripsi
sesuai `CATALOG.md` versi terbaru):

```
## Alur perencanaan → eksekusi
[ ] brd-grill — <deskripsi singkat dari CATALOG.md>
[ ] prd-grill — <deskripsi singkat dari CATALOG.md>
...

## Review & kualitas
[ ] code-review-and-quality — <deskripsi singkat>
...

## Agents
[ ] reviewer — <deskripsi singkat>
```

Tetap sebutkan keterkaitan antar item saat menawarkan (mis.
`code-review-and-quality` erat kaitannya dengan agent `reviewer`,
`prd-grill`/`brd-grill`/`exec-todo` saling terhubung), supaya user tahu opsi
yang saling melengkapi tanpa perlu ditanya dua kali. Jangan pasang semuanya
sekaligus tanpa dikonfirmasi via checklist ini, dan jangan pecah jadi
pertanyaan terpisah per kategori — satu checklist, semua kategori, satu kali
tanya.

### Langkah 4 — Tanyakan lokasi instalasi

Tanyakan apakah user mau pasang di level **project** (hanya repo yang
sedang dikerjakan) atau **global** (semua project — lihat kolom "Lokasi
global" di tabel atas / `agents/README.md`). Kalau platform yang dipilih di
Langkah 2 lebih dari satu, lokasi ini berlaku sama untuk semua platform
tersebut kecuali user secara eksplisit minta beda per platform.

### Langkah 5 — Eksekusi

Setelah dikonfirmasi, salin folder/file yang dipilih ke lokasi yang sesuai
untuk **setiap platform** yang dipilih di Langkah 2 (bisa pakai `cp -r` atau
setara) — satu skill/agent bisa berarti beberapa operasi salin sekaligus
kalau platformnya lebih dari satu. Setelah semua selesai, laporkan path
final per platform ke user dalam satu ringkasan (jangan laporkan
sepotong-sepotong). Untuk skill dengan `references/` yang menyebut skill
lain (mis. `brd-grill` yang hand-off ke `prd-grill`), tawarkan untuk
memasang skill terkait itu juga alih-alih memasangnya diam-diam atau
mengabaikannya sama sekali.

### Aturan tambahan

- Jangan modifikasi isi `SKILL.md`/agent file saat menyalin, kecuali user
  secara eksplisit minta disesuaikan ke konvensi repo mereka (lihat pola
  "project-scoped override" di [`CONTRIBUTING.md`](CONTRIBUTING.md) dan
  `skills/prd-grill/references/project-override-example.md`).
- Kalau user belum tahu skill apa yang mereka butuhkan, bantu dengan
  menjelaskan dari deskripsi `CATALOG.md`, jangan menebak dan langsung
  memasang.
