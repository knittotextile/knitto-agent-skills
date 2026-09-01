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
tabel lokasi di [`README.md`](README.md) untuk daftar lengkap): Claude Code,
OpenCode, Antigravity, Command Code, Cursor, dan/atau Codex CLI — tampilkan sebagai
**checklist multi-select**, karena user bisa saja pakai lebih dari satu
platform sekaligus (mis. Claude Code untuk coding harian + Cursor di editor
lain) dan mau pasang skill yang sama ke semuanya dalam satu alur. Platform
yang dipilih menentukan file mana yang perlu disalin per platform
(`SKILL.md` langsung untuk semua platform termasuk Cursor 2.4+ dan Codex —
`cursor.mdc` cuma untuk fallback Cursor pra-2.4 kalau eksplisit diminta;
file platform yang sesuai di `agents/<nama-agent>/` untuk agent, termasuk
`codex.toml` untuk Codex CLI) dan ke lokasi mana masing-masing (lihat tabel
lokasi di [`README.md`](README.md) dan di `agents/README.md`).

Tanyakan ini sebagai pertanyaan **tersendiri dan pertama**, sebelum apa pun
di bawah — begitu platform (satu atau lebih) terjawab, langsung lanjut ke
Langkah 3 dalam respons yang sama tanpa jeda tambahan.

### Langkah 3 — Tampilkan checklist skill + agent, dikelompokkan per kategori (WAJIB)

**Cara menampilkan (WAJIB):** checklist ini tetap **checklist interaktif
sungguhan** (mis. `AskUserQuestion` di Claude Code, multi-select), **bukan**
teks markdown yang dibalas manual — tapi tool semacam itu biasanya punya
batas jumlah opsi per pertanyaan (umumnya maksimal 4) dan/atau jumlah
pertanyaan per pemanggilan (umumnya maksimal 4), sementara skill+agent di
`CATALOG.md` pasti lebih banyak dari itu dan terus bertambah. Supaya tidak
error karena melebihi batas:

- **Pecah per kategori jadi beberapa pertanyaan multi-select**, satu
  pertanyaan per kategori (header = nama kategori), opsi = skill/agent di
  kategori itu. Kalau satu kategori sendiri sudah melebihi batas opsi,
  pecah kategori itu jadi beberapa pertanyaan lanjutan (mis. "Frontend &
  testing (1/2)", "(2/2)").
- **Ajukan sebanyak mungkin pertanyaan dalam satu kali panggilan tool**
  (sampai batas jumlah pertanyaan per panggilan), lalu kalau kategori masih
  tersisa, lakukan panggilan tool berikutnya dalam giliran/respons yang
  sama sampai semua kategori tertanya — jangan berhenti di tengah dan
  menunggu user membalas dulu sebelum kategori lain ditanyakan, kecuali
  tool memang tidak bisa dipanggil berkali-kali dalam satu giliran (baru
  lanjutkan di giliran berikutnya).
- Kalau platform yang dipakai memang tidak punya tool checklist interaktif
  sama sekali, baru turun ke teks/markdown biasa (format contoh di bawah)
  sebagai fallback terakhir.

**Contoh mekanik "4×4" (angka batas tergantung tool, ganti sesuai batas
tool yang kamu pakai):** kalau tool mengizinkan maksimal 4 pertanyaan per
panggilan dan maksimal 4 opsi per pertanyaan, satu panggilan bisa menanyakan
sampai 4 kategori sekaligus (masing-masing jadi 1 pertanyaan multi-select,
maks 4 skill/agent per pertanyaan). Misal `CATALOG.md` saat ini punya 6
kategori dan salah satunya ("Alur perencanaan → eksekusi") isinya 6 item:

1. Panggilan tool #1 — 4 pertanyaan: "Alur perencanaan → eksekusi (1/2)"
   (4 item pertama), "Alur perencanaan → eksekusi (2/2)" (2 item sisa),
   "Review & kualitas" (3 item), "Git & deploy" (2 item).
2. Panggilan tool #2 (masih di respons yang sama, tanpa nunggu user
   membalas dulu) — pertanyaan sisa: "Backend & database" (4 item),
   "Frontend & testing" (4 item), "Agents" (1 item).
3. User menjawab semua pertanyaan dari kedua panggilan sekaligus (tool
   biasanya menampung banyak pertanyaan dalam satu batch jawaban), baru
   lanjut Langkah 4.

Intinya: hitung dulu berapa kategori dan berapa item per kategori dari
`CATALOG.md` yang sedang dibaca, lalu bagi jadi kelompok pertanyaan
sebanyak yang muat sesuai batas tool — bukan dipaksakan satu pertanyaan
raksasa yang pasti error.

