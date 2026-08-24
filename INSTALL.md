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
OpenCode, Antigravity, Command Code, dan/atau Cursor — tampilkan sebagai
**checklist multi-select**, karena user bisa saja pakai lebih dari satu
platform sekaligus (mis. Claude Code untuk coding harian + Cursor di editor
lain) dan mau pasang skill yang sama ke semuanya dalam satu alur. Platform
yang dipilih menentukan file mana yang perlu disalin per platform
(`SKILL.md` langsung vs. `cursor.mdc` untuk skill; file platform yang
sesuai di `agents/<nama-agent>/` untuk agent) dan ke lokasi mana
masing-masing (lihat tabel lokasi di [`README.md`](README.md) dan di
`agents/README.md`).

Tanyakan ini sebagai pertanyaan **tersendiri dan pertama**, sebelum apa pun
di bawah — begitu platform (satu atau lebih) terjawab, langsung lanjut ke
Langkah 3 dalam respons yang sama tanpa jeda tambahan.

### Langkah 3 — Tampilkan checklist skill + agent, dikelompokkan per kategori (WAJIB)

**Cara menampilkan (WAJIB):** checklist ini **selalu ditulis sebagai
teks/markdown biasa di respons** (format contoh di bawah) — **JANGAN** pakai
tool tanya-jawab interaktif berbasis pilihan (mis. `AskUserQuestion` di
Claude Code), karena jumlah skill+agent di `CATALOG.md` sudah pasti lebih
dari batas opsi tool semacam itu (umumnya maksimal 4 opsi/pertanyaan) dan
akan error. User membalas checklist ini dengan teks bebas (sebut nama
skill yang mau dipasang, atau "semua di kategori X").

Ini beda dengan Langkah 2 (tanya platform): kalau daftar platform yang
ditawarkan masih di bawah batas opsi tool pilihan yang tersedia, boleh
pakai tool itu; kalau melebihi batas, turun ke teks biasa juga.

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

### Aturan tambahan

- Jangan modifikasi isi `SKILL.md`/agent file saat menyalin, kecuali user
  secara eksplisit minta disesuaikan ke konvensi repo mereka (lihat pola
  "project-scoped override" di [`CONTRIBUTING.md`](CONTRIBUTING.md) dan
  `skills/prd-grill/references/project-override-example.md`).
- Kalau user belum tahu skill apa yang mereka butuhkan, bantu dengan
  menjelaskan dari deskripsi `CATALOG.md`, jangan menebak dan langsung
  memasang.
