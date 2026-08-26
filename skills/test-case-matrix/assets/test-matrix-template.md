# Test Matrix — <Nama Fitur>

**Sumber requirement:** <link PRD/ISSUES/BRD/issue, atau "informal — dari deskripsi user">
**Tanggal:** <YYYY-MM-DD>
**Scope:** <apa yang dicakup>
**Out of scope:** <apa yang eksplisit tidak dicakup>

## Test Case Checklist

Satu-satunya tempat status jalan/belum dilacak — checklist di sini, bukan
di tabel detail di bawah, biar tidak dobel.

### <Kategori 1> (P0)

- [ ] TC-F-01 — <judul singkat>
- [ ] TC-F-02 — <judul singkat>

### <Kategori 2> (P1)

- [ ] TC-E-01 — <judul singkat>
- [ ] TC-ERR-01 — <judul singkat>

## Test Case Detail

Satu tabel per kategori/grup yang sama dengan checklist di atas. Kolom
`Steps → Expected` dipadatkan pakai `<br>` per baris (bernomor), bukan
bullet list terpisah, supaya satu test case = satu baris tabel yang bisa
di-scan cepat.

### <Kategori 1> (P0)

| ID | Title | Precondition | Test data | Steps → Expected | Post-condition | Requirement |
|---|---|---|---|---|---|---|
| TC-F-01 | <judul deskriptif> | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil><br>2. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |
| TC-F-02 | <judul deskriptif> | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |

### <Kategori 2> (P1)

| ID | Title | Precondition | Test data | Steps → Expected | Post-condition | Requirement |
|---|---|---|---|---|---|---|
| TC-E-01 | <judul deskriptif> | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |
| TC-ERR-01 | <judul deskriptif> | <state awal> | <input spesifik> | 1. <aksi> → **Expected:** <hasil> | <state akhir> | <link requirement> |

## Traceability Matrix

| Requirement | Test Case(s) | Covered? |
|---|---|---|
| REQ-1: <ringkas> | TC-F-01, TC-ERR-01 | ✅ |
| REQ-2: <ringkas> | TC-F-02 | ✅ |
| REQ-3: <ringkas> | — | ⚠️ Gap |
