---
name: db-migration
description: "Konvensi migration SQL manual di project berbasis rest-boilerplate-ts: kapan perlu migration, penamaan file, template SQL PB/hotfix, dan SQL yang dilarang (CTE, ROW_NUMBER). Gunakan saat mengubah schema/kolom/index. Untuk prinsip migrasi umum lihat database-migrations."
license: MIT
metadata:
  category: knitto-rest-ts
  author: lintang
  scope: project
compatible_with: [claude-code, opencode, cursor, codex, antigravity]
---

# Database migration (SQL manual)

Playbook menulis file migration di folder `database/` — **apply manual** ke target DB (dev/staging) via client DBA; **tidak** menambah runner, CI, atau tooling otomatis di repo.

**Penamaan & konvensi proyek:** `.cursor/rules/boilerplate.mdc` (rest-boilerplate-ts) (§ Konvensi Penamaan — migration). **Workflow git:** `README.md` repo (Database Migrations). Jangan duplikasi tabel layering HTTP di sini.

**Template SQL:** [`examples/`](./examples/).


## Kapan buat migration

- Fitur **Product Backlog** butuh tabel/kolom/index/constraint baru atau ubah schema
- **Production issue** butuh perubahan DB terpisah dari epic PB (hotfix schema)

Jika hanya query aplikasi (SELECT/mutasi di kode) tanpa ubah schema → bukan skill ini; ikuti `.cursor/rules/boilerplate.mdc` (rest-boilerplate-ts) (queries/ + repo/).

## Penamaan file

| Konteks | Pola file | Contoh |
| ------- | --------- | ------ |
| Product Backlog | `database/PB-x.x.x.sql` | `database/PB-1.2.0.sql` — selaras versi/epic PB |
| Production issue | `database/YYYYMMDDHHmmss.sql` | `database/20250727143000.sql` — timestamp saat dibuat |

**Larangan:** jangan campur naming PB dan timestamp prod dalam **satu** file.

## Isi file SQL

- Satu concern utama per file (satu epic PB atau satu hotfix prod)
- Komentar `--` untuk konteks (ticket, tabel, alasan)
- Idempotent-friendly bila memungkinkan (`IF NOT EXISTS`, cek sebelum ALTER — sesuai kebijakan tim/DBA)
- **SQL terlarang proyek** (sama `.cursor/rules/boilerplate.mdc` (rest-boilerplate-ts)): **CTE**, **`ROW_NUMBER()`**

Snippet header: [`examples/migration-pb.snippet.md`](./examples/migration-pb.snippet.md), [`examples/migration-prod-issue.snippet.md`](./examples/migration-prod-issue.snippet.md).

## Checklist sebelum commit

- [ ] Nama file sesuai PB **ata** timestamp prod (bukan keduanya dalam satu file)
- [ ] Perubahan breaking schema tercatat di PRD / `plan.md` / `api-design.md` § Database bila ada
- [ ] Tidak mengubah file migration lama yang **sudah** di production
- [ ] Kode aplikasi (queries/repo) selaras dengan schema — snippet [`feature-scaffold/examples/`](../feature-scaffold/examples/)

## Apply manual

1. Review SQL (peer/DBA bila perlu)
2. Jalankan script ke DB target (dev/staging) dengan client MySQL yang dipakai tim
3. Verifikasi schema + smoke test endpoint/consumer terkait
4. **Tidak** menambah script apply otomatis di pipeline tanpa persetujuan tim

## Larangan

- Jangan edit ulang migration yang sudah diterapkan di production (buat file baru)
- Jangan duplikasi full README package atau layering HTTP
- Jangan mutasi data kompleks tanpa backup/rollback plan (catat di PR/komentar)

## Skill terkait

| Situasi | Skill |
| ------- | ----- |
| Scaffold endpoint + checklist layer | [`feature-scaffold`](../feature-scaffold/SKILL.md) |
| Plan dari PRD § Database | [`dev-plan-api`](../dev-plan-api/SKILL.md) |
