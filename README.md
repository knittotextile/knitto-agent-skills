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
saat instalasi (lihat [`INSTALL.md`](INSTALL.md) Langkah 6).

## Pipeline: DEFINE → SHIP

Selain skill satuan, repo ini punya 5 **command wrapper** yang membungkus
rantai `brd-reader`/`prd-grill`/`exec-todo`/`code-review-and-quality`/
`branching` jadi satu pipeline linear per Product Backlog (PB)
item. Master data-nya di [`commands/`](commands/) — satu folder per
command, satu file per platform yang benar-benar mendukung command custom
(**Claude Code, OpenCode, Cursor**). Antigravity dan Codex CLI sengaja
tidak dapat file command di sini — keduanya punya keterbatasan/mekanisme
berbeda, lihat [`commands/README.md`](commands/README.md) untuk cara
menjalankan pipeline ini di kedua platform tersebut.

**Penting: `/promote` (tahap SHIP) tidak men-deploy apa pun.** Ia cuma
membuka/update PR — dari `<slug>-main` ke trunk, dan (kalau repo pakai
model `branching`) sync cherry-pick ke branch staging — lalu berhenti.
Tidak ada cek CI, tidak menunggu deploy live, tidak menyentuh
`releases/main`. Keputusan deploy/rilis sesungguhnya tetap di tangan
proses CI/CD masing-masing repo, di luar pipeline ini; lihat skill
`deployment` kalau butuh checklist judgment-call seputar rilis itu
sendiri (rollback plan, gradual rollout, dll) — itu terpisah dari
`/promote` dan tidak dipanggil otomatis olehnya.

```
 DEFINE          BUILD           VERIFY          REVIEW          SHIP
┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐
│  PB   │ ───▶ │ Impl  │ ───▶ │ E2E/  │ ───▶ │ Code  │ ───▶ │ Buka  │
│PRD/BRD│      │ +cheap│      │ manual│      │review │      │PR ke  │
│ grill │      │ check │      │ test  │      │ +sec  │      │trunk  │
└───────┘      └───────┘      └───────┘      └───────┘      └───────┘
 /grill          /dev            /qa            /gate         /promote
```

### Commands

5 slash command yang memetakan siklus hidup satu Product Backlog (PB) item.
Tiap command adalah wrapper tipis di atas skill yang sudah ada — tidak ada
logika baru, cuma urutan dan gate yang dipaksa.

| Lagi ngapain | Command | Prinsip utama |
|---|---|---|
| Gali PB jadi requirement tertulis | `/grill` | Requirement tertulis sebelum kode |
| Implementasi checklist, item per item | `/dev` | Cheap check per item, bukan full test tiap kali |
| Buktikan flow-nya beneran jalan | `/qa` | Full E2E/manual, dijalankan sadar — bukan otomatis |
| Tegakkan standar sebelum merge | `/gate` | Review 5-axis + security bila relevan |
| Buka PR promosi ke trunk/staging | `/promote` | Menolak jalan kalau `/qa`/`/gate` belum lolos; murni git-PR mechanics, bukan deploy |

Titik pentingnya: `/dev` **cuma** menjalankan cheap check (unit test/
type-check/build) per item, lalu berhenti — full E2E/manual verification
(`/qa`) dan review (`/gate`) sengaja dipisah jadi command tersendiri,
supaya biaya waktu/token untuk test/review penuh tidak otomatis kepakai
tiap kali satu item kecil selesai. Keduanya bisa di-batch lintas beberapa
PB sekaligus lewat `--run-pending` kalau ada beberapa yang numpuk.

`/promote` menolak jalan sebelum `/qa` dan `/gate` lolos — jadi pipeline
ini bukan cuma alias urutan, tapi juga menegakkan gate-nya, sama seperti
`/ship` di addyosmani/agent-skills yang jadi inspirasi struktur pipeline
ini (lihat [`SOURCES.md`](SOURCES.md) untuk skill yang memang diadopsi
langsung dari sana) — bedanya, `/ship` di sana boleh mencakup langkah
deploy, sedangkan `/promote` di repo ini sengaja berhenti di "PR terbuka"
saja, karena mekanisme deploy setiap repo bisa sangat berbeda dan bukan
sesuatu yang aman untuk diasumsikan/dieksekusi otomatis oleh agent.

Detail tiap tahap, kapan skip BRD, dan contoh nyata: lihat
[`guides/new-feature-flow.md`](guides/new-feature-flow.md).

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

## Lisensi

[MIT](LICENSE) — setiap skill/agent/command di sini juga mendeklarasikan
`license: MIT` di frontmatter-nya masing-masing.
