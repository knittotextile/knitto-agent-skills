# Bug fix flow

Buat: ada bug yang perlu diperbaiki, dari laporan sampai fix yang di-review.

## Urutan

1. **`debugging`** — metodologi root-cause: reproduksi konsisten, isolasi ke
   kasus terkecil, bisect ke penyebab, uji hipotesis sebelum fix. Jangan
   langsung nulis fix sebelum root cause jelas.
2. **`test-driven-development`** — tulis test yang gagal karena bug ini
   dulu, baru fix sampai test-nya lulus. Test ini juga jadi regression guard.
3. **`code-review-and-quality`** — review sebelum merge, khususnya axis
   correctness — pastikan fix nggak cuma nutup gejala.

## Diagram

```mermaid
flowchart TD
    Start([Bug dilaporkan]) --> D1[debugging: reproduksi konsisten]
    D1 --> D2[debugging: isolasi ke kasus terkecil]
    D2 --> D3[debugging: bisect ke penyebab regresi]
    D3 --> D4[debugging: uji hipotesis root cause]
    D4 --> D5{Root cause valid?}
    D5 -->|tidak| D3
    D5 -->|ya| T1[test-driven-development: tulis test yang gagal\nkarena reproduksi bug]
    T1 --> T2[test-driven-development: implementasi fix]
    T2 --> T3{Test lulus?}
    T3 -->|belum| T2
    T3 -->|ya| R1[code-review-and-quality: review 5-axis,\nfokus correctness]
    R1 --> R2{Approve?}
    R2 -->|minta revisi| T2
    R2 -->|approve| End([Merge])
```

```mermaid
sequenceDiagram
    participant Dev
    participant Debug as debugging
    participant TDD as test-driven-development
    participant Rev as code-review-and-quality

    Dev->>Debug: laporan bug
    Debug-->>Dev: reproduksi konsisten
    Debug-->>Dev: isolasi ke kasus terkecil
    Debug-->>Dev: bisect + uji hipotesis root cause
    Debug-->>Dev: root cause terverifikasi
    Dev->>TDD: root cause
    TDD-->>Dev: test baru (gagal, reproduksi bug)
    TDD-->>Dev: fix diimplementasikan
    TDD-->>Dev: test lulus
    Dev->>Rev: diff (test + fix)
    Rev-->>Dev: findings 5-axis (fokus correctness)
    alt ada revisi
        Dev->>TDD: perbaiki fix
        TDD-->>Dev: test lulus lagi
        Dev->>Rev: re-review
    end
    Rev-->>Dev: approve
```

## Contoh

- Bug "harga di keranjang salah kalau ada diskon bertumpuk" →
  `debugging` (reproduksi kombinasi diskon yang bikin salah, isolasi ke
  fungsi hitung harga) → `test-driven-development` (test kasus diskon
  bertumpuk, fix sampai lulus) → `code-review-and-quality`.
