# QA flow

Buat: nambah test coverage buat fitur (baru atau existing). Setara sama
apa yang dilakukan agent `qa-engineer` — pakai flow ini kalau kerja tanpa
subagent atau mau kontrol tiap langkahnya manual.

## Urutan

1. **`test-case-matrix`** — selalu mulai dari sini. Tulis matrix test case
   (functional/edge/error/state) dari PRD/issue jadi checklist markdown +
   traceability matrix, sebelum test code ditulis.
2. Pilih skill implementasi sesuai layer:
   - **`react-testing`** — component test (RTL, Vitest/Jest, MSW, axe).
   - **`e2e-testing`** — pola Playwright E2E umum (Page Object Model, CI/CD).
   - **`webapp-testing`** — kalau butuh workflow E2E+TDD siap-eksekusi
     local-only dengan report kustom (`run_e2e.py` + `report.html`),
     bukan cuma pola Playwright.

## Diagram

```mermaid
flowchart TD
    Start([Fitur baru/existing butuh test]) --> T1[test-case-matrix: functional cases]
    T1 --> T2[test-case-matrix: edge cases]
    T2 --> T3[test-case-matrix: error cases]
    T3 --> T4[test-case-matrix: state cases]
    T4 --> T5[test-case-matrix: traceability matrix]
    T5 --> L{Layer test?}
    L -->|component| RT[react-testing: RTL/Vitest/Jest + MSW/axe]
    L -->|E2E pattern umum| ET[e2e-testing: Page Object Model + CI/CD]
    L -->|E2E+TDD local, report kustom| WT[webapp-testing: run_e2e.py + report.html]
    RT --> End([Test coverage siap])
    ET --> End
    WT --> End
```

```mermaid
sequenceDiagram
    participant Dev
    participant TCM as test-case-matrix
    participant RT as react-testing
    participant ET as e2e-testing
    participant WT as webapp-testing

    Dev->>TCM: PRD/issue
    TCM-->>Dev: matrix (functional/edge/error/state) + traceability
    alt component test
        Dev->>RT: matrix
        RT-->>Dev: test RTL/Vitest + MSW/axe
    else E2E pattern umum
        Dev->>ET: matrix
        ET-->>Dev: test Playwright (POM) + CI/CD wiring
    else E2E+TDD local, report kustom
        Dev->>WT: matrix
        WT-->>Dev: run_e2e.py + report.html (self-contained)
    end
```

## Contoh

- Fitur checkout baru → `test-case-matrix` (list semua skenario: bayar
  sukses, kartu ditolak, keranjang kosong, dst) → `webapp-testing` buat
  eksekusi E2E-nya local dengan report yang bisa di-review.
