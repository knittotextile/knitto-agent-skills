# Test Matrix — <Nama Fitur>

**Sumber requirement:** <link PRD/ISSUES/BRD/issue, atau "informal — dari deskripsi user">
**Tester:** <nama, atau "belum diisi"> · **Programmer:** <nama, atau "belum diisi">
**Dibuat:** <YYYY-MM-DD> · **Diupdate:** <YYYY-MM-DD>
**Scope:** <apa yang dicakup>
**Out of scope:** <apa yang eksplisit tidak dicakup>

## Summary

Hitung ulang dari kolom `Status` di tabel Test Cases setiap file ini diupdate —
jangan dipelihara terpisah.

| Total | Passed | Failed | Re-Test | Skip | Automation % |
|---|---|---|---|---|---|
| <n> | <n> | <n> | <n> | <n> | <n%> |

## Parameter Matrix

Hanya diisi kalau fitur punya variabel yang saling berkombinasi (skip
section ini kalau nggak relevan — lihat Step 2 di SKILL.md).

| Variable | Value 1 | Value 2 | Value 3 |
|---|---|---|---|
| <nama variable> | <value> | <value> | <value> |

### Kombinasi yang diuji

| Kombinasi | <Variable 1> | <Variable 2> | Behavior beda? |
|---|---|---|---|
| K1 | <value> | <value> | <ya/tidak, kenapa> |
| K2 | <value> | <value> | <ya/tidak, kenapa> |

## Test Cases

Satu tabel per kategori/prioritas. Nama kolom mengikuti istilah tester
manual (bahasa Inggris, jangan diterjemahkan) — isinya ditulis dalam
**Bahasa Indonesia**. Status: `[ ]` belum, `[V]` passed, `[X]` failed,
`[R]` perlu re-test, `[S]` skip — ini satu-satunya tempat status
dilacak, tidak ada checklist terpisah. `Files` berisi path source code
yang diuji/terkait (komponen, page, hook, endpoint) — bukan cuma link
requirement — supaya kalau file itu berubah, jelas test case mana yang
harus dicek ulang. `TYPE` `+` = skenario positif/input valid, `-` =
skenario negatif/input invalid.

### <Kategori 1> (P0)

| Status | Test Case ID | Group No | Feature | Process No (FC) | TYPE | Test Case | Test Variable | Files | Pre-Condition | Test Data | Test Steps | Expected Result | Requirement | Evidence | Automation Tools | Remarks | Date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [V] | TC-F-01 | 1 | <nama sub-fitur/flow> | <FC x.x - Proses x, atau kosong> | + | <judul deskriptif, ID> | K1 — <ringkas variasi input> | `src/pages/Login.tsx`, `src/hooks/useAuth.ts` | <state awal, ID> | <input spesifik, ID> | 1. <aksi, ID><br>2. <aksi, ID> | 1. <hasil, ID><br>2. <hasil, ID> | <link requirement> | <link screenshot/recording> | Automated (`e2e/login.spec.ts`) | | 2026-08-28 |
| [ ] | TC-F-02 | 1 | <nama sub-fitur/flow> | | - | <judul deskriptif, ID> | K2 — <ringkas variasi input> | `src/components/ProductForm.tsx` | <state awal, ID> | <input spesifik, ID> | 1. <aksi, ID> | 1. <hasil, ID> | <link requirement> | | Planned | | |

### <Kategori 2> (P1)

| Status | Test Case ID | Group No | Feature | Process No (FC) | TYPE | Test Case | Test Variable | Files | Pre-Condition | Test Data | Test Steps | Expected Result | Requirement | Evidence | Automation Tools | Remarks | Date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [ ] | TC-E-01 | 2 | <nama sub-fitur/flow> | | - | <judul deskriptif, ID> | <ringkas variasi input> | `src/pages/Login.tsx` | <state awal, ID> | <input spesifik, ID> | 1. <aksi, ID> | 1. <hasil, ID> | <link requirement> | | Manual | | |
| [ ] | TC-ERR-01 | 2 | <nama sub-fitur/flow> | | - | <judul deskriptif, ID> | <ringkas variasi input> | `src/api/products.ts` | <state awal, ID> | <input spesifik, ID> | 1. <aksi, ID> | 1. <hasil, ID> | <link requirement> | | Planned | | |

## Traceability Matrix

| Requirement | Test Case(s) | Covered? |
|---|---|---|
| REQ-1: <ringkas> | TC-F-01, TC-ERR-01 | ✅ |
| REQ-2: <ringkas> | TC-F-02 | ✅ |
| REQ-3: <ringkas> | — | ⚠️ Gap |
