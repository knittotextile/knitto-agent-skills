# Agent Skills — Master Data

Kumpulan **skill lintas-platform** untuk AI coding agent: **Claude Code, OpenCode,
Antigravity, Cursor, dan Codex CLI**. Prinsipnya: **satu skill = satu folder = satu
`SKILL.md`** yang bisa dipakai di semua platform itu sekaligus.

Repo ini juga memuat **agents** (subagent), **commands** (pipeline SDLC), dan **guides**
(panduan flow).

---

## Mulai dari sini

| Kamu siapa | Baca ini |
|---|---|
| 🤖 **AI agent** yang diminta memasang skill dari repo ini | **[`INSTALL.md`](INSTALL.md)** — instruksi mengikat (Langkah 1–7). Jangan menyalin apa pun sebelum menyelesaikannya |
| 👤 **Manusia** — cari skill / mau lihat daftarnya | **[`CATALOG.md`](CATALOG.md)** — daftar lengkap skill & agent + deskripsi singkat + kompatibilitas |
| 🧑‍💻 **Kontributor** — mau menambah/mengubah skill | **[`CONTRIBUTING.md`](CONTRIBUTING.md)** |
| 📖 **Butuh alur kerja per skenario** | **[`guides/`](guides/)** — new feature, bug fix, small change, QA, onboarding repo baru |

> `CATALOG.md` adalah **sumber kebenaran** untuk daftar skill. Jangan andalkan
> daftar yang di-hardcode di README ini — skill terus bertambah.

---

## 🤖 Untuk AI agent yang membaca repo ini

Kalau user mengarahkanmu ke repo ini (link GitHub atau clone lokal) untuk memasang
skill/agent, **jangan langsung menyalin file**. Ikuti **[`INSTALL.md`](INSTALL.md)**
secara berurutan. Ringkas aturannya:

1. **Langkah 1** — baca [`CATALOG.md`](CATALOG.md) untuk daftar terbaru.
2. **Langkah 2** — tanyakan platform user (multi-select: Claude Code, OpenCode,
   Antigravity, Cursor, Codex CLI). **Jangan menebak.**
3. **Langkah 3** — tampilkan checklist skill/agent **dikelompokkan per kategori**
   (mengikuti heading di `CATALOG.md`), lewat tool checklist interaktif bila ada.
4. **Langkah 4** — tanyakan lokasi: **project** atau **global**.
5. **Langkah 5** — tanyakan bahasa operasional (**ID** atau **EN**).
6. **Langkah 6** — salin file, lalu **tulis lockfile** `.agent-skills-lock.json`
   (project) atau `~/.agent-skills-lock.json` (global).
7. **Langkah 7** — untuk instalasi project: cek/tawekan update `AGENTS.md`/`CLAUDE.md`.

**Dilarang:** menyalin tanpa menyelesaikan Langkah 2–3, menebak platform/skill, atau
memasang sesuatu diam-diam. Detail lengkap (termasuk pengecualian OpenCode dan
Antigravity) ada di [`INSTALL.md`](INSTALL.md).

---

## Apa yang ada di repo ini

```
skills/    30 skill (+ skills/_template untuk membuat skill baru)
agents/    2 subagent: reviewer, qa-engineer
commands/  pipeline SDLC: /grill, /dev, /qa, /gate, /promote (+ /skill-sync)
guides/    panduan flow: new-feature-flow, bug-fix-flow, small-change-flow,
           qa-flow, new-repo-onboarding
```

| Bagian | Isi | Detail |
|---|---|---|
| **Skills** | 30 skill satuan (perencanaan, debugging, review, testing, backend, frontend, dll.) | [`CATALOG.md`](CATALOG.md) |
| **Agents** | `reviewer`, `qa-engineer` — ditulis tipis & **mendelegasikan metodologi ke skill** | [`agents/README.md`](agents/README.md) |
| **Commands** | 5 command pipeline PB + `skill-sync` | [`commands/README.md`](commands/README.md) |
| **Guides** | Alur per skenario kerja | [`guides/README.md`](guides/README.md) |

---

## Kenapa satu format bisa dipakai di banyak agent?

