# New feature flow

Buat: fitur baru yang masih berupa ide mentah / item backlog, sampai jadi
kode yang di-review dan siap deploy.

## Urutan

1. **`brd-grill`** — kalau titik mulainya backlog item mentah dan butuh
   dampak proses/UI/kamus data digali dulu. Skip kalau kamu udah punya BRD
   atau requirement udah jelas.
2. **`prd-grill`** — ubah BRD (atau ide mentah langsung) jadi PRD + checklist
   eksekusi lewat tanya-jawab satu-pertanyaan-per-giliran.
3. **`exec-todo`** — eksekusi checklist dari `prd-grill` sebagai task list
   ter-tracking, sinkron checkbox file ↔ session.
4. **`test-case-matrix`** (opsional, sebelum/parallel implementasi) — kalau
   fitur butuh test coverage terencana, bukan cuma ditulis ad-hoc.
5. **`code-review-and-quality`** — review lima-axis sebelum merge. Bisa
   dipanggil manual atau lewat agent `reviewer`.
6. **`deployment`** — checklist rilis aman: risk classification, rollout
   bertahap, rollback plan.

## Diagram

```mermaid
flowchart TD
    Start([Backlog item mentah]) --> Q1{Dampak proses/UI/data\nsudah jelas?}
    Q1 -->|belum jelas| BRD1[brd-grill: gali dampak proses/UI/kamus data]
    BRD1 --> BRD2[brd-grill: tanya-jawab 1 pertanyaan/giliran]
    BRD2 --> BRD3[brd-grill: opsional tabel estimasi effort]
    BRD3 --> PRD1
    Q1 -->|sudah jelas| PRD1[prd-grill: tanya-jawab 1 pertanyaan/giliran]
    PRD1 --> PRD2[prd-grill: tulis PRD + checklist ISSUES]
    PRD2 --> EXEC1[exec-todo: sync checklist file <-> session]
    EXEC1 --> EXEC2[exec-todo: eksekusi task satu per satu]
    EXEC2 -.opsional / paralel.-> TCM[test-case-matrix: matrix + traceability]
    EXEC2 --> EXEC3[exec-todo: closing gate repo]
    TCM -.-> REV1
    EXEC3 --> REV1[code-review-and-quality: review 5-axis]
    REV1 --> REV2{Approve?}
    REV2 -->|minta revisi| EXEC2
    REV2 -->|approve| DEP1[deployment: risk classification]
    DEP1 --> DEP2[deployment: pre-deploy checklist]
    DEP2 --> DEP3[deployment: rollout bertahap feature flag/canary]
    DEP3 --> DEP4[deployment: verifikasi pasca-deploy]
    DEP4 --> End([Selesai])
```

```mermaid
sequenceDiagram
    participant Dev
    participant BRD as brd-grill
    participant PRD as prd-grill
    participant Exec as exec-todo
    participant TCM as test-case-matrix
    participant Rev as code-review-and-quality
    participant Dep as deployment

    opt requirement belum jelas
        Dev->>BRD: backlog item mentah
        BRD-->>Dev: BRD (dampak proses/UI/data) + estimasi effort
    end
    Dev->>PRD: BRD atau ide mentah
    PRD-->>Dev: PRD + checklist ISSUES
    Dev->>Exec: checklist dari PRD
    opt fitur butuh test coverage terencana
        Dev->>TCM: PRD/issue
        TCM-->>Dev: test case matrix + traceability
    end
    Exec-->>Dev: implementasi selesai, checklist ter-checked
    Dev->>Rev: diff/PR
    Rev-->>Dev: findings 5-axis
    alt ada revisi
        Dev->>Exec: perbaiki sesuai findings
        Exec-->>Dev: revisi selesai
        Dev->>Rev: re-review
    end
    Rev-->>Dev: approve
    Dev->>Dep: rencana rilis
    Dep-->>Dev: risk class + rollout plan + rollback plan
    Dep-->>Dev: verifikasi pasca-deploy
```

## Contoh

- Backlog item "tambah export CSV di halaman laporan" → `brd-grill` (karena
  belum jelas dampaknya ke data yang di-export) → `prd-grill` → `exec-todo`
  → `code-review-and-quality` → `deployment`.
- Requirement udah jelas dari stakeholder (skip BRD) → langsung `prd-grill`
  → `exec-todo` → `code-review-and-quality`.
