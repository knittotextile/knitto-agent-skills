# Menambah / Mengubah Skill

## 1. Salin template

```
cp -r skills/_template skills/<nama-skill>
```

Nama folder **harus sama persis** dengan field `name` di frontmatter:
lowercase, angka, dan tanda hubung saja (`^[a-z0-9]+(-[a-z0-9]+)*$`), maks
64 karakter, tidak boleh diawali/diakhiri tanda hubung.

## 2. Isi `SKILL.md`

Field frontmatter berikut adalah **superset** — dikumpulkan dari field yang
dikenali Claude Code, OpenCode, Antigravity, dan Command Code. Field yang
tidak dikenal sebuah platform akan diabaikan platform itu, jadi aman ditulis
semua.

| Field | Wajib? | Dipakai oleh | Keterangan |
|---|---|---|---|
| `name` | Ya | semua | Harus sama dengan nama folder |
| `description` | Ya | semua | Maks ~1024 char. Ini yang dibaca agent untuk memutuskan kapan skill dipakai — tulis jelas & spesifik, termasuk kapan *tidak* dipakai |
| `license` | Opsional | OpenCode, Command Code | |
| `compatibility` | Opsional | OpenCode, Command Code | Maks 500 char, syarat environment |
| `metadata` | Opsional | semua (map string→string) | Pakai untuk `category`, `author`, `version` |
| `allowed-tools` | Opsional | Command Code | Tools yang pre-approved (experimental) |
| `disallowed-tools` | Opsional | Command Code | |
| `argument-hint` | Opsional | Command Code | Ditampilkan di menu `/` |
| `when_to_use` | Opsional | Command Code | Konteks tambahan untuk auto-invocation |
| `disable-model-invocation` | Opsional | Command Code | `true` = sembunyikan dari model |
| `user-invocable` | Opsional | Command Code | `false` = sembunyikan dari menu `/` |
| `model` / `effort` | Opsional | Command Code | Pin model / reasoning effort |
| `compatible_with` | Opsional, khusus repo ini | — | List platform yang sudah diverifikasi jalan, mis. `[claude-code, opencode, antigravity, commandcode]` — dipakai untuk mengisi `CATALOG.md` |

Body markdown di bawah frontmatter: instruksi langkah-demi-langkah untuk
agent. Usahakan **di bawah 500 baris** — detail panjang (skema, referensi
API, contoh besar) pindahkan ke `references/` dan cukup ditunjuk dari body
(progressive disclosure), supaya skill tidak boros token saat di-load.

## 3. (Opsional, legacy) Adapter Cursor untuk instalasi lama

Sejak Cursor 2.4, Cursor sudah baca `SKILL.md` native di
`.cursor/skills/<name>/` — tidak perlu adapter apa pun, cukup salin folder
skill apa adanya (sama seperti Claude Code/OpenCode/Antigravity/Command
Code/Codex). `cursor.mdc` (adapter model-rules lama, `.cursor/rules/*.mdc`)
hanya relevan untuk instalasi Cursor pra-2.4 yang belum punya skill-folder
native — buat file ini hanya kalau ada permintaan eksplisit untuk
mendukung versi Cursor lama itu, bukan lagi default untuk setiap skill
baru.

## 4. Tambahkan scripts/references/assets bila perlu

- `scripts/` — kode yang dieksekusi skill (beri execute permission,
  daftarkan di `allowed-tools` bila relevan)
- `references/` — dokumentasi detail yang di-load on-demand, bukan langsung
  dibaca semua
- `assets/` — template, contoh output, file statis

## 5. Update `CATALOG.md`

Tambahkan satu baris ke tabel di `CATALOG.md`: nama, deskripsi singkat, tag,
dan daftar platform yang sudah diverifikasi (`compatible_with`).

## 6. Checklist sebelum commit

- [ ] Nama folder = `name` di frontmatter
- [ ] `description` jelas kapan dipakai / tidak dipakai
- [ ] Body < 500 baris, detail panjang di `references/`
- [ ] Sudah dites minimal di satu platform, dicatat di `compatible_with`
- [ ] `CATALOG.md` sudah diupdate
