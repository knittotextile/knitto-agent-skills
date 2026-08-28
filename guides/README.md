# Guides

Dokumentasi **untuk manusia**, bukan untuk agent. Beda sama `skills/` dan
`agents/` yang isinya di-load AI coding agent saat kerja, folder ini cuma
referensi biasa — bebas format, nggak ada frontmatter, nggak ada aturan
kompatibilitas platform.

Isinya: alur/orchestration — urutan skill & agent mana yang dipakai kapan,
buat kasus pemakaian nyata. `CATALOG.md` di root tetap jadi index singkat
tiap skill; kalau kamu udah tahu skill apa yang kamu cari, mulai dari situ.
Kalau kamu belum tahu skill mana yang relevan buat situasi kamu (mis. "lagi
mulai fitur baru, mulai dari mana?"), mulai dari sini.

## Daftar flow

| Flow | Buat situasi | Skill/agent yang dipakai |
|---|---|---|
| [`new-feature-flow.md`](new-feature-flow.md) | Fitur baru dari ide mentah sampai deploy | `brd-grill` → `prd-grill` → `exec-todo` → `code-review-and-quality` → `deployment` |
| [`bug-fix-flow.md`](bug-fix-flow.md) | Ada bug yang perlu diperbaiki | `debugging` → `test-driven-development` → `code-review-and-quality` |
| [`new-repo-onboarding.md`](new-repo-onboarding.md) | Baru pertama kali kerja di repo/project | `project-bootstrap` → `agent-doctor` |
| [`qa-flow.md`](qa-flow.md) | Nambah test coverage buat fitur | `test-case-matrix` → `react-testing` / `e2e-testing` / `webapp-testing` (setara agent `qa-engineer`) |

## Cara nulis flow baru

1. Satu file markdown per flow, nama file deskriptif (`kebab-case-flow.md`).
2. Isi minimal: kapan flow ini relevan, urutan skill/agent (boleh ada
   percabangan/skip), dan satu contoh singkat.
3. Tambahin barisnya ke tabel di atas.
4. Kalau flow-nya sudah dijelaskan di `CATALOG.md` (mis. bagian "Alur
   perencanaan → eksekusi"), jangan duplikat narasinya di sana — cukup
   link ke file di sini, biar nggak ada dua sumber kebenaran.