Semua platform ini membaca skill dari folder `SKILL.md` (frontmatter YAML + body
markdown), dan **field yang tidak dikenali diabaikan**, bukan bikin error. Jadi satu
`SKILL.md` yang ditulis dengan superset field (lihat `skills/_template/SKILL.md`)
otomatis kompatibel di semua platform.

| Platform | Project-level | Global |
|---|---|---|
| Claude Code | `.claude/skills/<name>/` | `~/.claude/skills/<name>/` |
| OpenCode | `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` | `~/.config/opencode/skills/`, dst. |
| Antigravity | `.agents/skills/<name>/` | `~/.gemini/config/skills/<name>/` |
| Cursor (2.4+) | `.cursor/skills/<name>/` | `~/.cursor/skills/<name>/` |
| Codex CLI | `.agents/skills/<name>/` | `~/.agents/skills/<name>/` |
| Cursor (pra-2.4) | `.cursor/rules/*.mdc` (adapter `cursor.mdc`) | — |

Catatan:

- **Cursor 2.4+** sudah membaca `SKILL.md` native — tidak butuh adapter. Sebagian skill
  masih menyertakan `cursor.mdc` sebagai **fallback** untuk Cursor lama; itu bukan lagi
  cara utama.
- **Codex CLI** juga membaca `SKILL.md` native di `.agents/skills/<name>/` — kompatibel
  tanpa perubahan.
- **OpenCode — skill ≠ slash command.** OpenCode membaca `SKILL.md` lewat tool `skill`
  yang dipanggil agent sendiri, jadi **tidak ada** `/nama-skill` otomatis (beda dari
  Claude Code). Kalau mau dipanggil eksplisit lewat `/`, buat file command *terpisah*
  di `.opencode/commands/<nama-skill>.md` (project) atau
  `~/.config/opencode/commands/<nama-skill>.md` (global), isi minimal:

  ```markdown
  ---
  description: <deskripsi singkat dari CATALOG.md>
  ---
  Use the "<nama-skill>" skill (call skill({ id: "<nama-skill>" })) to handle this request: $ARGUMENTS
  ```

  Ini wrapper tambahan saat instalasi (lihat [`INSTALL.md`](INSTALL.md) Langkah 6), bukan
  bagian dari `SKILL.md`.
- **OpenCode tidak memilih model sendiri** — skill berjalan di konteks sesi/agent aktif.
  Untuk subagent, biarkan field `model` kosong agar mengikuti sesi pemanggil.

---

## Pipeline: DEFINE → SHIP

Selain skill satuan, repo ini punya **5 command** yang membungkus rantai
`brd-reader`/`prd-grill`/`exec-todo`/`code-review-and-quality`/`branching` jadi satu
pipeline per Product Backlog (PB) item. Master data-nya di [`commands/`](commands/) —
satu folder per command, dengan adapter untuk Claude Code, OpenCode, Cursor, dan
Antigravity.

```
 DEFINE          BUILD           VERIFY          REVIEW          SHIP
┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐
│  PB   │ ───▶ │ Impl  │ ───▶ │ E2E/  │ ───▶ │ Code  │ ───▶ │ Buka  │
│PRD/BRD│      │ +cheap│      │ manual│      │review │      │PR ke  │
│ grill │      │ check │      │ test  │      │ +sec  │      │trunk  │
└───────┘      └───────┘      └───────┘      └───────┘      └───────┘
 /grill          /dev            /qa            /gate         /promote
```

| Lagi ngapain | Command | Prinsip utama |
|---|---|---|
| Gali PB jadi requirement tertulis | `/grill` | Requirement tertulis sebelum kode |
| Implementasi checklist, item per item | `/dev` | Cheap check per item, bukan full test tiap kali |
| Buktikan flow-nya beneran jalan | `/qa` | Full E2E/manual, dijalankan sadar — bukan otomatis |
| Tegakkan standar sebelum merge | `/gate` | Review 5-axis + security bila relevan |
| Buka PR promosi ke trunk/staging | `/promote` | Menolak jalan kalau `/qa`/`/gate` belum lolos; murni git-PR, bukan deploy |

Poin penting:

