# Test Matrix — <Nama Fitur>

**Sumber requirement:** <link PRD/ISSUES/BRD/issue, atau "informal — dari deskripsi user">
**Tanggal:** <YYYY-MM-DD>
**Scope:** <apa yang dicakup>
**Out of scope:** <apa yang eksplisit tidak dicakup>

## Test Cases

Satu tabel per kategori/prioritas. Status pakai `[ ]` (belum) / `[V]`
(lulus & terverifikasi) di kolom pertama — ini satu-satunya tempat status
dilacak, tidak ada checklist terpisah lagi. `Files` berisi path source
code yang diuji/terkait (komponen, page, hook, endpoint) — bukan cuma link
requirement — supaya kalau file itu berubah, jelas test case mana yang
harus dicek ulang.

### <Kategori 1> (P0)

| Status | ID | Title | Files | Precondition | Test data | Steps → Expected | Post-condition | Requirement |
|---|---|---|---|---|---|---|---|---|
| [V] | TC-F-01 | <judul deskriptif> | `src/pages/Login.tsx`, `src/hooks/useAuth.ts` | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil><br>2. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |
| [ ] | TC-F-02 | <judul deskriptif> | `src/components/ProductForm.tsx` | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |

### <Kategori 2> (P1)

| Status | ID | Title | Files | Precondition | Test data | Steps → Expected | Post-condition | Requirement |
|---|---|---|---|---|---|---|---|---|
| [ ] | TC-E-01 | <judul deskriptif> | `src/pages/Login.tsx` | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |
| [ ] | TC-ERR-01 | <judul deskriptif> | `src/api/products.ts` | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |

## Traceability Matrix

| Requirement | Test Case(s) | Covered? |
|---|---|---|
| REQ-1: <ringkas> | TC-F-01, TC-ERR-01 | ✅ |
| REQ-2: <ringkas> | TC-F-02 | ✅ |
| REQ-3: <ringkas> | — | ⚠️ Gap |