Begitu platform diketahui, langsung tampilkan checklist ini (via tool
interaktif, dipecah sesuai mekanik di atas), **dikelompokkan per
kategori**, bukan satu daftar rata tanpa struktur. Sumber kategori dan
urutannya adalah heading-heading `##`/`###` yang sudah ada di
`CATALOG.md` (mis. "Alur perencanaan → eksekusi", "Review & kualitas",
"Git & deploy", "Backend & database", "Frontend & testing", lalu "Agents"
sebagai kategori sendiri di akhir) — jangan bikin kategori baru versi
sendiri, ikuti persis pembagian yang sudah ada di `CATALOG.md` saat itu
dibaca, karena daftar skill akan terus bertambah dan berubah.

Isi tiap opsi/baris checklist: nama skill/agent + deskripsi-singkat
(ambil dari kolom "Deskripsi Singkat" di `CATALOG.md`, jangan diringkas
ulang atau ditulis versimu sendiri). Semua kategori tetap harus tertanya
dalam giliran yang sama (lewat beberapa panggilan tool kalau perlu),
bukan ditanya satu kategori per giliran terpisah yang nunggu balasan user
di antaranya. Kalau harus fallback ke teks biasa (tool tidak tersedia),
pakai kerangka contoh berikut, isi nama & deskripsi sesuai `CATALOG.md`
versi terbaru:

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
global" di tabel [`README.md`](README.md) / `agents/README.md`). Kalau
platform yang dipilih di Langkah 2 lebih dari satu, lokasi ini berlaku sama
untuk semua platform tersebut kecuali user secara eksplisit minta beda per
platform.

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

**Khusus OpenCode — skill tidak otomatis jadi slash command.** Kalau
OpenCode ada di antara platform yang dipilih di Langkah 2, ingat bahwa
OpenCode hanya membaca `SKILL.md` lewat tool `skill` yang dipanggil agent
sendiri — beda dari Claude Code yang otomatis punya `/nama-skill`. Setelah
menyalin `SKILL.md` ke lokasi OpenCode, **tanyakan** apakah user juga mau
dibuatkan file command wrapper supaya skill itu bisa dipanggil eksplisit
lewat `/nama-skill` di OpenCode (lihat format & lokasi di
[`README.md`](README.md) bagian "Catatan OpenCode"). Kalau ya, buat file
`.opencode/commands/<nama-skill>.md` (project) atau
`~/.config/opencode/commands/<nama-skill>.md` (global, ikuti pilihan
Langkah 4) untuk tiap skill yang dipasang ke OpenCode, isi minimal
frontmatter `description` (ambil dari `CATALOG.md`) + body yang memanggil
`skill({ name: "<nama-skill>" })` dengan `$ARGUMENTS`. Jangan buat wrapper
ini diam-diam tanpa ditanya dulu.

### Langkah 6 — Cek AGENTS.md/CLAUDE.md di repo target (hanya untuk instalasi level project)

Kalau lokasi instalasi di Langkah 4 adalah **project** (bukan global), cek
apakah repo target sudah punya `AGENTS.md` atau `CLAUDE.md` di root repo.

- Kalau salah satu (atau keduanya) **sudah ada**, jangan menimpa isinya.
  Tawarkan untuk menambahkan bagian singkat yang mendaftar skill/agent yang
  baru saja dipasang (nama + lokasi file + trigger/kapan dipakai), supaya
  file itu tetap jadi sumber kebenaran yang lengkap tanpa kehilangan isi
  yang sudah ditulis user sebelumnya.
- Kalau **belum ada sama sekali** (tidak ada `AGENTS.md` maupun
  `CLAUDE.md`), tawarkan ke user untuk membuatkan salah satunya (tanyakan
  yang mana kalau tidak jelas dari platform yang dipilih di Langkah 2 —
  Claude Code memakai `CLAUDE.md`, platform lain umumnya `AGENTS.md`).
  Isi file yang dibuat minimal mencakup:
  - Ringkasan singkat project (dari `README.md` repo target kalau ada,
    atau ditanyakan langsung ke user kalau belum jelas).
  - Daftar skill/agent yang baru dipasang di Langkah 5: nama, lokasi file
    hasil instalasi, dan kapan/kenapa agent sebaiknya memakainya (ambil
    dari deskripsi di `CATALOG.md`, jangan ditulis ulang versimu sendiri).
  - Konvensi dasar repo yang relevan buat agent (struktur folder, cara
    menjalankan test/build) kalau bisa disimpulkan dari file project yang
    ada (`package.json`, `Makefile`, dll) — jangan mengarang kalau tidak
    yakin, cukup skip bagian ini.
  Jangan membuat file ini diam-diam tanpa persetujuan user — selalu
  tawarkan dulu dan tunggu konfirmasi, karena ini file baru di repo user.

### Aturan tambahan

- Jangan modifikasi isi `SKILL.md`/agent file saat menyalin, kecuali user
  secara eksplisit minta disesuaikan ke konvensi repo mereka (lihat pola
  "project-scoped override" di [`CONTRIBUTING.md`](CONTRIBUTING.md) dan
  `skills/prd-grill/references/project-override-example.md`).
- Kalau user belum tahu skill apa yang mereka butuhkan, bantu dengan
  menjelaskan dari deskripsi `CATALOG.md`, jangan menebak dan langsung
  memasang.
