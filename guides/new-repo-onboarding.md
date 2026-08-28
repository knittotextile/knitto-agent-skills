# New repo onboarding flow

Buat: sesi pertama kali kerja di repo/project yang belum dikenal agent.
Jalankan sekali di awal, bukan ritual tiap sesi.

## Urutan

1. **`project-bootstrap`** — deteksi stack/tooling, install dependency,
   verifikasi project benar-benar jalan (build/test/dev), lalu tulis/update
   `CLAUDE.md`/`AGENTS.md` dengan command yang sudah diverifikasi.
2. **`agent-doctor`** — kalau repo ini juga punya subagent terpasang
   (`agents/`), verifikasi subagent-nya beneran bisa jalan di platform
   kamu saat ini (lokasi file, frontmatter, akses model).

## Diagram

```mermaid
flowchart TD
    Start([Clone repo baru]) --> B1[project-bootstrap: deteksi stack/tooling]
    B1 --> B2[project-bootstrap: install dependency]
    B2 --> B3[project-bootstrap: verifikasi build/test/dev jalan]
    B3 --> B4[project-bootstrap: tulis/update CLAUDE.md atau AGENTS.md]
    B4 --> C1{Repo punya folder agents/?}
    C1 -->|ya| A1[agent-doctor: cek lokasi file subagent]
    A1 --> A2[agent-doctor: cek frontmatter sesuai dialek platform]
    A2 --> A3[agent-doctor: cek akses model]
    A3 --> A4{Ada yang bermasalah?}
    A4 -->|ya| A5[agent-doctor: perbaiki + live-invoke test]
    A5 --> End([Siap kerja])
    A4 -->|tidak| End
    C1 -->|tidak| End
```

```mermaid
sequenceDiagram
    participant Dev
    participant Boot as project-bootstrap
    participant Doc as agent-doctor

    Dev->>Boot: repo baru/belum dikenal
    Boot-->>Dev: stack/tooling terdeteksi
    Boot-->>Dev: dependency terinstall
    Boot-->>Dev: build/test/dev terverifikasi jalan
    Boot-->>Dev: CLAUDE.md/AGENTS.md ditulis/diupdate
    opt repo punya folder agents/
        Dev->>Doc: subagent yang terpasang
        Doc-->>Dev: status tiap subagent (lokasi, frontmatter, akses model)
        opt ada yang bermasalah
            Doc-->>Dev: perbaikan + live-invoke test
        end
    end
    Dev-->>Dev: siap mulai kerja
```

## Contoh

- Clone repo baru, belum ada `CLAUDE.md` → `project-bootstrap` dulu supaya
  command build/test yang ditulis di `CLAUDE.md` udah terverifikasi jalan,
  bukan ditebak dari `package.json` doang.