- `/dev` **cuma** menjalankan cheap check (unit test/type-check/build) per item lalu
  berhenti. Full E2E (`/qa`) dan review (`/gate`) sengaja dipisah supaya biaya
  waktu/token untuk verifikasi penuh tidak otomatis kepakai tiap item kecil selesai.
  Keduanya bisa di-batch lintas PB lewat `--run-pending`.
- `/promote` **tidak men-deploy apa pun** — hanya membuka/update PR dari `<slug>-main`
  ke trunk (dan sync cherry-pick ke branch staging bila repo pakai model `branching`),
  lalu berhenti. Tidak ada cek CI, tidak menunggu deploy, tidak menyentuh
  `releases/main`. Keputusan rilis tetap di CI/CD masing-masing repo (lihat skill
  `deployment` untuk checklist rilis yang terpisah dari `/promote`).
- `/promote` **menolak jalan** sebelum `/qa` dan `/gate` lolos — jadi ini gate, bukan
  sekadar alias urutan. Ini adaptasi dari `/ship` di addyosmani/agent-skills (lihat
  [`SOURCES.md`](SOURCES.md)), bedanya berhenti di "PR terbuka".

Detail tiap tahap, kapan skip BRD, dan contoh nyata: [`guides/new-feature-flow.md`](guides/new-feature-flow.md).

---

## Struktur repo

```
skills/
  <nama-skill>/
    SKILL.md          # wajib — format superset (Claude Code/OpenCode/Antigravity/Codex/Cursor 2.4+)
    cursor.mdc         # opsional — fallback Cursor pra-2.4
    scripts/            # opsional — kode executable yang dipanggil skill
    references/         # opsional — detail yang di-load on-demand (progressive disclosure)
    assets/              # opsional — template, contoh, file statis
skills/_template/       # salin folder ini untuk membuat skill baru

agents/
  <nama-agent>/
    claude-code.md      # subagent Claude Code
    opencode.md          # subagent OpenCode
    antigravity.md         # subagent Antigravity
    cursor.md                # subagent Cursor
    codex.toml                 # subagent Codex CLI
  README.md               # konvensi lengkap tiap platform — baca ini dulu

commands/<nama>/        # adapter command per platform (+ README.md)
guides/                  # panduan flow per skenario (+ README.md)

CATALOG.md               # index semua skill & agent: nama, deskripsi, tag, kompatibilitas
CONTRIBUTING.md          # cara menambah/mengubah skill + aturan frontmatter
INSTALL.md               # instruksi instalasi mengikat untuk AI agent (Langkah 1–7)
SOURCES.md               # atribusi skill yang diadopsi dari repo open-source (MIT/Apache-2.0)
```

Agent (subagent) tidak punya format lintas-platform tunggal seperti skill — tiap
platform pakai dialek frontmatter sendiri, jadi satu folder agent berisi satu file per
platform dengan **body (system prompt) yang sama**. Agent sengaja ditulis tipis dan
**mendelegasikan metodologi ke skill** (mis. agent `reviewer` memanggil skill
`code-review-and-quality`) supaya metodologi tetap satu sumber kebenaran. Detail:
[`agents/README.md`](agents/README.md).

---

## Cara pakai (untuk manusia)

Cara tercepat: **paste link repo ini ke AI agent kamu** dan minta dipasangkan — agent
akan mengikuti [`INSTALL.md`](INSTALL.md). Atau manual:

1. Salin folder `skills/<nama-skill>/` ke lokasi skill platform kamu (lihat tabel
   kompatibilitas di atas), **atau**
2. Symlink/clone repo ini lalu arahkan konfigurasi platform ke folder `skills/`
   (OpenCode & Antigravity sama-sama mengenali `.agents/skills/`).

---

## Cara menambah skill baru

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md). Ringkasnya: nama folder = `name` di
frontmatter, `description` jelas (kapan dipakai & tidak dipakai), body < 500 baris
(detail panjang ke `references/`), sudah dites di minimal satu platform, dan update
`CATALOG.md`.

---

## Lisensi

[MIT](LICENSE) — setiap skill/agent/command di sini juga mendeklarasikan `license: MIT`
di frontmatter-nya masing-masing.
